//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')
var util = require('./utils/util.js')

App({
  logged:false,
  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    qcloud.setLoginUrl(config.service.loginUrl)

    let userInfo = util.getUserInfo();
    this.logged = JSON.parse(userInfo).logged
    this.bindGetUserInfo()


  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {

  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {

  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {

  },

  // 用户登录
  bindGetUserInfo: function () {
    if (this.logged) return

    util.showBusy('正在登录')

    const session = qcloud.Session.get()
    if (session) {
      // 第二次登录
      // 或者本地已经有登录态
      // 可使用本函数更新登录态
      qcloud.loginWithCode({
        success: res => {
          // this.setData({
          //   userInfo: res,
          //   logged: true
          // })
          util.saveUserInfo(res);
          console.log(res)
          util.showSuccess('登录成功')
        },
        fail: err => {
          console.error(err)
          util.showModel('登录错误', err.message)
        }
      })
    } else {
      // 首次登录
      qcloud.login({
        success: res => {
          // this.setData({
          //   userInfo: res,
          //   logged: true
          // })
          util.saveUserInfo(res);
          console.log(res)
          util.showSuccess('登录成功')
        },
        fail: err => {
          console.error(err)
          util.showModel('登录错误', err.message)
        }
      })
    }
  },

})
