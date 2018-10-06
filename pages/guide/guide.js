// pages/guide/guide.js
var util = require('../../utils/util.js');
var app = getApp()
Page({
  data: {
    isUser:null,
    isDeliverer: null,
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
    //如果app后加载出来,那么等待 状态值从回调函数中获得
    if (app.globalData.isRegistered==null){//值为null代表还未执行wx.login 需要等待
      app.p('guide先加载')
      app.GuideReadyCallback = isDeliverer=>{
        //当未注册时isDeliverer为null,注册了但不是deliverer时是false 这两种情况均显示普通用户界面
        if(isDeliverer===true){
          that.setData({
            isUser: false,
            isDeliverer:true
          })
        } else{
          that.setData({
            isUser: true,
            isDeliverer: false
          })
        }
      }
    } else {
      app.p('app先加载')
      // 状态值从全局变量中获得
      var isD = app.globalData.isDeliverer
      if (isD === true) {
        that.setData({
          isUser: false,
          isDeliverer: true
        })
      } else {
        that.setData({
          isUser: true,
          isDeliverer: false
        })
      }
    }
    // app.p(app.globalData)
  },
  codeing:function(){
    util.showErrorToast('正在开发中~')
  }
})
