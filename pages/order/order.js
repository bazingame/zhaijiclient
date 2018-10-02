// pages/order/order.js
Page({

  /**
   * Page initial data
   */
  data: {
    order:[/*{
      image:'./img/smallbox.png',
      kuaidi:'中通快递',
      time:'2018-04-09 11:30',
      flag:'订单未完成',
      price:'￥10.00',
      people:'冯化昱',
    }, 
    {
        image: './img/smallbox.png',
        kuaidi: '申通快递',
        time: '2018-09-22 14:30',
        flag: '订单未完成',
        price: '￥10.00',
        people: '许千机',
      }*/]
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
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    wx.request({
      url: 'https://zhaiji.hammerfood.cn/order',
      method:'GET',
      success:function(res){
        console.log(res);
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