const ALL = [
  { id:'p-wood',  img:'../../assets/p/p-wood.jpg'  },
  { id:'p-fire',  img:'../../assets/p/p-fire.jpg'  },
  { id:'p-earth', img:'../../assets/p/p-earth.jpg' },
  { id:'p-metal', img:'../../assets/p/p-metal.jpg' },
  { id:'p-water', img:'../../assets/p/p-water.jpg' }
];
Page({
  data:{ list:[], ownedMap:{} },
  onShow(){
    const owned = wx.getStorageSync('owned') || [];
    const ownedMap = owned.reduce((m,id)=> (m[id]=true,m),{});
    this.setData({ list:ALL, ownedMap });
  },
  toDetail(e){ wx.navigateTo({ url:`/pages/detail/detail?id=${e.currentTarget.dataset.id}` }); }
});
