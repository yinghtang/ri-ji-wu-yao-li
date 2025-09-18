const ALL = [
  { id:'p1', name:'青木·清心', wuxing:'wood',  img:'../../assets/wood.jpg'  },
  { id:'p2', name:'朱炎·勇志', wuxing:'fire',  img:'../../assets/fire.jpg'  },
  { id:'p3', name:'黄璨·镇财', wuxing:'earth', img:'../../assets/earth.jpg' },
  { id:'p4', name:'白曜·断秽', wuxing:'metal', img:'../../assets/metal.jpg' },
  { id:'p5', name:'玄渊·静志', wuxing:'water', img:'../../assets/water.jpg' }
];

Page({
  data:{ list:[], owned:[], ownedMap:{} },
  onShow(){
    const owned = wx.getStorageSync('owned') || [];
    const ownedMap = owned.reduce((m,id)=> (m[id]=true, m), {});
    this.setData({ list: ALL, owned, ownedMap });
  },
  toDetail(e){ wx.navigateTo({url:`/pages/detail/detail?id=${e.currentTarget.dataset.id}`}); }
});
