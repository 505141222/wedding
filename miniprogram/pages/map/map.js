// miniprogram/pages/map/map.js
const app = getApp()
const {latitude, longitude, title} = app.globalData

Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: latitude,
    longitude: longitude,
    markers: [{
      iconPath: '/images/nav.png',
      id: 0,
      latitude: latitude,
      longitude: longitude,
      width: 50,
      height: 50,
      title: title
    }]
  },
  linkHe(){
    wx.makePhoneCall({
      phoneNumber: '10086'
    })
  },
  linkShe() {
    wx.makePhoneCall({
      phoneNumber: '10086'
    })
  },
  toNav(){
    wx.openLocation({
      latitude: latitude,
      longitude: longitude,
      scale: 18
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