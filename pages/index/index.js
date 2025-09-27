const TIAN_KEY = 'b988a9f83124836eed4cf203b143e40f';

Page({
  data: {
    heroImages: [
      '/assets/hero-calendar/hero-calendar-3.jpg',
      '/assets/hero-calendar/hero-calendar-5.jpg',
      '/assets/hero-calendar/hero-calendar-7.jpg'
    ],
    calendar: {},
    // 组件吃「中文键」：{ 木/火/土/金/水 }
    wuxingScoresCN: { 木: 60, 火: 80, 土: 50, 金: 40, 水: 70 },
    recommend: {
      name: '青木手串',
      img: '/assets/p/p-wood.jpg',
      desc: '生发、舒展平衡',
      tags: ['木旺','今日应景']
    }
  },

  onLoad() {
    // 1) 拉天行老黄历
    this.fetchCalendar();
    // 2) 如果你已经能在本地算当日五行（不依赖接口），也可以直接 setScoresFromYourAlgo(...)
  },

  onShow(){},

  // ———————— 天行 · 老黄历 ————————
  fetchCalendar() {
    wx.request({
      url: 'https://apis.tianapi.com/lunar/index',
      method: 'GET',
      data: { key: TIAN_KEY },
      success: (res) => {
        const { code, result } = res.data || {};
        if (code !== 200 || !result) {
          console.warn('黄历接口异常', res.data);
          return;
        }
        const calendar = {
          gregoriandate: result.gregoriandate,
          lunardate: result.lunardate,
          shengxiao: result.shengxiao,
          tiangandizhiyear: result.tiangandizhiyear,
          tiangandizhimonth: result.tiangandizhimonth,
          tiangandizhiday: result.tiangandizhiday,
          fitness: result.fitness,
          taboo: result.taboo,
          xingsu: result.xingsu,
          pengzu: result.pengzu,
          chongsha: result.chongsha,
          jianshen: result.jianshen,
          wuxingjiazi: result.wuxingjiazi || '',
          wuxingnayear: result.wuxingnayear || '',
          wuxingnamonth: result.wuxingnamonth || ''
        };

        // 关键：把你的五行打分算法接进来
        const scoresCN = this.computeScoresFromLunar(calendar); // ← 把你的代码粘进去
        this.setData({ calendar, wuxingScoresCN: scoresCN }, () => {
          this.updateRecommend(scoresCN);
        });
      },
      fail: (e) => console.error('接口失败：', e)
    });
  },

  /**
   * === 把你的“五行打分算法”粘到这里 ===
   * 入参：calendar（包含天干地支/五行年/月/日等字段）
   * 出参：必须返回中文键对象：{ 木:number, 火:number, 土:number, 金:number, 水:number } 0~100
   */
  computeScoresFromLunar(calendar){
    // TODO: 直接粘贴你的计算逻辑并 return
    // 下面先给个兜底，确保页面可运行
    const base = { 木: 60, 火: 70, 土: 50, 金: 40, 水: 65 };
    return base;
  },

  // 根据得分选推荐
  updateRecommend(scoresCN) {
    const arr = [
      ['木', scoresCN.木 || 0], ['火', scoresCN.火 || 0], ['土', scoresCN.土 || 0],
      ['金', scoresCN.金 || 0], ['水', scoresCN.水 || 0]
    ].sort((a,b)=>b[1]-a[1]);
    const top = arr[0][0];

    const map = {
      '火': { name: '赤炎手串', img: '/assets/p/p-fire.jpg',  desc: '热忱、热情昂扬', tags: ['火旺','旺运'] },
      '木': { name: '青木手串', img: '/assets/p/p-wood.jpg',  desc: '生发、舒展平衡', tags: ['木旺','疏肝'] },
      '土': { name: '厚土手串', img: '/assets/p/p-earth.jpg', desc: '稳重、厚德载物', tags: ['土旺','安定'] },
      '金': { name: '清金手串', img: '/assets/p/p-metal.jpg', desc: '清肃、果断清明', tags: ['金旺','清心'] },
      '水': { name: '沧海手串', img: '/assets/p/p-water.jpg', desc: '灵动、涵养智慧', tags: ['水旺','静心'] }
    };

    const rec = map[top] || map['木'];
    this.setData({ recommend: Object.assign({}, rec) });
  },

  // —— 导航示例 ——
  goDetail(){ wx.navigateTo({ url: '/pages/detail/detail' }); },
  goLibrary(){ wx.switchTab({ url: '/pages/library/library' }); }
});
