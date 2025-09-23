Page({
  toLibrary(){ wx.switchTab({ url:'/pages/library/library' }); },
  toDetail(e){ wx.navigateTo({ url:`/pages/detail/detail?id=${e.currentTarget.dataset.id}` }); }
});
