Page({
  data:{ wishCount:0, todayTheme:'—' },

  onShow(){
    const list = wx.getStorageSync('wishlist') || [];
    this.setData({ wishCount: list.length });
    // 主题占位：后续可从首页共享或通过全局状态注入
    this.setData({ todayTheme: '宜木 · 舒展平衡' });
  },

  goWish(){ wx.navigateTo({ url:'/pages/profile/profile-wish' }); }, // 若你保留了旧心愿单页，改成对应路径
  goLib(){ wx.switchTab({ url:'/pages/library/library' }); },

  // 下面先占位：后续接入真实功能
  feedback(){ wx.openEmbeddedMiniProgram?.() || wx.showToast({title:'请在“关于”里联系作者',icon:'none'}); },
  subscribe(){ wx.showToast({title:'订阅消息暂未接入',icon:'none'}); },
  settings(){ wx.showToast({title:'设置中心暂未接入',icon:'none'}); },
  help(){ wx.showToast({title:'帮助中心筹备中',icon:'none'}); },
  about(){ wx.showToast({title:'日玑·五行与好物',icon:'none'}); },
  todo(){ wx.showToast({title:'即将开放',icon:'none'}); }
});
