// miniprogram/pages/beManager/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    password: '',
    openId: ''
  },
  inputPassword(e){
    console.log(e)
    this.setData({
      password: e.detail.value
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
    })
  },
  beManager(){
    const {password} = this.data
    if (password == '123456'){
      const db = wx.cloud.database()
      const manager = db.collection('manager')
      manager.add({
        data:{
          flag: true
        }
      }).then(()=>{
        wx.showToast({
          title: '恭喜你成为管理员！3秒后退回上一页面',
          icon: 'none',
          duration: 3000
        })
        setTimeout(()=>{
          wx.navigateBack({
            delta: 1
          })
        },3000)
      })

    }else{
      wx.showToast({
        title: '密码错误，请联系新郎获取管理员密码',
        icon: 'none'
      })
    }
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