Page({
  data: {
    lunarData: null,   // 天行原始 result
    fitText: '',       // 已格式化的“宜”
    avoidText: '',     // 已格式化的“忌”
    loading: true
  },

  onLoad() {
    this.getLunarData();
  },

  getLunarData() {
    const today = this.formatDate(new Date()); // YYYY-MM-DD
    wx.request({
      url: 'https://apis.tianapi.com/lunar/index',
      method: 'GET',
      data: {
        key: 'b988a9f83124836eed4cf203b143e40f', // ← 你的 API KEY（上线请改为云函数中转）
        date: today
      },
      success: (res) => {
        const d = res.data || {};
        if (d.code === 200 && d.result) {
          const r = d.result;
          const fitText   = (r.fitness || '').replace(/[、.]/g, ' · ');
          const avoidText = (r.taboo   || '').replace(/[、.]/g, ' · ');
          this.setData({
            lunarData: r,
            fitText,
            avoidText,
            loading: false
          });
        } else {
          this.setData({ loading: false });
          wx.showToast({ title: `接口错误：${d.msg || ''}`, icon: 'none' });
        }
      },
      fail: (err) => {
        console.error('请求失败:', err);
        this.setData({ loading: false });
        wx.showToast({ title: '网络错误', icon: 'none' });
      }
    });
  },

  formatDate(date) {
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${d}`;
  },

  toLibrary(){ wx.switchTab({ url:'/pages/library/library' }); },
  toDetail(e){ wx.navigateTo({ url:`/pages/detail/detail?id=${e.currentTarget.dataset.id}` }); }
});
