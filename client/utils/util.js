import api from './api'
const ONE_TOKEN_COOKIE_KEY = 'one_token_cookie_key';
const USER_INFO_KEY = 'user_info_key';

const util = {

  formatTime: date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    date.get
    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  },

  formatNumber: n => {
    n = n.toString()
    return n[1] ? n : '0' + n
  },

  // 显示繁忙提示
  showBusy: text => wx.showToast({
    title: text,
    icon: 'loading',
    duration: 10000
  }),

  // 显示成功提示
  showSuccess: text => wx.showToast({
    title: text,
    icon: 'success'
  }),

  // 显示失败提示
  showModel: (title, content) => {
    wx.hideToast();

    wx.showModal({
      title,
      content: JSON.stringify(content),
      showCancel: false
    })
  },

  copyToClipboard(str) {
    wx.setClipboardData({
      data: str,
      success: () => {
        wx.showToast({
          title: '复制成功...',
        })
      }
    })

  },

  saveUserInfo(data){
    wx.setStorage({
      key: USER_INFO_KEY,
      data: JSON.stringify({
        'logged': true,
        'userInfo': data
      }),
    })
  },

  getUserInfo(){
    var userInfo =  wx.getStorageSync(USER_INFO_KEY)
    return userInfo;
  },

  saveOneToken(token) {
    return new Promise((resolve, reject) => {
      wx.setStorage({
        key: ONE_TOKEN_COOKIE_KEY,
        data: token,
        success: () => {
          resolve()
        },
        fail: (error) => {
          reject(error)
        },
        complete: () => {

        }
      })

    })

  },

  getOneToken() {
    try {
      var value = wx.getStorageSync(ONE_TOKEN_COOKIE_KEY)
      if (value) {
        return value;
      }
    } catch (e) {
      // Do something when catch error
      return null;
      console.log(e);
    }
  },

  loadOneToken() {
    const that = this
    return new Promise((reslove, reject) => {
      var data = that.getOneToken()
      if (data != null) {
        var expiresTime = data.expires
        var curDate = new Date();
        if (expiresTime > curDate.getTime()) {
          reslove(data)
          return
        }
      }
      console.log('token已经过期')
      api.fetchtOneToken().then((data) => {
        console.log('token 获取成功')
        reslove(data)
        this.saveOneToken(data).then(() => {
          console.log('token 存储成功')
        }).catch((e) => {
          reject(e)
          console.log('token 存储失败')
        })

      }).catch((e) => {
        reject(e)
        console.log('token 获取失败', e)
      })


    })
  },
  saveBanner(data){
    wx.setStorage({
      key: 'banners_key',
      data: data,
      success: () => {
        console.log('banner存储成功')
      }
    }).catch(() => {
      console.log('banner存储失败')

    })
  },
  getBanner(){
   return wx.getStorageSync('banners_key');
  }
}



module.exports = util