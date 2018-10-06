// pages/order/order.js
var util = require('../../../utils/util.js')
const app = getApp()
Page({
  /**
   * Page initial data
   */
  data: {
    order: []
  },
  takeOrder: function (e) {
    var that = this
    var order_id = e.currentTarget.dataset.orderId
    wx.showModal({
      title: '',
      content: '确认接单?',
      success:function(res){
        if(res.confirm){
          //服务器发送接单请求
          wx.request({
            url: app.globalData.URL_BASE + app.globalData.RECEIVE_ORDER + order_id,
            method: "POST",
            header: {
              "Content-Type": "application/x-www-form-urlencoded",
              "Authorization": app.globalData.zhaijiUserInfo.authorization,
            },
            success: function (res) {
              if (res.statusCode === 200 && res.data.errcode === 0) {
                util.showSucessToast('接单成功')
                //刷新列表
                that.refreshOrderList()
              } else {
                wx.showToast({
                  title: res.data.errmsg,
                  icon: 'none'
                })
              }
            }
          })
        }
      }
    })
  },
  //刷新列表
  refreshOrderList: function () {
    var that = this
    wx.request({
      url: app.globalData.URL_BASE + app.globalData.GET_ORDER_CAN_GET_LIST+'0/10000',//暂时不做分页加载
      method: "GET",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": app.globalData.zhaijiUserInfo.authorization,
      },
      success: function (res) {
        if (res.statusCode === 200 && res.data.errcode === 0) {
          var orderList = res.data.data
          app.p('刷新列表')
          that.setData({
            order: orderList
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
  
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
      this.refreshOrderList()
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