// miniprogram/pages/manage/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerImg: [],
    swiperImg: [], 
    albumImg: []
  },
  deleteImg(e){
    console.log(e)
    const {id,dbname}=e.target.dataset

    const db = wx.cloud.database()
    const imgArr = db.collection(dbname)
    imgArr.doc(id).remove().then((res)=>{
      this.getImg(dbname)
    })
  },
  uploadBanner(){
    this.doUpload('banner')
  },
  uploadSwiper(){
    this.doUpload('swiper')
  },
  uploadAlbum() {
    this.doUpload('album')
  },
  // 上传图片
  doUpload: function (dbName) {
    // 选择图片
    wx.chooseImage({
      count: 9,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })
        res.tempFilePaths.forEach((item) => {
          let arr = item.split('/')
          const len = arr.length
          const cloudPath = arr[len - 1]
          wx.cloud.uploadFile({
            cloudPath,
            filePath: item,
            success: res => {
              console.log('[上传文件] 成功：', res)
              const db = wx.cloud.database()
              const imgArr = db.collection(dbName)
              imgArr.add({
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
        if (!res.tempFilePaths.length) {
          wx.hideLoading()
        }

      },
      fail: e => {
        console.error(e)
      }
    })
  },
  getImg(dbName) {
    const db = wx.cloud.database()
    const imgArr = db.collection(dbName)
    imgArr.get().then((res) => {
      console.log(res)
      this.setData({
        [dbName + 'Img']: res.data
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
    this.getImg('banner')
    this.getImg('swiper')
    this.getImg('album')
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