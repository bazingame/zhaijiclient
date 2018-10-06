//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    time: "",
    disabled: "",
    submitDisabled:true,
    captcha: "",
    phone: "",
    shouquan: 'none',
    page: 'block'
  },
  bindphoneinput: function(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  bindCaptchaInput: function(e) {
    this.setData({
      captcha: e.detail.value
    })
    if(this.data.captcha.length==6){
      this.setData({
        submitDisabled: ''
      })
    }
  },
  bindGetUserInfo: function(e) {
    var that = this;
    if (app.globalData.userInfo) {
      console.log("!!!");
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      console.log("!!!");
      that.setData({
        shouquan: 'none',
        page: 'block'
      })
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      console.log("!!!");
      that.setData({
        shouquan: 'none',
        page: 'block'
      })
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {

          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
    //获取验证码
  getCaptcha: function() {
    var that = this;
    if (this.data.phone < 10000000000 || this.data.phone > 20000000000) {
      wx.showToast({
        title: '手机号格式错误',
        icon: 'none'
      })
      return;
    }
    wx.request({
      url: app.globalData.URL_BASE + app.globalData.GET_CAPTCHA,
      method:"POST",
      data: { "open_id": app.globalData.open_id, "phone": this.data.phone},
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success:function(res){
        if (res.statusCode === 200 && res.data.errcode === 0){
          console.log(res.data)
          that.setCountDown()
          // this.data.submitDisabled = false
        }else{
            wx.showToast({
            title: res.data.errmsg,
            icon: 'none'
          })
        }
      }
    })
  },
  //提交验证验证码并登录
  loginsubmit: function(e) {
    var that = this;
    var captcha = this.data.captcha;
    if(captcha.length==6){
      wx.request({
        url: app.globalData.URL_BASE + app.globalData.VERIFY_CAPTCHA,
        method:"POST",
        data: { "open_id": app.globalData.open_id, "phone": this.data.phone ,"captcha":captcha},
        header:{
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          //验证成功，顺便登录
          if (res.statusCode === 200 && res.data.errcode === 0) {
            app.globalData.zhaijiUserInfo = res.data.data
            app.globalData.isRegistered=true
            console.log(res)
            // wx.switchTab({
              // url: '/pages/service/service',
            // })
            wx.navigateBack({
            })
            // app.initLogin()
          } else {
            console.log(res)
            wx.showToast({
              title: res.data.errmsg,
              icon: 'none'
            })
          }
        }
      })
    }else{
      wx.showToast({
        title: '请输入正确的验证码',
      })
    }
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function() {
    var that = this;
    wx.getStorage({
      key: 'phone',
      success:function(res){
        wx.switchTab({
          url: '../service/service',
        })
      },
      fail: function (res) {
       
      }
    })
    wx.getUserInfo({
      success:function(res){
        that.setData({
          shouquan: 'none',
          page: 'block'
        })
      },
      fail:function(){
        console.log("需授权");
      }
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  setCountDown:function(e){
    var that = this
    var T = 60;
    var timer = setInterval(function () {
      if (T != 0) {
        that.setData({
          time: T,
          disabled: 'disabled'
        })
        T--;
      } else {
        that.setData({
          time: "",
          disabled: ""
        })
        clearInterval(timer);
      }

    }, 1000)
  }
})