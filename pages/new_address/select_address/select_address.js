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
    var that = this;
    var index = Math.floor(e.target.offsetTop / 50);
    var location = that.data.locationList[index].location;
    console.log(location);
    var touchAddress = e.currentTarget.dataset.key
    var pages = getCurrentPages()
    var prevPage = pages[pages.length-2];
    prevPage.updateAddress(touchAddress)
    wx.setStorageSync('end_location',location)
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
          url: app.globalData.URL_BASE+'/map/getcoder/' + latitude + '/' + longitude,
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
      url: app.globalData.URL_BASE+'/map/search/' + text,
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