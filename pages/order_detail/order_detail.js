// pages/order_detail/order_detail.js
Page({

  /**
   * Page initial data
   */
  data: {
    order:{
      flag:'',
      image:"",
      kuaidi:"",
      people:"",
      price:"",
      time:""
    },
    star_num:1,
    star_arr: ['./img/Sstar.png', './img/star.png', './img/star.png', './img/star.png', './img/star.png']
  },
  comment:function(e){
    console.log(e);
    var star_num = e.target.dataset.star;
    var star_arr = ['./img/Sstar.png', './img/star.png', './img/star.png', './img/star.png', './img/star.png'];
    for(var i=0;i<star_num;i++)
    {
      star_arr[i] = './img/Sstar.png';
    };
    this.setData({
      star_num:star_num,
      star_arr:star_arr
    })
  },
  
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

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
    var order;
    var that = this;
    wx.getStorage({
      key: 'order',
      success: function(res) {
        order = res.data;
        console.log(order);
        that.setData({
          order: order
        })
      },
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