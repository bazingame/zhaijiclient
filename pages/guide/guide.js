// pages/guide/guide.js
var util = require('../../utils/util.js');
Page({
  data: {
    imgUrls: [
      'https://zhaiji.hammerfood.cn/storage/images/ads/banner1.png',
      'https://zhaiji.hammerfood.cn/storage/images/ads/banner1.png',
      'https://zhaiji.hammerfood.cn/storage/images/ads/banner1.png'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    circular:true,
    picWidth:"350px",
  },
  onLoad:function(){
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          picWidth: res.windowWidth+'px'
        })
      }
    });
  },
  codeing:function(){
    util.showErrorToast('正在开发中~')
  }
})
