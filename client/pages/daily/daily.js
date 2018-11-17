// pages/daily/daily.js
import api from '../../utils/api.js'
import util from '../../utils/util.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dailyList:{}
  
  },

  tapAvatar(e){
    var editor = e.currentTarget.dataset.editor
    wx.showModal({
      title: '作者',
      content: editor.name + '/' + editor.bio,
      showCancel:true,
      confirmText:'个人主页',
      success: (res)=>{
        if (res.confirm){
          util.copyToClipboard(editor.url)
        } 

      }

    })
  },

  tapContent(event){
    var story = event.currentTarget.dataset.story
    wx.navigateTo({
      url: `/pages/story/story?id=${story.id}&name=${story.title}`
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    wx.setNavigationBarTitle({
      title: options.name,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.startPullDownRefresh({})
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
    api.getDaily(this.data.id).then((res) => {
      this.setData({
        dailyList:res.data
      })
      
      wx.stopPullDownRefresh()
    }).catch(e=>{
      wx.stopPullDownRefresh()
      console.log(e)
    })
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