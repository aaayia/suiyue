// pages/post/post.js
import api from '../../utils/api'
import util from '../../utils/util.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    posts: [],
    banners: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    wx.startPullDownRefresh({})
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {


  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this._getPostList(true);
    this._getBanners()
  },
  _getBanners() {
    api.getBanners({
      'format': 'js',
      'idx': '0',
      'n': '7',
      'mkt': 'zh-CN'
    }).then((res) => {
      this.setData({
        banners: res.data.images
      })
      util.saveBanner(res.data.images);
    }).catch((error) => {

    })

  },

  _getPostList(reload) {

    var page = reload ? 0 : this.data.posts[this.data.posts.length - 1].id
    util.loadOneToken().then((data) => {
      api.getOnePostList(page, {
        '_token': data.token
      }, {
        'Cookie': data.cookie
      }).then((response) => {
        wx.stopPullDownRefresh()
        this.setData({
          posts: reload ? response.data.data : this.data.posts.concat(response.data.data)
        })
      }).catch((error) => {
        wx.stopPullDownRefresh()

      })
    })
  },

  tapImage(event) {
    var url = event.currentTarget.dataset.url
    wx.previewImage({
      urls: [url],
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this._getPostList(false)

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})