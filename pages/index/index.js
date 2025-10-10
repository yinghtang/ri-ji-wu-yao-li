const TIAN_KEY = "你的天行数据KEY";

Page({
  data: {
    heroImages: [
      "/assets/hero-calendar/hero-calendar-1.jpg",
      "/assets/hero-calendar/hero-calendar-3.jpg",
      "/assets/hero-calendar/hero-calendar-5.jpg"
    ],
    calendar: {},
    showCalDetail: false,
    wuxingScoresCN: { 木: 60, 火: 80, 土: 50, 金: 40, 水: 70 },
    hintText: "根据今日五行趋势给出佩戴建议",
    recommend: { name: "青木手串", img: "/assets/p/p-wood.jpg", desc: "生发舒展，助力平衡", tags: ["木旺","今日应景"] }
  },

  onLoad() { this.fetchCalendar(); },
  toggleCalendar(){ this.setData({ showCalDetail: !this.data.showCalDetail }); },
  onGoLibrary(){ wx.switchTab({ url: "/pages/library/library" }); },

  onAddWish(){
    const item = this.data.recommend;
    const list = wx.getStorageSync("wishlist") || [];
    if (!list.find(x => x.name === item.name)) list.unshift({ ...item, date: new Date().toISOString().slice(0,10) });
    wx.setStorageSync("wishlist", list);
    wx.showToast({ title: "已加入心愿单", icon: "success" });
  },

  fetchCalendar() {
    wx.request({
      url: "https://apis.tianapi.com/lunar/index",
      method: "GET",
      header: { "content-type": "application/json" },
      data: { key: TIAN_KEY },
      success: (res) => {
        const raw = res?.data?.result || (Array.isArray(res?.data?.newslist) ? res.data.newslist[0] : null);
        if (res?.data?.code !== 200 || !raw) return;
        const calendar = this.normalizeCalendar(raw);
        const scoresCN = this.computeScoresFromLunar(calendar);
        const recommend = this.getRecommend(scoresCN);
        const hintText = this.buildHint(scoresCN);
        this.setData({ calendar, wuxingScoresCN: scoresCN, recommend, hintText });
      }
    });
  },

  normalizeCalendar(raw){
    const fitness = raw.fitness || raw.yi || "";
    const taboo   = raw.taboo   || raw.ji || "";
    return {
      gregoriandate: raw.gregoriandate || raw.date || "",
      lunardate:     raw.lunardate || raw.lunar || "",
      shengxiao:     raw.shengxiao || raw.zodiac || "",
      tiangandizhiyear:  raw.tiangandizhiyear || raw.ganzhiYear  || "",
      tiangandizhimonth: raw.tiangandizhimonth|| raw.ganzhiMonth || "",
      tiangandizhiday:   raw.tiangandizhiday  || raw.ganzhiDay   || "",
      fitness, taboo,
      xingsu: raw.xingsu || "", pengzu: raw.pengzu || "",
      chongsha: raw.chongsha || raw.chong || "", jianshen: raw.jianshen || ""
    };
  },

  computeScoresFromLunar(calendar){ return { 木: 62, 火: 71, 土: 53, 金: 41, 水: 66 }; },

  getRecommend(scoresCN){
    const top = Object.entries(scoresCN).sort((a,b)=>b[1]-a[1])[0][0];
    const map = {
      火: { name:"赤炎手串", img:"/assets/p/p-fire.jpg",  desc:"热忱昂扬，聚能提气", tags:["火旺","旺运"] },
      木: { name:"青木手串", img:"/assets/p/p-wood.jpg",  desc:"生发舒展，助力平衡", tags:["木旺","舒展"] },
      土: { name:"厚土手串", img:"/assets/p/p-earth.jpg", desc:"厚德载物，安稳沉着", tags:["土旺","安定"] },
      金: { name:"清金手串", img:"/assets/p/p-metal.jpg", desc:"清肃决断，清心凝神", tags:["金旺","清心"] },
      水: { name:"沧海手串", img:"/assets/p/p-water.jpg", desc:"灵动涵养，宁神益智", tags:["水旺","静心"] }
    };
    return map[top] || map["木"];
  },

  buildHint(scoresCN){
    const top = Object.entries(scoresCN).sort((a,b)=>b[1]-a[1])[0][0];
    const t = { 火:"火气偏旺，宜木调和", 木:"木气充沛，宜稳固之土", 土:"厚土略重，宜金疏导", 金:"金气清肃，宜水滋润", 水:"水势丰盈，宜土承载" };
    return t[top] || "根据今日五行趋势给出佩戴建议";
  }
});
