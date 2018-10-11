var util = require('../../utils/util.js');
var app = getApp();
Page({
  data: {
    addressIsSelect:false ,
    address: {
      name: '',
      phone: '',
      address: '地址',
      address_detail:'',
      is_default: 0,
      latitude:'',
      longitude:'',
    },
    addressId: 0,
  },
  bindinputPhone(event) {
    let address = this.data.address;
    address.phone = event.detail.value;
    this.setData({
      address: address
    });
  },
  bindinputName(event) {
    let address = this.data.address;
    address.name = event.detail.value;
    this.setData({
      address: address
    });
  },
  bindinputAddressDetail(event) {
    let address = this.data.address;
    address.address_detail = event.detail.value;
    this.setData({
      address: address
    });
  },
  //从下一页面更新地址数据
  updateAddress:function(select_data){
    var address = this.data.address
    address.address = select_data
    this.setData({
      address:address,
      addressIsSelect: true
    })
    return true
  },
  onLoad: function (options) {
    var fromService = true
    if(options.from=='add'){
      fromService = false
    }
    this.setData({
      navigateFrom : fromService
    })
  },

  cancelAddress() {
   wx.navigateBack({
   })
  },
  saveAddress() {
    var that = this;
    let address = this.data.address;
    if (address.name == '') {
      // console.log(util)
      util.showErrorToast('请输入姓名');
      return false;
    }
    if (address.phone == '') {
      util.showErrorToast('请输入手机号码');
      return false;
    }

    if (this.data.addressIsSelect == false) {
      util.showErrorToast('请选择地址');
      return false;
    }
    if (address.address_detail == '') {
      util.showErrorToast('请输入详细地址');
      return false;
    }
    wx.getStorage({
      key: 'end_location',
      success: function(res) {
        //console.log(res);
        address.latitude = res.data.lat;
        address.longitude = res.data.lng;
        console.log(address);
        wx.request({
            url: app.globalData.URL_BASE + app.globalData.ADD_ADDRESS,
            method: "POST",
            data: { 
              name: address.name, 
              address: address.address,
              address_detail:address.address_detail,
              phone:address.phone,
              latitude:address.latitude,
              longitude:address.longitude
            },
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": app.globalData.zhaijiUserInfo.authorization,
           },
          success: function (res) {
            if (res.statusCode === 200 && res.data.errcode === 0) {
            //更新全局数据-->address
            app.globalData.zhaijiUserInfo.addresses = res.data.data
            //地址添加成功后返回地址管理页面
            wx.navigateBack({
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
    })
    
    //保存地址
    
  },
})