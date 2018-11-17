import api from '../../utils/api.js'

// pages/books/books.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dailyList:[]
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady(){
    wx.startPullDownRefresh({})

  },

  goDaily(e){
    var item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/pages/daily/daily?id=${item.id}&name=${item.name}`
    })
  },

  _getData(){
    api.getDailyList().then((response) => {
      if (response.statusCode == 200) {
        this.setData({
          dailyList: response.data.others
        })
        wx.stopPullDownRefresh()
      }
    }).catch((error) => {

    })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide () {
  
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
    this._getData()
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