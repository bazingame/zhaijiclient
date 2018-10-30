// pages/me/lottery_record/lottery_record.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    award_list: [],
  },
  getData:function(){
    var that = this
    wx.request({
      url: app.globalData.URL_BASE + app.globalData.GET_AWARD_RECORD,
      method: "GET",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": app.globalData.zhaijiUserInfo.authorization,
      },
      success: function (res) {
        that.setData({
          award_list:res.data.data
        })  
        app.p(that.data.award_list)      
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.getData()
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
    this.getData()
  },


})