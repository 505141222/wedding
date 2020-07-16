// miniprogram/pages/photo/photo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperImg: [],
    albumImg: [],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000
  },
  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 9,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })
        res.tempFilePaths.forEach((item)=>{
          let arr = item.split('/')
          const len = arr.length
          const cloudPath = arr[len - 1]
          wx.cloud.uploadFile({
            cloudPath,
            filePath: item,
            success: res => {
              console.log('[上传文件] 成功：', res)
              const db = wx.cloud.database()
              const swiper = db.collection('swiper')
              swiper.add({
                data: {
                  name: cloudPath,
                  url: res.fileID,
                }
              }).then(res => {
                
              })
            },
            fail: e => {
              console.error('[上传文件] 失败：', e)
              wx.showToast({
                icon: 'none',
                title: '上传失败',
              })
            },
            complete: () => {
              wx.hideLoading()
            }
          })
        })
        if (!res.tempFilePaths.length){
          wx.hideLoading()
        }

      },
      fail: e => {
        console.error(e)
      }
    })
  },
  getImg(){
    const that = this
    wx.cloud.callFunction({
      name: 'swiperImgList',
      data: {}
    }).then(res => {
      console.log(res)
      that.setData({
        swiperImg: res.result.data
      })
    })
  },
  getAlbumImg() {
    const that = this
    wx.cloud.callFunction({
      name: 'albumImgList',
      data: {}
    }).then(res => {
      console.log(res)
      that.setData({
        albumImg: res.result.data
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
    this.getImg()
    this.getAlbumImg()
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