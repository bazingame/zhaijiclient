var app = getApp()
Page({
  data: {
    awardsList: {},
    animationData: {},
    btnDisabled: '',
    sub_title:'宅急首单幸运奖',
    awardsConfig:{chance:true,awards:null},
    awardIndex:null,
    notice:[]
  },
  gotoList: function () {
    wx.navigateTo({
      url: '/pages/me/lottery_record/lottery_record',
    })
  },
  getLottery: function () {
    var that = this
    var awardIndex = that.data.awardIndex

    // 获取奖品配置
    var awardsConfig = that.data.awardsConfig
    console.log(awardIndex)

    // 初始化 rotate
    var animationInit = wx.createAnimation({
      duration: 1
    })
    this.animationInit = animationInit;
    animationInit.rotate(0).step()
    this.setData({
      animationData: animationInit.export(),
      btnDisabled: 'disabled'
    })

    // 旋转抽奖
    setTimeout(function () {
      var animationRun = wx.createAnimation({
        duration: 4000,
        timingFunction: 'ease'
      })
      that.animationRun = animationRun
      animationRun.rotate(360 * 8 - awardIndex * (360 / that.data.awardsConfig.awards.length)).step()
      that.setData({
        animationData: animationRun.export()
      })
    }, 100)

      // 未中奖提示
    if (that.data.awardIndex==0){
      // 中奖提示
      setTimeout(function () {
        wx.showModal({
          title: '很遗憾',
          content: '这次没有中奖',
          showCancel: false
        })
        that.setData({
          btnDisabled: 'disabled'
        })
      }, 4100);
    }else{
      // 中奖提示
      setTimeout(function () {
        wx.showModal({
          title: '恭喜',
          content: '获得' + (awardsConfig.awards[awardIndex].name),
          showCancel: false
        })
        that.setData({
          btnDisabled: 'disabled'
        })
      }, 4100);
    }
  },
  onReady: function (e) {
    var that = this;
    var lottery = app.globalData.lottery.award_list
    app.p(app.globalData.lottery)
    var awards = new Array()
    for(var i = 0;i<lottery.length;i++){
      var award = {index:parseInt(lottery[i]['award_index']),
                    name:lottery[i]['award_name']}
      awards.push(award)
    }
    that.setData({
      sub_title:app.globalData.lottery.sub_title,
      notice: app.globalData.lottery.notice,
      awardsConfig:{chance:true,awards:awards},
      awardIndex:app.globalData.lottery.award_index
    })
    // 绘制转盘
    var awardsConfig = that.data.awardsConfig.awards,
      len = awardsConfig.length,
      rotateDeg = 360 / len / 2 + 90,
      html = [],
      turnNum = 1 / len  // 文字旋转 turn 值
    that.setData({
      btnDisabled: that.data.awardsConfig.chance ? '' : 'disabled'
    })
    var ctx = wx.createContext()
    for (var i = 0; i < len; i++) {
      // 保存当前状态
      ctx.save();
      // 开始一条新路径
      ctx.beginPath();
      // 位移到圆心，下面需要围绕圆心旋转
      ctx.translate(150, 150);
      // 从(0, 0)坐标开始定义一条新的子路径
      ctx.moveTo(0, 0);
      // 旋转弧度,需将角度转换为弧度,使用 degrees * Math.PI/180 公式进行计算。
      ctx.rotate((360 / len * i - rotateDeg) * Math.PI / 180);
      // 绘制圆弧
      ctx.arc(0, 0, 150, 0, 2 * Math.PI / len, false);

      // 颜色间隔
      if (i % 2 == 0) {
        ctx.setFillStyle('#ffb820');
      } else {
        ctx.setFillStyle('#ffcb3f');
      }

      // 填充扇形
      ctx.fill();
      // 绘制边框
      ctx.setLineWidth(0.5);
      ctx.setStrokeStyle('#e4370e');
      ctx.stroke();

      // 恢复前一个状态
      ctx.restore();

      // 奖项列表
      html.push({ turn: i * turnNum + 'turn', award: awardsConfig[i].name });
    }
    that.setData({
      awardsList: html
    });

    wx.drawCanvas({
      canvasId: 'lotteryCanvas',
      actions: ctx.getActions()
    })

  }

})
