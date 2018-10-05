// pages/order/order_detail/order_detail.js
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderId:null,
    orderDetail:{
      order_id: "O_00000003",
      address_id: "A_00000001",
      package_id: "10-22",
      insurance: "1",
      money: "1",
      package_size: "2",
      status: "未接单",
      deliverer_id: "D_000000022",
      order_time: "2018-09-25 14:21:18",
      take_order_time: "2018-09-25 14:21:18",
      finish_time: "2018-09-25 14:21:18",
      mark: null,
      mark_status: 0,
      note: "加急",
      cancel_reason: null,
      created_at: "2018-09-25 14:21:18",
      updated_at: "2018-09-25 14:21:18",
      name: "王二小",
      address: "湖南省湘潭市雨湖区",
      address_detail: "湘潭大学北苑1栋",
      phone: "18670999791",
      express: "中通"
    }
  },
  refreshOrderDetail:function(orderId){
    var that = this
    wx.request({
      url: app.globalData.URL_BASE + app.globalData.GET_ONES_ORDER_DETAIL+orderId,
      method: "GET",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": app.globalData.zhaijiUserInfo.authorization,
      },
      success: function (res) {
        if (res.statusCode === 200 && res.data.errcode === 0) {
          var order_detail = res.data.data
          app.p(order_detail)
          that.setData({
            orderDetail: order_detail
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var orderId = options.order_id
    this.setData({
      orderId:orderId
    })
    this.refreshOrderDetail(orderId)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.refreshOrderDetail(this.data.orderId)
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})