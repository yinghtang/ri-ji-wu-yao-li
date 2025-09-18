Page({
  data:{
    main:'fire', mainLabel:'火', mainColor:'赤',
    reason:'火旺易燥，水克火、火生土以平衡。',
    recs:[
      { id:'p5', name:'玄渊·静志', wuxing:'water', attrs:['辟邪','冷静'], img:'../../assets/water.jpg' },
      { id:'p3', name:'黄璨·镇财', wuxing:'earth', attrs:['稳固','自信'], img:'../../assets/earth.jpg' }
    ]
  },
  toLibrary(){ wx.navigateTo({url:'/pages/library/library'}); },
  toDetail(e){ wx.navigateTo({url:`/pages/detail/detail?id=${e.currentTarget.dataset.id}`}); }
});
