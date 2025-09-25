Page({
  data: {
    // 你可以在接口返回后 setData 覆盖它
    scores: { 木: 60, 火: 80, 土: 50, 金: 40, 水: 70 }
  },
  onLoad(){
    // 例如：接口返回后更新
    // this.setData({ scores: realScores });
  }
});
