var util = require('../../utils/util.js');
var app = getApp();
Page({
  data: {
    addressList: [],
    navigateFrom:null,
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      navigateFrom:options.from
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    wx.removeStorage({
      key: 'end_location',
      success: function(res) {

      },
    })
    this.getAddressList()
  },
  //获取地址列表
  getAddressList(option="add",address_id=null) {
    let that = this;
    var addressList = app.globalData.zhaijiUserInfo.addresses
    console.log(addressList);
    if(addressList.length==0||typeof addressList[0] != "undefined"){
      that.setData({
        addressList: addressList
      });
    }
    //上一页选择的地址在这一页被删掉，更新上一页addressName、addressId属性
    if (option == 'delete') {
      var pages = getCurrentPages()
      var prevPage = pages[pages.length - 2]
      // 判定删除地址是否为被选中地址
      if(address_id==prevPage.data.addressId){
        prevPage.setData({
          addressName: "选择配送地址 >",
          addressId: 0
        })
      }
    }
  },
  // addressAddOrUpdate(event) {
  //   console.log(event)
  //   wx.navigateTo({
  //     url: '/pages/ucenter/addressAdd/addressAdd?id=' + event.currentTarget.dataset.addressId
  //   })
  // },
  //选择地址
  selectAddress:function(event){
    var that = this;
    if(this.data.navigateFrom=='me'){
      return
    }
    else if(this.data.navigateFrom=='service'){
     
      var selectAddressId = event.target.dataset.addressId
      var selectAddressDetail = event.target.dataset.addressDetail
      for (var i = 0; i < this.data.addressList.length; i++) {
        if(selectAddressId == this.data.addressList[i].address_id)
        {
          var location = {
            latitude: this.data.addressList[i].latitude,
            longitude:this.data.addressList[i].longitude,
          }
          wx.setStorage({
            key: 'end_location',
            data: location,
          })
          break;
        }
      }
      //设置前一页的数据
      var pages = getCurrentPages()
      var prevPage = pages[pages.length-2]
      prevPage.setData({
        addressName : selectAddressDetail,
        addressId : selectAddressId
      })
      wx.navigateBack({
      })
    }
  },
  //删除地址
  deleteAddress(event) {
    // console.log(event.target)
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
                app.globalData.zhaijiUserInfo.addresses =  res.data.data
                //更新
                that.getAddressList('delete', addressId)
              } else {
                wx.showToast({
                  title: res.data.errmsg,
                  icon: 'none'
                })
              }
            }
          })
          // console.log('用户点击确定')
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