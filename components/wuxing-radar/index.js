Component({
  options: { pureDataPattern: /^_/ },

  properties: {
    scores:   { type: Object,  value: null },
    width:    { type: Number,  value: 560 }, // rpx
    height:   { type: Number,  value: 360 }, // rpx
    autoplay: { type: Boolean, value: true },
    waveAmp:  { type: Number,  value: 6 },   // rpx
    waveFreq: { type: Number,  value: 2.0 },
    waveSpeed:{ type: Number,  value: 0.6 },
    breathe:  { type: Number,  value: 0.02 }
  },

  observers: {
    scores(val) {
      this._scores = val;
      if (this._ctx && val) this._renderFrame(val, this._lastT || 0);
    }
  },

  lifetimes: {
    attached() {
      // 提前缓存 windowWidth
      const w = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
      this._windowWidth = w.windowWidth;
    },
    ready() {
      this._initCanvasWithRetry();
    },
    detached() { this._stopAnim(); }
  },

  pageLifetimes: {
    show() { if (this.properties.autoplay) this._startAnim(); },
    hide() { this._stopAnim(); }
  },

  methods: {
    // —— 安全封装：拿不到 node 就重试（最多 2 次）
    _initCanvasWithRetry(retry = 0) {
      this.createSelectorQuery()
        .in(this)
        .select('#radarCanvas')
        .fields({ node: true, size: true })
        .exec(res => {
          const info = res && res[0];
          const canvas = info && info.node;
          if (!canvas) {
            if (retry < 2) {
              // 可能组件刚插入，下一帧再试
              wx.nextTick(() => this._initCanvasWithRetry(retry + 1));
              return;
            }
            console.warn('[wuxing-radar] 获取 canvas 失败，检查 id/路径/usingComponents');
            return;
          }
          this._setupCanvas(canvas);
        });
    },

    _setupCanvas(canvas) {
      const ctx = canvas.getContext('2d');

      const sys = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
      const dpr = sys.pixelRatio || 2;

      const viewW = this._rpx2px(this.properties.width);
      const viewH = this._rpx2px(this.properties.height);

      // 这里就是你报错的地方；加了空值保护
      if (!canvas) return;

      canvas.width  = Math.round(viewW * dpr);
      canvas.height = Math.round(viewH * dpr);
      canvas.style.width  = `${viewW}px`;
      canvas.style.height = `${viewH}px`;
      ctx.scale(dpr, dpr);

      this._canvas = canvas;
      this._ctx = ctx;
      this._W = viewW;
      this._H = viewH;

      if (this.properties.autoplay) this._startAnim();
      if (this._scores) this._renderFrame(this._scores, 0);
    },

    _startAnim() {
      if (!this._canvas || this._animId) return;
      this._t0 = Date.now();
      const tick = () => {
        const t = (Date.now() - this._t0) / 1000;
        this._lastT = t;
        if (this._scores) this._renderFrame(this._scores, t);
        this._animId = this._canvas.requestAnimationFrame(tick);
      };
      this._animId = this._canvas.requestAnimationFrame(tick);
    },

    _stopAnim() {
      if (this._canvas && this._animId) {
        this._canvas.cancelAnimationFrame(this._animId);
        this._animId = null;
      }
    },

    _renderFrame(scores, t) {
      const ctx = this._ctx; if (!ctx) return;
      const W = this._W, H = this._H;
      const cx = W / 2, cy = H / 2 + this._rpx2px(4);

      const baseR = Math.min(W * 0.38, H * 0.44);
      const R = baseR * (1 + this.properties.breathe * Math.sin(t * Math.PI * 0.5));

      ctx.clearRect(0, 0, W, H);

      const labels = ['木','火','土','金','水'];
      const angles = labels.map((_, i) => -Math.PI/2 + i*2*Math.PI/labels.length);

      // 背景网格
      ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(0,0,0,0.06)';
      for (let k=1;k<=5;k++){
        const r = R*k/5; ctx.beginPath();
        for (let i=0;i<angles.length;i++){
          const x = cx + r*Math.cos(angles[i]);
          const y = cy + r*Math.sin(angles[i]);
          i===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
        }
        ctx.closePath(); ctx.stroke();
      }
      // 轴线
      for (let i=0;i<angles.length;i++){
        const a = angles[i];
        ctx.beginPath(); ctx.moveTo(cx,cy);
        ctx.lineTo(cx + R*Math.cos(a), cy + R*Math.sin(a));
        ctx.stroke();
      }

      // 顶点
      const val = k => (scores[k] || 0) / 100;
      const pts = angles.map((ang,i)=>{
        const rr = R * val(labels[i]);
        return { x: cx + rr*Math.cos(ang), y: cy + rr*Math.sin(ang) };
      });

      // 波浪边
      const amp   = this._rpx2px(this.properties.waveAmp);
      const speed = this.properties.waveSpeed;
      const freq  = this.properties.waveFreq;
      const SAMPLES = 48;

      ctx.fillStyle   = 'rgba(25,60,122,0.16)';
      ctx.strokeStyle = 'rgba(25,60,122,0.38)';
      ctx.lineWidth   = 2;

      ctx.beginPath();
      for (let e=0; e<pts.length; e++){
        const a = pts[e], b = pts[(e+1)%pts.length];
        const tx = b.x - a.x, ty = b.y - a.y;
        const len = Math.hypot(tx,ty) || 1;
        const nx = -ty/len, ny = tx/len;

        for (let s=0; s<=SAMPLES; s++){
          const u = s/SAMPLES;
          const bx = a.x + tx*u, by = a.y + ty*u;
          const phase = e*Math.PI/3;
          const off = amp * Math.sin(u*2*Math.PI*freq + t*speed*2*Math.PI + phase);
          const x = bx + nx*off*0.5, y = by + ny*off*0.5;
          (e===0 && s===0) ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
        }
      }
      ctx.closePath(); ctx.fill(); ctx.stroke();

      // 边外文字
      ctx.fillStyle = '#444';
      ctx.font = `${this._rpx2px(22)}px sans-serif`;
      for (let e=0; e<pts.length; e++){
        const a = pts[e], b = pts[(e+1)%pts.length];
        const mx = (a.x+b.x)/2, my = (a.y+b.y)/2;
        const tx = b.x - a.x, ty = b.y - a.y;
        const len = Math.hypot(tx,ty)||1, nx = -ty/len, ny = tx/len;
        const lx = mx + nx*this._rpx2px(18), ly = my + ny*this._rpx2px(18);
        const key = labels[(e+1)%pts.length], v = scores[key] || 0;
        const approx = this._rpx2px(44);
        ctx.fillText(`${key} ${v}`, lx >= cx ? lx : lx - approx, ly + this._rpx2px(6));
      }
    },

    _rpx2px(rpx) {
      const w = this._windowWidth || (wx.getWindowInfo ? wx.getWindowInfo().windowWidth : wx.getSystemInfoSync().windowWidth);
      return (rpx * w) / 750;
    }
  }
});
