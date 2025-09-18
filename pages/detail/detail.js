const ALL = [
  { id:'p1', name:'青木·清心', wuxing:'wood',  img:'../../assets/wood.jpg'  },
  { id:'p2', name:'朱炎·勇志', wuxing:'fire',  img:'../../assets/fire.jpg'  },
  { id:'p3', name:'黄璨·镇财', wuxing:'earth', img:'../../assets/earth.jpg' },
  { id:'p4', name:'白曜·断秽', wuxing:'metal', img:'../../assets/metal.jpg' },
  { id:'p5', name:'玄渊·静志', wuxing:'water', img:'../../assets/water.jpg' }
];

Page({
  data:{ p:{}, owned:false },
  onLoad(q){
    const p = ALL.find(x=>x.id===q.id) || ALL[0];
    const owned = (wx.getStorageSync('owned')||[]).includes(p.id);
    this.setData({ p, owned });
  },
  unlock(){
    const owned = wx.getStorageSync('owned')||[];
    if(!owned.includes(this.data.p.id)) owned.push(this.data.p.id);
    wx.setStorageSync('owned', owned);
    this.setData({ owned:true });
    wx.showToast({ title:'解锁成功', icon:'success' });
  }
});
