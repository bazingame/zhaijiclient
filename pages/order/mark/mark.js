var util = require('../../../utils/util.js')
var app = getApp()
Page({
  /**
   * Page initial data
   */
  data: {
    order_id:null,
    deliverer_id:'',
    deliverer_name: '',
    deliverer_amount: null,
    deliverer_mark: null,
    mark:'',
    isUnMarked:true,
    star_num_one: 1,
    star_num_two: 1,
    star_arr_one: ['./img/Sstar.png', './img/star.png', './img/star.png', './img/star.png', './img/star.png'],
    star_arr_two: ['./img/Sstar.png', './img/star.png', './img/star.png', './img/star.png', './img/star.png']
  },
  //点星星
  commentOne: function (e) {
    var star_num = e.target.dataset.star;
    var star_arr = ['./img/Sstar.png', './img/star.png', './img/star.png', './img/star.png', './img/star.png'];
    for (var i = 0; i < star_num; i++) {
      star_arr[i] = './img/Sstar.png';
    };
    this.setData({
      star_num_one: star_num,
      star_arr_one: star_arr
    })
  },
  commentTwo: function (e) {
    var star_num = e.target.dataset.star;
    var star_arr = ['./img/Sstar.png', './img/star.png', './img/star.png', './img/star.png', './img/star.png'];
    for (var i = 0; i < star_num; i++) {
      star_arr[i] = './img/Sstar.png';
    };
    this.setData({
      star_num_two: star_num,
      star_arr_two: star_arr
    })
  },
  //提交
  commentsubmit:function(e){
    var that = this
    var star_num_one = that.data.star_num_one
    var star_num_two = that.data.star_num_two
    var order_id = that.data.order_id
    //发起请求
    wx.request({
      url: app.globalData.URL_BASE + app.globalData.MARK_ORDER + order_id,
      method: "PUT",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": app.globalData.zhaijiUserInfo.authorization,
      },
      data: { mark: '[' + star_num_one + ',' + star_num_two+']'},
      success: function (res) {
        if (res.statusCode === 200 && res.data.errcode === 0) {
          // app.p(res)
          util.showSucessToast('评价成功！')
          setTimeout(function(){
            wx.navigateBack({
            })
          },2000)
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

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    var that = this  
    var mode = options.mode
    var deliverer_id = options.deliverer_id
    // 获取上一页的订单号、评价状态、评价内容、快递员ID
    var pages = getCurrentPages()
    var prevPage = pages[pages.length-2]
    var mark = prevPage.data.orderDetail.mark
    var deliverer_id = prevPage.data.orderDetail.deliverer_id
    var order_id = prevPage.data.orderDetail.order_id
    that.setData({
      order_id:order_id,
      deliverer_id:deliverer_id,
      mark:mark
    })
    //获取快递员信息
    wx.request({
      url: app.globalData.URL_BASE + app.globalData.GET_DELIVERER_INFO + deliverer_id,
      method: "GET",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      success: function (res) {
        if (res.statusCode === 200 && res.data.errcode === 0) {
          app.p(res)
          that.setData({
            deliverer_name:res.data.data.name,
            deliverer_amount:res.data.data.order_count,
            deliverer_mark: res.data.data.mark,
            deliverer_id:res.data.data.deliverer_id
          })
        } else {
          wx.showToast({
            title: res.data.errmsg,
            icon: 'none'
          })
        }
      }
    })



    //评价模式
    if(mode=='apply'){
      this.setData({
        isUnMarked: true
      })
    //查看评价模式
    }else if(mode=='view'){
      //设置星星 借用上面的commentOne方法 构造一个相同结构的参数
      var markArr = JSON.parse(mark)
      var e = {
        target:{
          dataset:{
            star:null
          }
        }
      }
      e.target.dataset.star = markArr[0]
      this.commentOne(e)
      e.target.dataset.star = markArr[1]
      this.commentTwo(e)
      this.setData({
        isUnMarked:false
      })
    }
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