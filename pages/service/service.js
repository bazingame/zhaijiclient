// pages/service/service.js
var util = require('../../utils/util.js');
const app = getApp();
Page({
  /**
   * Page initial data
   */
  data: {
    bbs:"border-bottom:2px solid #fff",
    boxWidth:105,
    boxHeight:120,
    boxMargin:25,
    kg:2,//重量最小为2
    insurance: [0, 1, 2, 3, 4, 5],
    expressList: app.globalData.expressList,
    addressName:"选择配送地址 >",
    heaveyList: [],
    addressId:null,
    expressIndex:0,
    expressId:'Express_zhongtong',//第一个快递默认为中通
    insuranceIndex:0,
    orderMoney:2,
    packageId:"1-1"
  },
  //减重量
  subHeavey:function(){
    if(this.data.kg>1){
      this.setData({
        kg: this.data.kg - 1,
      })
    }
    this.changePackage(this.data.kg)
    this.caculateMoney()
    // app.p(1)
  },
  //加重量
  addHeavey(){
    this.setData({
      kg: this.data.kg + 1
    })
    this.changePackage(this.data.kg)
    this.caculateMoney()
    // app.p(2)
  },
  //快递平台变换
  bindExpressPickerChange:function(e){
    var mchObj = this.data.expressList[e.detail.value];
    this.setData({
      expressIndex: e.detail.value,
      expressId: mchObj.express_id,
    })
    // app.p(this.data.expressId)
  },
  //选择地址
  selectAddress:function(){
    //登录状态下且有地址时默认为第一个地址 A_000000001  点击跳转地址管理
    //登录状态下且无地址时默认显示添加地址 0  点击跳转地址管理
    //未登录状态下，点击跳转登录 null
    if (this.data.addressId==null){
      // wx.navigateTo({
        // url: '/pages/index/index?from=select_address',
      // })
      util.showErrorToast("请注册")
    } else if (this.data.addressId==0){
      wx.navigateTo({
        url: '/pages/address/address?from=service',
      })
    }else{
      wx.navigateTo({
        url: '/pages/address/address?from=service',
      })
    }
  },
  //保险额变换
  bindInsurancePickerChange: function (e) {
    if (e.detail.value == 0) {
      return;
    }
    this.setData({
      insuranceIndex: e.detail.value
    })
    this.caculateMoney()
  },
  //取货号变换
  bindPackageIdInput: function (e) {
    this.setData({
      packageId: e.detail.value
    })
  },
  //变换包裹外形
  changePackage:function(kg){
    if (kg > 0 && kg <= 2) {
      this.setData({
        boxWidth: 105,
        boxHeight: 120,
        boxMargin: 25
      })
    } else if (kg > 2 && kg <= 5) {
      this.setData({
        boxWidth: 130,
        boxHeight: 150,
        boxMargin: 14
      })
    } else {
      this.setData({
        boxWidth: 160,
        boxHeight: 175,
        boxMargin: -1
      })
    } 
  },
  //计算总额
  caculateMoney:function(e){
    //未来根据距离计算价格
    // if (this.data.addressId!=null){
      var kg = this.data.kg>2?this.data.kg:2
      var insurance = this.data.insurance[this.data.insuranceIndex]
      var count = insurance + kg
      this.setData({
        orderMoney:count
      })
    // }
  },
  goodsSubmit:function(e){
    //未注册时，提交订单跳转到注册页面
    app.p(app.globalData.isRegistered)
    if(app.globalData.isRegistered===false){
      wx.navigateTo({
        url: '/pages/index/index',
      })
      return 
    }
    var classgoods = {
      address_id : this.data.addressId,
      express_id : this.data.expressId,
      package_id : this.data.packageId,
      insurance : this.data.insurance[this.data.insuranceIndex],
      money : this.data.orderMoney,
      package_size : this.data.kg,
    }
   if(classgoods.address_id==null||classgoods.address_id==0)
   {
     util.showErrorToast('请选择配送地址')
      return;
   }
   else if (classgoods.package_id == "") {
     util.showErrorToast('请输入取货码')
     return;
   }
    var express_name = app.globalData.expressList[this.data.expressIndex].name
    wx.showModal({
      title: '确定信息如下',
      content: '重量: '+classgoods.package_size+'kg\n配送至: ' + this.data.addressName + '\n取货号: ' +express_name+' '+classgoods.package_id+'\n运费险: '+classgoods.insurance+'元\n预计费用: '+classgoods.money+'元',
      confirmText:'确认提交',
      success: function (res) {
        if (res.confirm) {
          //下单亲！
          wx.request({
            url: app.globalData.URL_BASE + app.globalData.ADD_ORDER,
            method: "POST",
            header: {
              "Content-Type": "application/x-www-form-urlencoded",
              "Authorization": app.globalData.zhaijiUserInfo.authorization,
            },
            data: classgoods,
            success: function (res) {
              if (res.statusCode === 200 && res.data.errcode === 0) {
                util.showSucessToast("提交成功")
                setTimeout(function(){
                  wx.switchTab({
                    url: '/pages/order/order',
                  })
                },1500)                
              } else {
                wx.showToast({
                  title: res.data.errmsg,
                  icon: 'none'
                })
              }
            }
          })
        }
      }
    })
    // console.log(classgoods);
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    // app.p(this.data.expressList);
    var that = this;
    //登录状态下且有地址时默认为第一个地址 A_000000001
    //登录状态下且无地址时默认显示添加地址 0
    //未登录状态下，点击跳转登录 null
    if (typeof app.globalData.zhaijiUserInfo.addresses!="undefined"){
      var lastAddress = app.globalData.zhaijiUserInfo.addresses.pop()
      app.globalData.zhaijiUserInfo.addresses.push(lastAddress)
      if(typeof lastAddress=="undefined"){
        this.setData({
          addressName: "选择配送地址 >",
          addressId: 0
        })
      }else{
        this.setData({
          addressName: lastAddress.address_detail,
          addressId: lastAddress.address_id
        })
      }
    }else{
      app.addressReadyCallback = addressList => {
        var lastAddress = app.globalData.zhaijiUserInfo.addresses.pop()
        app.globalData.zhaijiUserInfo.addresses.push(lastAddress)
        if (typeof lastAddress == "undefined") {
          this.setData({
            addressName: "选择配送地址 >",
            addressId: 0
          })
        } else {
          this.setData({
            addressName: lastAddress.address_detail,
            addressId: lastAddress.address_id
          })
        }
      }
    }
  }
})