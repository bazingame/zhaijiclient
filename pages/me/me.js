// pages/me/me.js
const app = getApp()
Page({
  /**
   * Page initial data
   */
  data: {
    manage:'none',
    today_num:5,
    today_money:15,
    total_num: 132,
    total_money: 732,
    head:app.globalData.URL_BASE+"/storage/images/package2.png",
    nickname:"未登录",
    wx_id:"Not logged in",
    exitloginDisplay:"block",
    isDeliverer:false
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
    // 已经注册状态不显示
    if (app.globalData.isRegistered == true){
      that.setData({
        isDeliverer: app.globalData.isDeliverer,
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
    if (app.globalData.isRegistered == true) {
      that.setData({
        exitloginDisplay: 'none',
        // nickname: app.globalData.zhaijiUserInfo.name,
        nickname: '已登录',
        wx_id: app.globalData.zhaijiUserInfo.phone,
        head: app.globalData.zhaijiUserInfo.headimg_url
      })
      if(app.globalData.isDeliverer == true){
        wx.request({
          url: app.globalData.URL_BASE + app.globalData.GET_DELIVERER_INFO_MY,
          method: "GET",
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": app.globalData.zhaijiUserInfo.authorization,
          },
          success:function(res){
            console.log(res);
            that.setData({
              manage:'block',
              today_num: res.data.data.order_count_today,
              today_money: res.data.data.order_money_today,
              total_num: res.data.data.order_count,
              total_money: res.data.data.order_money,
              //nickname:res.data.data.name,
              //wx_id:res.data.data.phone
            })
          },
          fail:function(res){
            console.log(res);
          }
        })
      }
    }
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
  },
  //打电话给客服
  callService:function(){
    wx.showModal({
      title: '',
      content: '打电话给客服？',
      success:function(res){
        if(res.confirm){
          wx.makePhoneCall({
            phoneNumber: '0731-58610069'
          })
        }
      }
    })
  }
})