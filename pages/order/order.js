// pages/order/order.js
const app = getApp()
Page({
  /**
   * Page initial data
   */
  data: {
    order:[{
      order_id:'O__00000007',
      express:'中通',
      package_id:'1-1-1',
      order_time:'2018-04-09 11:30',
      status:'未接单',
      money:'10',
      mark_status:1,
      address_detail:'北苑7栋',
    },
      {
        order_id: 'O__0000008',
        express: '顺丰',
        package_id: '1-21-1',
        order_time: '2018-01-09 15:30',
        status: '未接单',
        money: '8',
        mark_status: 0,
        address_detail: '北苑8栋',
      }
      ]
  },
  orderDetail:function(e){
    wx.setStorage({
      key: 'order',
      data: e.target.dataset.order,
    })
    wx.navigateTo({
      url: '../order_detail/order_detail',
    })
  },
  //刷新列表
  refreshOrderList:function(){
    var that = this
    wx.request({
      url: app.globalData.URL_BASE + app.globalData.GET_ONES_ORDER_LIST,
      method: "GET",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": app.globalData.zhaijiUserInfo.authorization,
      },
      success: function (res) {
        if (res.statusCode === 200 && res.data.errcode === 0) {
          var orderList = res.data.data
          that.setData({
            order:orderList
          })
        } else {
          wx.showToast({
            title: res.data.errmsg,
            icon: 'none'
          })
        }
      }
    })
  },
  //查看订单详情
  viewOrderDetail:function(event){
    var order_id = event.currentTarget.dataset.orderId
    wx.navigateTo({
      url: '/pages/order/order_detail/order_detail?order_id='+order_id,
    })
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    // if(app.globalData.isRegistered===true){
    //   wx.request({
    //     url: app.globalData.URL_BASE + app.globalData.GET_ONES_ORDER_LIST,
    //     method: 'GET',
    //     header:{authorization: app.globalData.zhaijiUserInfo.authorization},
    //     success: function (res) {
    //       console.log(res);
    //     }
    //   })
    // }else{
    //   wx.navigateTo({
    //     url: '/pages/index/index',
    //   })
    // }
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
    //刷新订单列表
    this.refreshOrderList()
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
    this.refreshOrderList()
    wx.stopPullDownRefresh()
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