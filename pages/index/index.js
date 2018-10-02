//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    time: "",
    disabled: "",
    psw: "",
    phone: "",
    shouquan: 'block',
    page: 'none'
  },
  bindphoneinput: function(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  bindyzminput: function(e) {
    this.setData({
      yzm: e.detail.value
    })
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
  getyanzhengma: function() {
    var that = this;
    var T = 60;
    var timer = setInterval(function() {
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

  },
  loginsubmit: function(e) {
    var that = this;
    var phone = that.data.phone;
    //console.log(that.data);
    var psw = that.data.psw;
    if (phone < 10000000000 || phone > 20000000000) {
      wx.showToast({
        title: '请输入正确格式的手机号',
        icon: 'none'
      })
      return;
    }
    wx.login({
      success:function(res){
        console.log(res);
        wx.request({
          url: 'https://zhaiji.hammerfood.cn/code',
          method:'POST',
          data:{
            code:res.code
          },
          success:function (res) {
            console.log(res);
            var head;
            var open_id = res.data.data.openid;
            wx.getUserInfo({
              lang: 'zh-CN',
              success: function (res) {
                console.log(res);
                head = res.userInfo.avatarUrl;
                console.log(head);
                wx.request({
                  url: 'https://zhaiji.hammerfood.cn/login',
                  method:'POST',
                  data: {
                    open_id: open_id,
                    phone: phone,
                    headimg_url: head
                  },
                  success: function (res) {
                    console.log(res);
                    wx.setStorage({
                      key: 'phone',
                      data: phone
                    }),
                    wx.switchTab({
                      url: '../service/service',
                    })
                  },
                  fail: function (e) {
                    console.log(e);
                  }
                })

              }
            })
          }
        })
      },
    })
    // ,
   
    //wx.request
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
  }
})