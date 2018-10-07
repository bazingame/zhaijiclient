var util = require('../../../utils/util.js')
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isDeliverer:null,
    orderId:null,
    orderDetail:{
      "order_id": "O_00000003",
      "address_id": "A_00000001",
      "package_id": "10-22",
      "insurance": "1",
      "money": "1",
      "package_size": "2",
      "status": "已完成",
      "deliverer_id": "D_00000001",
      "order_time": "2018-09-25 14:21:18",
      "take_order_time": "2018-09-25 14:21:18",
      "finish_time": "2018-09-25 14:21:18",
      "mark": null,
      "mark_status": 0,
      "note": null,
      "cancel_reason": null,
      "created_at": "2018-09-25 14:21:18",
      "updated_at": "2018-09-25 14:21:18",
      "name": "王二小",
      "address": "湖南省湘潭市雨湖区",
      "address_detail": "湘潭大学北苑1栋",
      "phone": "18670999791",
      "express": "中通"
    }
  },
  //刷新详情页
  refreshOrderDetail:function(){
    var orderId = this.data.orderId
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
          //当账户未配送员时 将取消失败改为已拒绝
          if (app.globalData.isDeliverer == true && order_detail.status=='取消失败'){
            order_detail.status='已拒绝取消'
          }
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
  //申请取消订单
  applyCancelOrder:function(){
    var that = this
    var orderId = that.data.orderId
    wx.request({
      url: app.globalData.URL_BASE + app.globalData.APPLY_CANCEL_ORDER + orderId,
      method: "PUT",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": app.globalData.zhaijiUserInfo.authorization,
      },
      success: function (res) {
        if (res.statusCode === 200 && res.data.errcode === 0) {
          var status_code = res.data.data.status_code
          var status = res.data.data.status
          util.showSucessToast(status)
          //刷新
          that.refreshOrderDetail()
        } else {
          wx.showToast({
            title: res.data.errmsg,
            icon: 'none'
          })
        }
      },
      fail:function(res){
        app.p(res)
      }
    })
  },
  //同意取消
  agreeCancel:function(){
    var that = this
    var orderId = that.data.orderId
    wx.request({
      url: app.globalData.URL_BASE + app.globalData.CANCEL_ORDER + orderId,
      method: "PUT",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": app.globalData.zhaijiUserInfo.authorization,
      },
      success: function (res) {
        if (res.statusCode === 200 && res.data.errcode === 0) {
          app.p(res)
          var status_code = res.data.data.status_code
          var status = res.data.data.status
          util.showSucessToast(status)
          //刷新
          that.refreshOrderDetail()
        } else {
          wx.showToast({
            title: res.data.errmsg,
            icon: 'none'
          })
        }
      },
      fail: function (res) {
        app.p(res)
      }
    })
  },
  //拒绝取消
  refuseCancel:function(){
    var that = this
    var orderId = that.data.orderId
    wx.request({
      url: app.globalData.URL_BASE + app.globalData.REFUSE_CANCEL_ORDER + orderId,
      method: "PUT",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": app.globalData.zhaijiUserInfo.authorization,
      },
      success: function (res) {
        if (res.statusCode === 200 && res.data.errcode === 0) {
          app.p(res)
          var status_code = res.data.data.status_code
          var status = res.data.data.status
          util.showSucessToast(status)
          //刷新
          that.refreshOrderDetail()
        } else {
          wx.showToast({
            title: res.data.errmsg,
            icon: 'none'
          })
        }
      },
      fail: function (res) {
        app.p(res)
      }
    })
  },
  //查看评价
  viewMark:function(){
    wx.navigateTo({
      url: '/pages/order/mark/mark?mode=view&deliverer_id=' + this.data.orderDetail.deliverer_id,
    })
  },
  //评价快递员
  applyMark:function(){
    wx.navigateTo({
      url: '/pages/order/mark/mark?mode=apply&deliverer_id=' + this.data.orderDetail.deliverer_id,
    })
  },
  //联系配送员
  contactDeliverer:function(){
    var that = this
    wx.showModal({
      content: '电话联系配送员？',
      success: function (res) {
        if (res.confirm) {
          app.p('打电话！')
          //获取配送员电话
          wx.request({
            url: app.globalData.URL_BASE + app.globalData.GET_DELIVERER_INFO + that.data.orderDetail.deliverer_id,
            method: "GET",
            header: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            success: function (res) {
              if (res.statusCode === 200 && res.data.errcode === 0) {
                var phone = res.data.data.phone
                wx.makePhoneCall({
                  phoneNumber:phone
                })
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
  //联系收货人
  contactReceiver:function(){
    var that = this
    wx.showModal({
      content: '电话联系收货人？',
      success: function (res) {
        if (res.confirm) {
          app.p('打电话！')
          var phone = that.data.orderDetail.phone
          wx.makePhoneCall({
            phoneNumber: phone
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
    if(app.globalData.isDeliverer==true){
      this.setData({
        isDeliverer:true,
        orderId: orderId
      })
    }else if(app.globalData.isDeliverer==false){
      this.setData({
        isDeliverer:false,
        orderId: orderId
      })
    }
    this.refreshOrderDetail()
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
    this.refreshOrderDetail()
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
    this.refreshOrderDetail()
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