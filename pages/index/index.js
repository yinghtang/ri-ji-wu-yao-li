// 替换为你的真实 Key；确保把 https://apis.tianapi.com 配到 request 合法域名
const TIAN_KEY = '你的天行数据KEY';

Page({
  data: {
    heroImages: [
      '/assets/p/p-earth.jpg',
      '/assets/p/p-water.jpg',
      '/assets/p/p-wood.jpg'
    ],
    calendar: {},                                 // 黄历对象
    wuxingScoresCN: { 木:60, 火:80, 土:50, 金:40, 水:70 }, // 初始示例分
    recommend: { name: '青木手串', img: '/assets/p/p-wood.jpg', desc: '生发舒展，助力平衡', tags: ['木旺','今日应景'] }
  },

  onLoad() {
    this.fetchCalendar();
  },

  // 拉取黄历 + 计算五行 + 更新推荐
  fetchCalendar() {
    wx.request({
      url: 'https://apis.tianapi.com/lunar/index',
      method: 'GET',
      data: { key:"b988a9f83124836eed4cf203b143e40f"},
      success: (res) => {
        const { code, result } = res.data || {};
        if (code !== 200 || !result) {
          // 接口异常也保留已有 UI
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

        // 1) 算五行
        const scoresCN = this.computeScoresFromLunar(calendar);
        // 2) 算推荐
        const recommend = this.getRecommend(scoresCN);

        // 一次性更新，避免异步时序导致组件拿不到数据
        this.setData({ calendar, wuxingScoresCN: scoresCN, recommend });
      },
      fail: () => {
        // 网络失败时不清空 UI
      }
    });
  },

  // 五行打分（占位：你可以替换为正式算法）
  computeScoresFromLunar(calendar) {
    // 可以根据 tiangandizhiyear / month / day 做映射；先给稳定返回
    return { 木: 62, 火: 71, 土: 53, 金: 41, 水: 66 };
  },

  // 推荐映射：根据最高分挑手串
  getRecommend(scoresCN) {
    const arr = Object.entries(scoresCN).sort((a,b)=>b[1]-a[1]);
    const top = arr[0][0];
    const map = {
      '火': { name: '赤炎手串', img: '/assets/p/p-fire.jpg',  desc: '热忱昂扬，聚能提气', tags: ['火旺','旺运'] },
      '木': { name: '青木手串', img: '/assets/p/p-wood.jpg',  desc: '生发舒展，助力平衡', tags: ['木旺','舒展'] },
      '土': { name: '厚土手串', img: '/assets/p/p-earth.jpg', desc: '厚德载物，安稳沉着', tags: ['土旺','安定'] },
      '金': { name: '清金手串', img: '/assets/p/p-metal.jpg', desc: '清肃决断，清心凝神', tags: ['金旺','清心'] },
      '水': { name: '沧海手串', img: '/assets/p/p-water.jpg', desc: '灵动涵养，宁神益智', tags: ['水旺','静心'] }
    };
    return map[top] || map['木'];
  }
});
