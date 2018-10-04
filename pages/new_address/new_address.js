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
      is_default: 0
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
    console.log(options)
  },

  cancelAddress() {
   wx.navigateBack({
   })
  },
  saveAddress() {
    console.log(this.data.address)
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
    //保存地址
    wx.request({
      url: app.globalData.URL_BASE + app.globalData.ADD_ADDRESS,
      method: "POST",
      data: { 
          name: address.name, 
          address: address.address,
          address_detail:address.address_detail,
          phone:address.phone
        },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": app.globalData.zhaijiUserInfo.authorization,
      },
      success: function (res) {
        if (res.statusCode === 200 && res.data.errcode === 0) {
          //更新全局数据-->address
          var addressList = app.globalData.zhaijiUserInfo.addresses
          var AddressData = {
            name: address.name,
            address: address.address,
            address_detail: address.address_detail,
            phone: address.phone
          }
          addressList.push(AddressData)
          app.p(addressList)
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