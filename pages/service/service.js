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
    boxMarginTop:66,
    kg:2,//重量最小为2
    valuation:null,//估价
    expressList: app.globalData.expressList,
    KuaidiAddressName: "选择物流公司地址 >",
    addressName:"选择配送地址 >",
    heaveyList: [],
    addressId:null,
    expressIndex:0,
    expressId:'Express_zhongtong',//第一个快递默认为中通
    insurance:"",
    orderMoney:3,
    orderMoneyNoCoupon:3,
    packageId:"",
    note:'',
    distanceMoney:0,
    distance:0,
    rep_isread:false,
    submit_disable:true,
    couponNum:null,
    hasCoupon: false,
    couponId:0,
    couponIsUsed:false
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
  //运费险额变换
  bindInsuranceInput: function (e) {
    var value = parseFloat(e.detail.value)
    //限制一位小数
    var valueString = value.toString().split('.')
    var digital = valueString[1]
    if(parseInt(digital)>9){
      e.detail.value = parseFloat(valueString[0]+'.'+valueString[1][0])
    }
    if (!isNaN(value)&&value>500){
      util.showErrorToast("运费险最高500")
      e.detail.value = 500
    }
    this.setData({
      insurance: e.detail.value
    })
    this.caculateMoney()
  },
  //取货号变换
  bindPackageIdInput: function (e) {
    var length = e.detail.value.length
    if(length>15){
      util.showErrorToast('取货号太长')
      this.setData({
        packageId: e.detail.value.substr(0,15)
      })
    }else{
      this.setData({
        packageId: e.detail.value
      })
    }
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
        boxMargin: 25,
        boxMarginTop:66
      })
    } else if (kg > 2 && kg <= 5) {
      this.setData({
        boxWidth: 130,
        boxHeight: 150,
        boxMargin: 14,
        boxMarginTop:54
      })
    } else {
      this.setData({
        boxWidth: 160,
        boxHeight: 175,
        boxMargin: -1,
        boxMarginTop:46
      })
    } 
  },
  //计算总额
  caculateMoney:function(e){
      var kg = this.data.kg
      var effKg = kg>2?kg-2:0
      var insurance = this.data.insurance==""?0:parseFloat(this.data.insurance)
      var count = 3 + insurance + effKg*0.5 + this.data.distanceMoney
      var count_no_coupon = 3 + insurance + effKg*0.5 + this.data.distanceMoney
      //优惠券计算
      if (this.data.couponIsUsed){
        count = count - this.data.couponNum < 0 ? 0 :(count*10 - this.data.couponNum*10)/10
      }
      this.setData({
        orderMoney:count,
        orderMoneyNoCoupon:count_no_coupon
      })
  },
  //阅读协议
  checkboxChange:function(e){
    //没阅读
    if(e.detail.value.length==0){
      this.setData({
        submit_disable: true
      })
    //阅读了
    }else{
        this.setData({
          submit_disable:false
        })
    }
  },
  //使用优惠券
  CouponCheckboxChange:function(e){
    var that = this
    //没使用
    if (e.detail.value.length == 0) {
      app.p('没用优惠券')
      this.setData({
        couponIsUsed: false
      })
      //重新计算价格
      that.caculateMoney()
      //使用了
    } else {
      app.p('用了优惠券')
      this.setData({
        couponIsUsed: true
      })
      //重新计算价格
      that.caculateMoney()
    }
  },
  //获取优惠券
  getCoupon:function(){
    var that = this
    wx.request({
      url: app.globalData.URL_BASE + app.globalData.GET_COUPON,
      method: "GET",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": app.globalData.zhaijiUserInfo.authorization,
      },
      success: function (res) {
        app.p(res)
        if (res.statusCode === 200 && res.data.errcode === 0 && res.data.data.length != 0) {
            that.setData({
              couponNum: res.data.data[0].money_award_amount,
              hasCoupon: true,
              couponId: res.data.data[0].id
            })
        }
      }
    })
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
      insurance: this.data.insurance == "" ? 0 : parseFloat(this.data.insurance),
      money : this.data.orderMoney,
      money_no_coupon: this.data.orderMoneyNoCoupon,
      package_size: this.data.kg,
      express_address: this.data.KuaidiAddressName,
      u_ask_me_why_so_long:this.data.couponIsUsed,
      coupon_id:this.data.couponId
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
          app.p('下单请求:')
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
              app.p('下单成功:')
              app.p(res)
              if (res.statusCode === 200 && res.data.errcode === 0) {
                app.p('支付请求')
                //零元请求
                if(true){
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
                        app.p(reviseRes)
                        util.showSucessToast("下单成功")
                        //判断是否有抽奖
                        if (reviseRes.data.data.lottery != false) {
                          app.p('lottery')
                          app.globalData.lottery = reviseRes.data.data.lottery
                          setTimeout(function () {
                            wx.navigateTo({
                              url: '/pages/lottery/lottery',
                            })
                          }, 1500)
                        } else {
                          app.p('no lottery')
                          setTimeout(function () {
                            wx.switchTab({
                              url: '/pages/order/order',
                            })
                          }, 1500)
                        }
                      } else {
                        util.showErrorToast("支付状态修改失败")
                      }
                    }
                  })
                }else{
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
                              app.p(reviseRes)
                              util.showSucessToast("下单成功")
                              //判断是否有抽奖
                              if(reviseRes.data.data.lottery!=false){
                                app.p('lottery')
                                app.globalData.lottery = reviseRes.data.data.lottery
                                setTimeout(function () {
                                  wx.navigateTo({
                                    url: '/pages/lottery/lottery',
                                  })
                                }, 1500)
                              }else{
                                app.p('no lottery')
                                setTimeout(function () {
                                  wx.switchTab({
                                    url: '/pages/order/order',
                                  })
                                }, 1500)
                              }
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
                }
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
    if (typeof app.globalData.zhaijiUserInfo!="undefined"){
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
                  distanceMoney:res.data.data.distance_money,
                  distance:res.data.data.distance/1000
                })
                that.caculateMoney();
              }
            })
          },
        })
      },
    })
    //获取优惠券
    if(app.globalData.isRegistered)
      that.getCoupon()
  }
})