// var util = require('../../../utils/util.js');
// var api = require('../../../config/api.js');
var app = getApp();
Page({
  data: {
    addressList: [],
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.getAddressList();
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    this.getAddressList()
  },
  //获取地址列表
  getAddressList() {
    let that = this;
    var addressList = app.globalData.zhaijiUserInfo.addresses
    that.setData({
      addressList: addressList
    });
  },
  // addressAddOrUpdate(event) {
  //   console.log(event)
  //   wx.navigateTo({
  //     url: '/pages/ucenter/addressAdd/addressAdd?id=' + event.currentTarget.dataset.addressId
  //   })
  // },
  deleteAddress(event) {
    console.log(event.target)
    let that = this;
    wx.showModal({
      title: '',
      content: '确定要删除地址？',
      success: function (res) {
        if (res.confirm) {
          let addressId = event.target.dataset.addressId;
          //请求删除地址
          wx.request({
            url: app.globalData.URL_BASE + app.globalData.DELETE_ADDRESS+addressId,
            method: "DELETE",
            header: {
              "Content-Type": "application/x-www-form-urlencoded",
              "Authorization": app.globalData.zhaijiUserInfo.authorization,
            },
            success: function (res) {
              if (res.statusCode === 200 && res.data.errcode === 0) {
               //刷新地址列表 更新全局数据-->address
                var addressList = app.globalData.zhaijiUserInfo.addresses
                for (var i in addressList) {
                  if (addressList[i]['address_id'] == addressId) {
                    addressList.splice(i, 1)
                    break
                  }
                }
                //更新
                that.getAddressList()
                app.p(addressList)
              } else {
                wx.showToast({
                  title: res.data.errmsg,
                  icon: 'none'
                })
              }
            }
          })
          console.log('用户点击确定')
        }
      }
    })
    return false;

  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})