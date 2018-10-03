// pages/service/service.js
const app = getApp();
Page({

  /**
   * Page initial data
   */
  data: {
    bbs:"border-bottom:2px solid #fff",
    b1:1,
    b2:0,
    b3:0,
    boxWidth:105,
    boxHeight:120,
    boxMargin:25,
    heavy:"小",
    kg:"0-2",
    address:"",
    expressRange:["请选择你的物流公司","圆通","中通","京东","申通","EMS"],
    insurance: ["0", "1", "2", "3", "4", "5"],
    addressList:[{"address_detail":"请选择配送地址"}],
    addressIndex:0,
    addressId:0,
    expressIndex:0,
    insuranceIndex:0,
    order_money:0,
    num:""
  },
  change:function(e){
    if(e.currentTarget.dataset.heavy == "small")
    {
      this.setData({
        b1: 1,
        b2: 0,
        b3: 0,
        heavy: "小",
        kg: "0-2",
        boxWidth: 105,
        boxHeight: 120,
        boxMargin:25
      })
    }
    else if(e.currentTarget.dataset.heavy == "middle")
    {
      this.setData({
        b1: 0,
        b2: 1,
        b3: 0,
        heavy: "中",
        kg: "2-10",
        boxWidth: 130,
        boxHeight: 150,
        boxMargin: 14
      })
    } 
    else if (e.currentTarget.dataset.heavy == "big") {
      this.setData({
        b1: 0,
        b2: 0,
        b3: 1,
        heavy: "大",
        kg: "10+",
        boxWidth: 160,
        boxHeight: 175,
        boxMargin: -1
      })
    }
  },
  bindExpressPickerChange:function(e){
    if (e.detail.value == 0)
    {
      return ;
    }
    this.setData({
      expressIndex: e.detail.value
    })
  },
  bindAddressPickerChange: function (e) {
    var mchObj = this.data.addressList[e.detail.value];
    this.setData({
      addressIndex: e.detail.value,
      addressId:mchObj.address_id,
    })
    app.p(this.data.addressId)
  },
  bindInsurancePickerChange: function (e) {
    if (e.detail.value == 0) {
      return;
    }
    this.setData({
      insuranceIndex: e.detail.value
    })
  },
  bindaddressinput: function (e) {
    this.setData({
      address: e.detail.value
    })
  },
  bindnuminput: function (e) {
    this.setData({
      num: e.detail.value
    })
  },
  goodssubmit:function(e){
    //未注册时，提交订单跳转到注册页面
    if(app.globalData.isRegistered===false){
      wx.navigateTo({
        url: '/pages/index/index',
      })
      return 
    }
    var classgoods = {
      heavy:this.data.heavy,
      address:this.data.address,
      kuaidi:this.data.array[this.data.expressIndex],
      num:this.data.num,
      baoxian: this.data.baoxian[this.data.idx]
    }
    if(classgoods.kuaidi == "请选择你的物流公司")
      classgoods.kuaidi = ""
    if (classgoods.baoxian == "货物丢失，按200倍赔偿")
      classgoods.baoxian = ""
    
    
   if(classgoods.address=="")
   {
      wx.showToast({
        title: '请输入配送地址',
        icon:'none'
      })
      return;
   }
   else if (classgoods.kuaidi == "")
   {
     wx.showToast({
       title: '请选择物流公司',
       icon: 'none'
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
   else if (classgoods.baoxian == "") {
     wx.showToast({
       title: '请输入运费险',
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
    var that = this;
    if (typeof app.globalData.zhaijiUserInfo.addresses!="undefined"){
      this.setData({
        addressList: app.globalData.zhaijiUserInfo.addresses
      })
    }else{
      app.addressReadyCallback = addressList => {
        this.setData({
          addressList: addressList
        })
      }
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