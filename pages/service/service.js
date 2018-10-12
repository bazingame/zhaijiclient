// pages/service/service.js
var util = require('../../utils/util.js');
const app = getApp();
Page({
  /**
   * Page initial data
   */
  data: {
    start: [],
    end: [],
    bbs:"border-bottom:2px solid #fff",
    boxWidth:105,
    boxHeight:120,
    boxMargin:25,
    kg:2,//重量最小为2
    insurance: [0, 1, 2, 3, 4, 5],
    valuation:null,//估价
    expressList: app.globalData.expressList,
    KuaidiAddressName: "选择物流公司地址 >",
    addressName:"选择配送地址 >",
    heaveyList: [],
    addressId:null,
    expressIndex:0,
    expressId:'Express_zhongtong',//第一个快递默认为中通
    insuranceIndex:0,
    orderMoney:2,
    packageId:"",
    note:'',
    distanceMoney:0
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
  //get物流公司地址
  updateAddress: function (select_data) {
    
    this.setData({
      KuaidiAddressName: select_data,
      //addressIsSelect: true
    })
    return true
  },
  //选择地址
  selectAddress:function(){
    //登录状态下且有地址时默认为第一个地址 A_000000001  点击跳转地址管理
    //登录状态下且无地址时默认显示添加地址 0  点击跳转地址管理
    //未登录状态下，点击跳转登录 未登录状态下，address_id为null 同时isRegisted是false
    app.p(this.data.addressId)
    if (app.globalData.isRegistered==false||this.data.addressId==null){
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
  //估价变换
  bindValuationInput: function (e) {
    this.setData({
      valuation: e.detail.value
    })
  },
  //提示保险额
  showInsuranceNotice:function(){
    var that = this
    var valuation = that.data.valuation
    if(valuation==0||valuation==''||valuation==null){return}
    var insurance = 0
    if(valuation>0&&valuation<200){
      insurance = 1
    }else if(valuation>=200&&valuation<400){
      insurance = 2
    }else if(valuation>=400&& valuation< 600){
      insurance = 3
    }else if(valuation>=600&& valuation<800){
      insurance = 4
    }else if(valuation>800){
      insurance = 5
    }
    var indemnification = insurance*200>valuation?valuation:insurance*200
    //询问是否购买保险
    wx.showModal({
      title: '',
      content: '建议购买' + insurance + '元保险,货物丢失最高赔偿' + indemnification+'元',
      confirmText: '确认购买',
      ccancelText: '不购买',
      success: function (res) {
        if (res.confirm) {
          //更改运费险
          that.setData({
            insuranceIndex:insurance
          })
          that.caculateMoney()
        }
      }
    })
  },
  //保险额变换
  bindInsurancePickerChange: function (e) {
    // if (e.detail.value == 0) {
    //   return;
    // }
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
  //备注变换
  bindNoteInput: function (e) {
    this.setData({
      note: e.detail.value
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
      var count = insurance + kg + this.data.distanceMoney
      this.setData({
        orderMoney:count
      })
    // }
  },
  goodsSubmit:function(e){
    var that = this
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
      package_id: this.data.packageId,
      note : this.data.note,
      insurance : this.data.insurance[this.data.insuranceIndex],
      money : this.data.orderMoney,
      package_size: this.data.kg,
      valuation : this.data.valuation,
      express_address: this.data.KuaidiAddressName
    }
    if(classgoods.valuation==null){
      classgoods.valuation = 0
    }
    if (classgoods.note == '') {
      classgoods.note = '无'
    }
    if(classgoods.address_id==null||classgoods.address_id==0)
    {
      util.showErrorToast('请选择配送地址')
        return;
    }
    if (classgoods.express_address == "选择物流公司地址 >") {
      util.showErrorToast('请选择物流公司地址')
      return;
    }
    if (classgoods.package_id == "") {
      util.showErrorToast('请输入取货码')
      return;
    }
    var express_name = app.globalData.expressList[this.data.expressIndex].name
    wx.showModal({
      title: '确定信息如下',
      content: '重量: ' + classgoods.package_size + 'kg\n配送至: ' + this.data.addressName + '\n取货号: ' + classgoods.express_address + ' ' +express_name+' '+classgoods.package_id+'\n运费险: '+classgoods.insurance+'元\n预计费用: '+classgoods.money+'元',
      confirmText:'确认提交',
      success: function (res) {
        if (res.confirm) {
          app.p(classgoods)
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
              app.p(res)
              if (res.statusCode === 200 && res.data.errcode === 0) {
                app.p('支付请求')
                wx.requestPayment({
                  'timeStamp': res.data.data.timeStamp.toString(),
                  'nonceStr': res.data.data.nonceStr,
                  'package': res.data.data.package,
                  'signType': 'MD5',
                  'paySign': res.data.data.paySign,
                  'success': function (payRes) {
                    if (payRes.errMsg =='requestPayment:ok'){
                      //TODO 修改支付状态(成功)
                      wx.request({
                        url: app.globalData.URL_BASE + app.globalData.CHANGE_PAY_STATUS + res.data.data.order_id,
                        method: "PUT",
                        header: {
                          "Content-Type": "application/x-www-form-urlencoded",
                          "Authorization": app.globalData.zhaijiUserInfo.authorization,
                        },
                        data: { 'guagua': 'ss' },
                        success: function (reviseRes) {
                          app.p('修改支付状态')
                          if (reviseRes.statusCode === 200 && reviseRes.data.errcode === 0) {
                            util.showSucessToast("下单成功")
                            setTimeout(function () {
                              wx.switchTab({
                                url: '/pages/order/order',
                              })
                            }, 1500)
                          }else {
                            util.showErrorToast("支付状态修改失败")
                          }
                        }
                      })
                    }
                  },
                  'fail': function (payRes) {
                    if (payRes.errMsg =='requestPayment:fail cancel'){
                      //TODO 修改支付状态(失败)
                      wx.request({
                        url: app.globalData.URL_BASE + app.globalData.CHANGE_PAY_STATUS + res.data.data.order_id,
                        method: "PUT",
                        header: {
                          "Content-Type": "application/x-www-form-urlencoded",
                          "Authorization": app.globalData.zhaijiUserInfo.authorization,
                        },
                        data: { 'guagua': 'gg' },
                        success: function (reviseRes) {
                          app.p('修改支付状态')
                          if (reviseRes.statusCode === 200 && reviseRes.data.errcode === 0) {
                            util.showErrorToast('支付失败')
                          } else {
                            util.showErrorToast("支付状态修改失败")
                          }
                        }
                      })
                    }
                  },
                })
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
  changePayStatus(order_id,status){
    wx.request({
      url: app.globalData.URL_BASE + app.globalData.CHANGE_PAY_STATUS + order_id,
      method: "PUT",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": app.globalData.zhaijiUserInfo.authorization,
      },
      data: {'guagua':status},
      success: function (res) {
        app.p('修改支付状态')
        if (res.statusCode === 200 && res.data.errcode === 0) {
          return true
        } else {
          return res.data.errcode
        }
      }
    })
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    wx.clearStorage();
    // app.p(app.globalData)
    // app.p(this.data.expressList);
    var that = this;
    //登录状态下且有地址时默认为第一个地址 A_000000001
    //登录状态下且无地址时默认显示添加地址 0
    //未登录状态下，点击跳转登录 null
    // app.p(typeof app.globalData.zhaijiUserInfo.addresses)
    //undefiend时为未注册状态鸭
    if (typeof app.globalData.zhaijiUserInfo.addresses!="undefined"){
      var lastAddress = app.globalData.zhaijiUserInfo.addresses.pop()
      app.globalData.zhaijiUserInfo.addresses.push(lastAddress)
      //如果地址列表没有地址
      if(typeof lastAddress=="undefined"){
        this.setData({
          addressName: "选择配送地址 >",
          addressId: 0
        })
      }else{
        var location = {
          latitude: lastAddress.latitude,
          longitude: lastAddress.longitude,
        }
        wx.setStorage({
          key: 'end_location',
          data: location,
        })
        this.setData({
          addressName: lastAddress.address_detail,
          addressId: lastAddress.address_id
        })
      }
    }
  },
  onShow:function(){
    var that = this;
  
    wx.getStorage({
      key: 'end_location',
      success: function(res) {
        console.log(res);
        that.setData({
          start:res.data,
        })
        wx.getStorage({
          key: 'start_location',
          success: function (res) {
            console.log(res);
            that.setData({
              end: res.data,
            })
            //console.log(that.data);
            wx.request({
              url: app.globalData.URL_BASE + '/map/distance/' + that.data.start.latitude + '/' + that.data.start.longitude + '/' + that.data.end.lat + '/' + that.data.end.lng,
              method:'POST',
              header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": app.globalData.zhaijiUserInfo.authorization,
              },
              success:function(res){
                console.log(res);
                var orderMoney = that.data.orderMoney;
                that.setData({
                  distanceMoney:res.data.data.distance_money
                })
                that.caculateMoney();
              }
            })
          },
        })
      },
    })
   
    
  }
})