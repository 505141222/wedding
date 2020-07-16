// miniprogram/pages/message/message.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isOpen: false,
    desc: '',
    messageList: [],
    openId: '',
    userInfo: '',
    isForm: false,
    isVideo: false,
    isFormlist: false,
    formList: [],
    flag: false,
    startX: '',
    startY: ''
  },
  delete(e){
    const {id} = e.target.dataset
    const that = this
    wx.cloud.callFunction({
      name: 'handleList',
      data: {
        method: 'delete',
        id,
        dbName: 'message'
      }
    }).then(res => {
      console.log('aaa', res)
      this.getMessageList()
    })
  },
  touchstart(e){
    if (!this.data.flag) {
      return false
    }
    if (e.changedTouches.length == 1) {
      //开始触摸时 重置所有删除
      let { messageList } = this.data;
      const index = e.currentTarget.dataset.index;
      messageList.forEach(function (v, i) {
        if (v.isTouchMove && index !== i)//只操作为true的
          v.isTouchMove = false;
      })
      this.setData({
        startX: e.changedTouches[0].clientX,
        startY: e.changedTouches[0].clientY,
        messageList: messageList
      })
    }
     console.log(e)
  },
  touchmove: function (e) {
    if (!this.data.flag) {
      return false
    }
    if (e.changedTouches.length == 1) {
      var that = this, index = e.currentTarget.dataset.index;//当前索引
      const { startX, startY, messageList } = this.data;
      const touchMoveX = e.changedTouches[0].clientX;//滑动变化坐标
      const touchMoveY = e.changedTouches[0].clientY;//滑动变化坐标
      //获取滑动角度
      const angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
      const distance = touchMoveX - startX
      if (distance>50){
        messageList[index].isTouchMove = false
      } else if (distance < -50){
        messageList[index].isTouchMove = true
      }
      console.log(distance)
      // messageList.forEach(function (v, i) {
      //   v.isTouchMove = false
      //   //滑动超过30度角 return
      //   if (Math.abs(angle) > 30) return;
      //   if (i == index) {
      //     if (touchMoveX > startX) {
      //       v.isTouchMove = false
      //     } //右滑    
      //     else {
      //       v.isTouchMove = true
      //     } //左滑        
      //   }
      // })
      this.setData({
        messageList
      })
    } 
  },
  angle: function (start, end) {
      var _X = end.X - start.X,_Y = end.Y - start.Y
      //返回角度 /Math.atan()返回数字的反正切值
      return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  inputDesc(e){
    this.setData({
      desc: e.detail.value
    })
  },
  toMessage(e) {
    const that = this
    if (e.detail.errMsg === 'getUserInfo:ok') {
      // that.isOpen = true
      wx.getUserInfo({
        success: function (res) {
          that.setData({
            userInfo: res.userInfo,
            isOpen: true
          })
          that.getOpenId()
        }
      })
    }
  },
  getUserId() {
    const that = this
    wx.cloud.callFunction({
      name: 'user',
      data: {}
    }).then(res => {
      console.log(res)
      that.setData({
        openId: res.result.openid
      })
      // if (res.result.openid == "oZJOo5SnRnFsS-PJ6ykHZCESB8Gg") {
      //   wx.navigateTo({
      //     url: '/pages/manage/index',
      //   })
      // }
      that.getManageRight(res.result.openid)
    })
  },
  getManageRight(openid) {
    const that = this
    const db = wx.cloud.database()
    const manager = db.collection('manager')
    manager.where({
      _openid: openid
    }).get().then((res) => {
      let flag = false
      if (res.data.length) {
        flag = true
      }
      that.setData({
        flag
      })
    })
  },
  cancel() {
    const that = this
    that.setData({
      isOpen: false
    })
  },
  scroll(){

  },
  sendMessage() {
    const that = this
    if (that.data.desc) {
      const db = wx.cloud.database()
      const message = db.collection('message')
      message.add({
        data: {
          desc: that.data.desc,
          type: 'message',
          time: that.getNowFormatDate(),
          url: that.data.userInfo.avatarUrl,
          name: that.data.userInfo.nickName
        }
      }).then(res => {
        that.setData({
          isOpen: false,
          desc: ''
        })
        that.getMessageList()
      })
    } else {
      tools.showToast('说点什么吧~')
    }
  },

  getNowFormatDate() {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1
    const day = now.getDate()
    const hh = now.getHours()
    const mm = now.getMinutes()
    const ss = now.getSeconds()
    let clock = year + '-'
    if (month < 10) {
      clock += '0'
    }
    clock += month + '-'
    if (day < 10) {
      clock += '0'
    }
    clock += day + ' '
    if (hh < 10) {
      clock += '0'
    }
    clock += hh + ':'
    if (mm < 10) {
      clock += '0'
    }
    clock += mm + ':'
    if (ss < 10) {
      clock += '0'
    }
    clock += ss
    return clock
  },

  getMessageList() {
    const that = this
    wx.cloud.callFunction({
      name: 'messageList',
      data: {
        method: 'get'
      }
    }).then(res => {
      console.log('getMessageList',res)
      that.setData({
        messageList: res.result.data.reverse()
      })
    })
  },

  toForm() {
    const that = this
    that.setData({
      isForm: true
    })
  },

  closeForm() {
    const that = this
    console.log(111)
    this.setData({
      isForm: false
    })
  },

  addUser() {
    const that = this
    const db = wx.cloud.database()
    const user = db.collection('user')
    user.add({
      data: {
        user: that.data.userInfo
      }
    }).then(res => {
      console.log(res)
    })
  },

  getOpenId() {
    const that = this
    wx.cloud.callFunction({
      name: 'user',
      data: {}
    }).then(res => {
      that.setData({
        openId: res.result.openid
      })
      that.getIsExist()
    })
  },

  getIsExist() {
    const that = this
    const db = wx.cloud.database()
    const user = db.collection('user')
    user.where({
      _openid: that.data.openId
    }).get().then(res => {
      if (res.data.length === 0) {
        that.addUser()
      }
    })
  },

  toVideo() {
    const that = this
    that.isVideo = true
  },

  closeVideo() {
    const that = this
    that.isVideo = false
  },

  lookList() {
    const that = this
    this.setData({
      isFormlist: true
    })
    that.getFromlist()
  },

  closeFormlist() {
    this.setData({
      isFormlist: false
    })
  },

  getFromlist() {
    const that = this
    wx.cloud.callFunction({
      name: 'presentList',
      data: {}
    }).then(res => {
      that.setData({
        formList: res.result.data.reverse()
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getMessageList()
    this.getFromlist()
    this.getUserId()

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})