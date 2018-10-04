var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    locationList: [],
    hidden: true
  },
  //选择地址后对上一级页面进行更新数据
  onTap: function (e) {
    var touchAddress = e.currentTarget.dataset.key
    var pages = getCurrentPages()
    var prevPage = pages[pages.length-2];
    prevPage.updateAddress(touchAddress)
    // wx.setStorageSync('location',e.currentTarget.dataset.key)
    wx.navigateBack({
    })
  },
  getLocation: function () {
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        wx.request({
          url: 'https://zhaiji.hammerfood.cn/map/getcoder/' + latitude + '/' + longitude,
          method: "post",
          success: function (res) {
            console.log(res)
            wx.setStorageSync('location', res.data.data.formatted_address.substr(res.data.result.formatted_address.indexOf('市') + 1, 10))
          }
        })
      }
    })
  },
  input: function (e) {
    if (e.detail.value) {
      this.setData({
        hidden: false
      })
      this.search(e.detail.value);
    } else {
      this.setData({
        hidden: false
      })
      this.search('湘潭大学');
    }
  },
  search: function (text) {
    var that = this;
    wx.request({
      method: "post",
      url: 'https://zhaiji.hammerfood.cn/map/search/' + text,
      success: function (res) {
        // console.log(res);
        that.setData({
          locationList: res.data.data
        })
      }
    })
  },
  onLoad:function(){
    this.setData({
      hidden: false
    })
    this.search('湘潭大学');
  }
})