const ALL = {
  'p-wood':  { name:'青木·清心', img:'../../assets/p-wood.jpg'  },
  'p-fire':  { name:'朱炎·勇志', img:'../../assets/p-fire.jpg'  },
  'p-earth': { name:'黄璨·镇财', img:'../../assets/p-earth.jpg' },
  'p-metal': { name:'白曜·断秽', img:'../../assets/p-metal.jpg' },
  'p-water': { name:'玄渊·静志', img:'../../assets/p-water.jpg' }
};
Page({
  data:{ p:{}, owned:false },
  onLoad(q){
    const id = q.id || 'p-water';
    const p = ALL[id] || {};
    const owned = (wx.getStorageSync('owned')||[]).includes(id);
    this.setData({ p, owned, id });
  },
  unlock(){
    const owned = wx.getStorageSync('owned')||[];
    if(!owned.includes(this.data.id)) owned.push(this.data.id);
    wx.setStorageSync('owned', owned);
    this.setData({ owned:true });
    wx.showToast({ title:'解锁成功', icon:'success' });
  },
  buy(){
    // 先用外链占位，后续换为内购/跳独立站
    wx.showModal({
      title:'购买',
      content:'将打开购买链接（示例）',
      success: res => {
        if(res.confirm){
          wx.navigateTo({ url:'/pages/mall/mall' }); // 或 wx.openEmbeddedMiniProgram / web-view
        }
      }
    });
  }
});
