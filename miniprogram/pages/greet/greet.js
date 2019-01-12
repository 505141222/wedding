// miniprogram/pages/greet/greet.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userList:[],
    openId: '',
    userInfo: '',
    timer: null,
    flag: false,
    doubleFlag: false
  },
  managePhoto(e){
    const that = this
    const { flag, doubleFlag, timer} = this.data
    if (flag){
      wx.navigateTo({
        url: '/pages/chooseManage/index',
      })
    } else {
      if (doubleFlag) {
          clearTimeout(timer)
          wx.navigateTo({
            url: '/pages/beManager/index',
          })
      } else{
        this.setData({
          doubleFlag: true,
          timer: setTimeout(()=>{
            that.setData({
              doubleFlag: false
            })
          },300)
        })
      }
    }
  },
  goToManage(){
    const that = this
    wx.cloud.callFunction({
      name: 'user',
      data: {
        method: 'get'
      }
    }).then(res => {
      console.log(res)
      if (res.result.openid == "oZJOo5SnRnFsS-PJ6ykHZCESB8Gg") {
        wx.navigateTo({
          url: '/pages/manage/index',
        })
      }
    })
  },
  getUserId(){
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
  getManageRight(openid){
    const that = this
    const db = wx.cloud.database()
    const manager = db.collection('manager')
    manager.where({
      _openid: openid
    }).get().then((res)=>{
      let flag = false
      if(res.data.length){
        flag = true
      }
      that.setData({
        flag
      })
    })
  },
  sendGreet(e) {

    const that = this
    if (e.detail.errMsg === 'getUserInfo:ok') {
      wx.getUserInfo({
        success: function (res) {
          that.setData({
            userInfo :res.userInfo
          })
          that.getOpenId()
        }
      })
    }
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
      console.log('addUser',res)
      that.getUserList()
    })
  },

  getOpenId() {
    const that = this
    wx.cloud.callFunction({
      name: 'user',
      data: {}
    }).then(res => {

      that.setData({
        openId : res.result.openid
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
      } else {
        wx.showToast({
          title: '您已经送过祝福了~'
        })
      }
    })
  },

  getUserList() {
    const that = this
    wx.cloud.callFunction({
      name: 'userList',
      data: {}
    }).then(res => {
      that.setData({
        userList : res.result.data.reverse()
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
    this.getUserList()
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