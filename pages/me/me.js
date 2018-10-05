// pages/me/me.js
const app = getApp()
Page({
  /**
   * Page initial data
   */
  data: {
    head:app.globalData.URL_BASE+"/storage/images/package2.png",
    nickname:"未登录",
    wx_id:"NotLogin",
    exitloginDisplay:"block"
  },

  /**
   * Lifecycle function--Called when page load
   */
  exitlogin:function(){
    wx.navigateTo({
      url: '../index/index',
    })
  },
  onLoad: function (options) {
    var that = this;
    //已经注册状态不显示
    if (app.globalData.isRegistered == true){
      that.setData({
        exitloginDisplay: 'none',
        nickname: app.globalData.zhaijiUserInfo.name,
        head: app.globalData.zhaijiUserInfo.headimg_url
      })
    }
    
    // that.setData({
      // exitloginDisplay: 'none'
    // })
    // wx.getStorage({
    //   key: 'phone',
    //   fail:function(res)
    //   {
    //     wx.navigateTo({
    //       url: '../index/index',
    //     })
    //   }
    // })
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {
    
    var that = this
    
    return
  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
    var that = this;
    var phone;
    wx.getStorage({
      key: 'phone',
      success: function(res) {
        phone = res.data
      },
    })
   
    // wx.getUserInfo({
    //   lang: 'zh-CN',
    //   success: function (res) {
    //     console.log(res);
    //     that.setData({
    //       head: res.userInfo.avatarUrl,
    //       nickname: res.userInfo.nickName,
    //       wx_id:phone
    //     })
    //   }
    // })
  },

  //跳转地址管理
  addressAdmin:function(){
    if(app.globalData.isRegistered===false){
      wx.navigateTo({
        url: '/pages/index/index',
      })
    }else{
      wx.navigateTo({
        url: '../address/address?from=me'
      })
    }
  },
  //收费标准跳转
  chargingStandard:function(){
    wx.navigateTo({
      url: '/pages/me/charging_standard/charging_standard',
    })
  },
  //用户协议跳转
  userDeal:function(){
    wx.navigateTo({
      url: '/pages/me/user_deal/user_deal',
    })
  }
})