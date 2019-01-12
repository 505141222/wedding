// miniprogram/pages/index/index.js
const audioCtx = wx.createInnerAudioContext()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerImg: [],
    isPlay: false,
    musicList: [],
    musicIndex: 0
  },
  getBannerImg() {
    const that = this
    wx.cloud.callFunction({
      name: 'bannerImgList',
      data: {}
    }).then(res => {
      console.log(res)
      that.setData({
        bannerImg: res.result.data
      })
    })
  },
  audioPlay(){
    let { isPlay} = this.data
    if (isPlay){
      audioCtx.pause()
    }else{
      audioCtx.play()
    }
    this.setData({
      isPlay: !isPlay
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  getBGmusic(){
    const that = this
    wx.cloud.callFunction({
      name: 'music',
      data: {}
    }).then(res => {
      audioCtx.src = res.result.data[0].url,
      audioCtx.play()
      that.setData({
        isPlay: true,
        musicList: res.result.data,
        musicIndex: 0
      })
      audioCtx.onEnded(()=>{
      
        const { musicIndex, musicList } = that.data
        let nextIndex = musicIndex + 1
        if (nextIndex >= musicList.length){
          nextIndex = 0
        }
        audioCtx.src = musicList[nextIndex].url
        console.log(audioCtx, musicList)
        audioCtx.onCanplay(()=>{
          audioCtx.play()
        })
        that.setData({
          musicIndex: nextIndex
        })
      })
    })
   
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getBannerImg()
    this.getBGmusic()
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