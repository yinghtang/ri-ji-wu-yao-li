// components/wuxing-radar/index.js
Component({
  properties: {
    scores: { type: Object, value: { "木": 60, "火": 80, "土": 50, "金": 40, "水": 70 } },
    size:   { type: Number, value: 260 },
    levels: { type: Number, value: 5 }
  },

  data: { _mode: '2d' }, // '2d' | 'legacy'

  lifetimes: {
    attached() { this._init(); },
    ready() { this._draw(); }
  },

  observers: {
    'scores, size, levels': function () { this._draw(); }
  },

  methods: {
    _init() {
      // 优先尝试 2D Canvas node
      const dpr = wx.getSystemInfoSync().pixelRatio || 1;
      this.dpr = dpr;

      const query = this.createSelectorQuery().in(this); // 关键：限定在组件内
      query.select('#radar').fields({ node: true, size: true }).exec(res => {
        const item = res && res[0];
        if (item && item.node) {
          // —— 2D 模式 ——
          const canvas = item.node;
          const width  = this.data.size * dpr;
          const height = this.data.size * dpr;
          canvas.width  = width;
          canvas.height = height;

          this.canvas = canvas;
          this.ctx = canvas.getContext('2d');
          this.setData({ _mode: '2d' }, () => this._draw());
        } else {
          // —— 兜底：老 Canvas 模式 ——
          this.setData({ _mode: 'legacy' }, () => this._drawLegacyInit());
        }
      });
    },

    _draw() {
      if (this.data._mode === '2d') this._draw2d();
      else if (this.data._mode === 'legacy') this._drawLegacy();
    },

    /* ================= 2D Canvas 版本 ================= */
    _draw2d() {
      if (!this.ctx) return;
      const ctx = this.ctx;
      const size = this.data.size * this.dpr;
      const cx = size / 2, cy = size / 2;
      const radius = size * 0.42;
      const axes = ["木", "火", "土", "金", "水"];
      const levels = Math.max(1, this.data.levels);

      ctx.clearRect(0, 0, size, size);
      ctx.lineWidth = 1 * this.dpr;
      ctx.font = `${12 * this.dpr}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (let l = 1; l <= levels; l++) {
        const r = (radius / levels) * l;
        ctx.beginPath();
        axes.forEach((_, i) => {
          const ang = (Math.PI * 2 / axes.length) * i - Math.PI / 2;
          const x = cx + r * Math.cos(ang);
          const y = cy + r * Math.sin(ang);
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.strokeStyle = '#e5e5e5';
        ctx.stroke();
      }

      axes.forEach((k, i) => {
        const ang = (Math.PI * 2 / axes.length) * i - Math.PI / 2;
        const x = cx + radius * Math.cos(ang);
        const y = cy + radius * Math.sin(ang);
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x, y);
        ctx.strokeStyle = '#ddd'; ctx.stroke();

        const lx = cx + (radius + 16 * this.dpr) * Math.cos(ang);
        const ly = cy + (radius + 16 * this.dpr) * Math.sin(ang);
        ctx.fillStyle = '#333'; ctx.fillText(k, lx, ly);
      });

      const vals = ["木","火","土","金","水"].map(k => {
        const v = Number(this.data.scores?.[k] ?? 0);
        return Math.max(0, Math.min(100, v));
      });

      ctx.beginPath();
      vals.forEach((v, i) => {
        const ang = (Math.PI * 2 / vals.length) * i - Math.PI / 2;
        const r = radius * (v / 100);
        const x = cx + r * Math.cos(ang);
        const y = cy + r * Math.sin(ang);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.fillStyle = 'rgba(66,133,244,0.25)'; ctx.fill();
      ctx.strokeStyle = '#4285F4'; ctx.lineWidth = 2 * this.dpr; ctx.stroke();

      vals.forEach((v, i) => {
        const ang = (Math.PI * 2 / vals.length) * i - Math.PI / 2;
        const r = radius * (v / 100);
        const x = cx + r * Math.cos(ang);
        const y = cy + r * Math.sin(ang);
        ctx.beginPath(); ctx.arc(x, y, 3 * this.dpr, 0, Math.PI * 2);
        ctx.fillStyle = '#4285F4'; ctx.fill();
      });
    },

    /* ============== 旧 Canvas（createCanvasContext）版 ============== */
    _drawLegacyInit() {
      // 老版不支持 devicePixelRatio 设置画布宽高，这里用 CSS 控大小
      this.ctxLegacy = wx.createCanvasContext('radar', this);
      this._drawLegacy();
    },

    _drawLegacy() {
      const ctx = this.ctxLegacy;
      if (!ctx) return;

      const size = this.data.size; // 旧接口按 CSS 尺寸作图
      const cx = size / 2, cy = size / 2;
      const radius = size * 0.42;
      const axes = ["木", "火", "土", "金", "水"];
      const levels = Math.max(1, this.data.levels);

      // 参考网格
      for (let l = 1; l <= levels; l++) {
        const r = (radius / levels) * l;
        axes.forEach((_, i) => {
          const ang = (Math.PI * 2 / axes.length) * i - Math.PI / 2;
          const x = cx + r * Math.cos(ang);
          const y = cy + r * Math.sin(ang);
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        });
        ctx.setStrokeStyle('#e5e5e5'); ctx.stroke();
        ctx.beginPath();
      }

      // 轴线 + 标签
      axes.forEach((k, i) => {
        const ang = (Math.PI * 2 / axes.length) * i - Math.PI / 2;
        const x = cx + radius * Math.cos(ang);
        const y = cy + radius * Math.sin(ang);
        ctx.moveTo(cx, cy); ctx.lineTo(x, y);
        ctx.setStrokeStyle('#ddd'); ctx.stroke(); ctx.beginPath();

        const lx = cx + (radius + 16) * Math.cos(ang);
        const ly = cy + (radius + 16) * Math.sin(ang);
        ctx.setFillStyle('#333'); ctx.setFontSize(12); ctx.fillText(k, lx - 6, ly + 4);
      });

      // 数据区
      const vals = ["木","火","土","金","水"].map(k => {
        const v = Number(this.data.scores?.[k] ?? 0);
        return Math.max(0, Math.min(100, v));
      });

      vals.forEach((v, i) => {
        const ang = (Math.PI * 2 / vals.length) * i - Math.PI / 2;
        const r = radius * (v / 100);
        const x = cx + r * Math.cos(ang);
        const y = cy + r * Math.sin(ang);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.setFillStyle('rgba(66,133,244,0.25)'); ctx.fill();
      ctx.setStrokeStyle('#4285F4'); ctx.setLineWidth(2); ctx.stroke();

      // 顶点圆点
      vals.forEach((v, i) => {
        const ang = (Math.PI * 2 / vals.length) * i - Math.PI / 2;
        const r = radius * (v / 100);
        const x = cx + r * Math.cos(ang);
        const y = cy + r * Math.sin(ang);
        ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.setFillStyle('#4285F4'); ctx.fill();
      });

      ctx.draw();
    }
  }
});
