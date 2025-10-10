Page({
  data:{
    items:[
      { name:"青木手串", img:"/assets/p/p-wood.jpg",  desc:"生发舒展，助力平衡", tags:["木","舒展"] },
      { name:"赤炎手串", img:"/assets/p/p-fire.jpg",  desc:"热忱昂扬，聚能提气", tags:["火","旺运"] },
      { name:"厚土手串", img:"/assets/p/p-earth.jpg", desc:"厚德载物，安稳沉着", tags:["土","安定"] },
      { name:"清金手串", img:"/assets/p/p-metal.jpg", desc:"清肃决断，清心凝神", tags:["金","清心"] },
      { name:"沧海手串", img:"/assets/p/p-water.jpg", desc:"灵动涵养，宁神益智", tags:["水","静心"] }
    ]
  },
  wish(e){
    const name = e.currentTarget.dataset.name;
    const item = this.data.items.find(i=>i.name===name);
    const list = wx.getStorageSync("wishlist") || [];
    if (!list.find(x=>x.name===name)) list.unshift({ ...item, date: new Date().toISOString().slice(0,10) });
    wx.setStorageSync("wishlist", list);
    wx.showToast({ title:"已加入心愿单", icon:"success" });
  }
});
