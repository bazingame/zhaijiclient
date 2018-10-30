//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var that = this
    // 登录
    wx.login({
      success: res => {
        wx.request({
          url: this.globalData.URL_BASE+this.globalData.GET_OPEN_ID,
          data:{"code":res.code},
          method:"POST",
          success:function(res){
            if(res.statusCode===200){
              // 发送 res.code 到后台换取 openId
              that.globalData.open_id = res.data.data.open_id
              // 查看是否注册
              wx.request({
                url: that.globalData.URL_BASE + that.globalData.LOGIN,
                data: { "open_id": that.globalData.open_id},
                method: "POST",
                success: function (res) {
                    //用户未注册，保存全局状态未注册
                    if(res.data.errcode===-4002){
                      that.globalData.isRegistered = false
                      // wx.navigateTo({
                        // url: '/pages/index/index',
                      // })
                      that.p('wx:login:未注册')
                      //就算没注册也要回调一下 方便对登录状态的判断
                      if (that.GuideReadyCallback) {
                        that.p('未注册回调guide')
                        that.GuideReadyCallback(that.globalData.isDeliverer)
                      }
                    }else if(res.data.errcode===0){
                      that.globalData.isRegistered = true                      
                      that.globalData.zhaijiUserInfo = res.data.data
                      //判断是普通用户还是快递员
                      that.globalData.isDeliverer = res.data.data.type == 'deliverer' ? true : false   
                      // that.globalData.isDeliverer = true 
                      that.p('wx:login:注册了')
                      that.initLogin()
                    }
                  console.log(that.globalData)
                }
              })
            }
          }
        })
      },
      fail:res=>{
        wx.showToast({
          title: '网络连接错误',
        })
      }
    })
    // 获取用户信集送送s    
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo
    //           console.log(this.globalData.userInfo)
    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
  },
  initLogin: function () {
    var that = this
    that.globalData.zhaijiUserInfo.name = "宅急"
    //简化地址格式
    var addressList = this.globalData.zhaijiUserInfo.addresses
    //防止onload先完成
    //此处没必要，因为加了一个guide页，所以当进入到service页时，app页一定加载完了
    // if (this.addressReadyCallback) {
    //   this.addressReadyCallback(addressList)
    // }
    if (this.GuideReadyCallback){
      that.p('initLogin注册回调guide')
      this.GuideReadyCallback(that.globalData.isDeliverer)
    }
  },
  globalData: {
    isRegistered: null,//默认值不要乱改 guide基于此判断登录状态
    isDeliverer: null,
    userInfo: null,
    open_id :"",
    lottery: null,
    // api_url
    //URL_BASE:"https://zhaiji.hammerfood.cn",
    URL_BASE: "https://api.zhaiji.xyz",
    GET_OPEN_ID: "/code",//POST
    LOGIN: "/login",//POST
    GET_CAPTCHA: "/msg/send",//POST 
    VERIFY_CAPTCHA: "/msg/verify", //POST 
    ADD_USER: "/user",//POST
    REVISE_USER: "/user",//PUT
    GET_ONES_ORDER_LIST: "/order",//GET
    GET_ONES_ORDER_DETAIL: "/order/",//GET
    ADD_ORDER: "/order",//POST
    APPLY_CANCEL_ORDER: "/order/apply-cancel/",//PUT
    CANCEL_ORDER: "/deliverer/cancel/",//PUT
    REFUSE_CANCEL_ORDER: "/deliverer/refuse-cancel/",//PUT
    CONFIRM_ORDER: "/order/confirm/",//PUT
    MARK_ORDER: "/order/mark/",//PUT
    ADD_ADDRESS: "/address/",//POST
    DELETE_ADDRESS: "/address/",//DELETE
    REVISE_ADDRESS: "/address/",//PUT
    GET_ORDER_CAN_GET_LIST: "/deliverer/order/",//GET
    GET_ORDER_RECEIVED_LIST: "/deliverer/received-order/",//GET    
    RECEIVE_ORDER: "/deliverer/receive/",//POST
    GET_DELIVERER_INFO:"/deliverer/info/",//GET
    GET_DELIVERER_INFO_MY: "/deliverer/info-my",//GET
    CHANGE_PAY_STATUS: "/order/guagua/",//PUT
    GET_AWARD_RECORD: "/user/lottery/",//GET
    expressList: [
      { 'express_id': 'Express_zhongtong', 'name': '中通' },
      { 'express_id': 'Express_yuantong', 'name': '圆通' },
      { 'express_id': 'Express_shentong', 'name': '申通' },
      { 'express_id': 'Express_huitong', 'name': '汇通' },
      { 'express_id': 'Express_shunfeng', 'name': '顺丰' },
      { 'express_id': 'Express_baishi', 'name': '百世' },
      { 'express_id': 'Express_yunda', 'name': '韵达' },
      { 'express_id': 'Express_jingdong', 'name': '京东' },
      { 'express_id': 'Express_youzheng', 'name': '邮政' },
      { 'express_id': 'Express_tiantian', 'name': '天天' },
      { 'express_id': 'Express_yousu', 'name': '优速' },
      { 'express_id': 'Express_anneng', 'name': '安能' },
      { 'express_id': 'Express_ems', 'name': 'EMS' },
      { 'express_id': 'Express_weipinhui', 'name': '唯品会' },
    ]
  },
  p:function(data){
    console.log(data)
  }
})