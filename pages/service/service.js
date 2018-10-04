// pages/service/service.js
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
    addressIndex:0,
    addressId:null,
    expressIndex:0,
    expressId:'Express_zhongtong',//第一个快递默认为中通
    insuranceIndex:0,
    orderMoney:2,
    packageId:""
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
    app.p(1)
  },
  //加重量
  addHeavey(){
    this.setData({
      kg: this.data.kg + 1
    })
    this.changePackage(this.data.kg)
    this.caculateMoney()
    app.p(2)
  },
  //快递平台变换
  bindExpressPickerChange:function(e){
    var mchObj = this.data.expressList[e.detail.value];
    this.setData({
      expressIndex: e.detail.value,
      expressId: mchObj.express_id,
    })
    app.p(this.data.expressId)
  },
  //配送地址变换
  bindAddressPickerChange: function (e) {
    var mchObj = this.data.addressList[e.detail.value];
    this.setData({
      addressIndex: e.detail.value,
      addressId:mchObj.address_id,
    })
    app.p(this.data.addressId)
  },
  //选择地址
  selectAddress:function(){
    //登录状态下且有地址时默认为第一个地址 A_000000001  点击跳转地址管理
    //登录状态下且无地址时默认显示添加地址 0  点击跳转地址管理
    //未登录状态下，点击跳转登录 null
    if (this.data.addressId==null){
      wx.navigateTo({
        url: '/pages/index/index',
      })
    } else if (this.data.addressId==0){
      wx.navigateTo({
        url: '/pages/address/address',
      })
    }else{
      wx.navigateTo({
        url: '/pages/address/address',
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
      wx.showToast({
        title: '请选择配送地址',
        icon:"none"
      })
      return;
   }
   else if(classgoods.num == "") {
     wx.showToast({
       title: '请输入取货号码',
       icon: 'none'
     })
     return;
   }
    console.log(classgoods);
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