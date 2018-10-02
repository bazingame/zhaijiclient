// pages/me/me.js
Page({

  /**
   * Page initial data
   */
  data: {
    head:"",
    nickname:"",
    wx_id:""
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
    wx.getStorage({
      key: 'phone',
      fail:function(res)
      {
        wx.navigateTo({
          url: '../index/index',
        })
      }
    })
    
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

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
   
    wx.getUserInfo({
      lang: 'zh-CN',
      success: function (res) {
        console.log(res);
        that.setData({
          head: res.userInfo.avatarUrl,
          nickname: res.userInfo.nickName,
          wx_id:phone
        })
      }
    })
  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})