var DEV = 0;
const HOST = DEV ? 'http://localhost:5757' : 'https://kdpfezb5.qcloud.la'
const DOUBAN_HOST_URI = HOST;
const ONE_HOST_URI = HOST;




function _obj2uri(obj) {
  if (!obj) {
    return '';
  }
  return '?' + Object.keys(obj).map(function(k) {
    return encodeURIComponent(k) + "=" + encodeURIComponent(obj[k]);
  }).join('&');
}

//http://m.wufazhuce.com/one/ajaxlist/'
function _getOnePostList(page, data) {
  var url = ONE_HOST_URI + '/posts/' + page + _obj2uri(data);
  console.log(url)
  return url;

}

function _getDoubanBooks(id) {
  return DOUBAN_HOST_URI + '/books/' + id;
}

function _getDailyList() {
  return HOST + '/daily-list';
}

function _getDaily(page, data) {
  return HOST + '/daily/' + data.id;
}

function _getStory(page, data) {
  return HOST + '/story/' + data.id;
}

function _getOnePosts(page,data){
  return HOST + '/idlist' + _obj2uri(data);

}

function _getOneList(page,data){
  return HOST + '/onelist' + _obj2uri(data);

}

function _getBanners(page, data){
  return HOST + '/image' + _obj2uri(data);
}

function getData(api, page, data, header) {
  var headers = Object.assign({
    'content-type': 'application/json,text/javascript; charset=UTF-8',
    'Accept': 'application/json, text/javascript, */*; q=0.01'
  }, header)
  return new Promise((resolve, reject) => {
    wx.request({
      url: api(page, data),
      method: 'GET',
      header: headers,
      success: (res) => {
        console.log(res);
        if (res.statusCode === 200) {
          resolve(res)
        } else {
          reject('数据拉取失败，请稍后再试...')
        }
      },
      fail: (error) => {
        console.log(error);
        reject(error)
        wx.showToast({
          title: JSON.stringify(error),
        })
      },
      complete: () => {

      }
    })
  })
}


function _fetchtOneToken() {
  return new Promise((resolve, reject) => {
    wx.request({
      url: ONE_HOST_URI + '/token',
      responseType: 'text',
      success: (response) => {
        if (response.statusCode == 200) {
          var _token = response.data.split("One.token = '")[1].split("'")[0];
          var _cookie = response.header['set-cookie'];
          if (_token && (_token.length >= 40) && _cookie.length >= 0) {
            var curDate = new Date();
            //十分钟过期
            var expiresTime = curDate.getTime() + 1000 * 60 * 10
            resolve({
              token: _token,
              cookie: _cookie,
              expires: expiresTime
            })
          }

        }else{
          reject('请求失败:', response)
        }
      },
      fail: (error) => {
        reject(error)
      }
    })
  })
}

function postData(api, data) {

  let formData = new FormData();
  if (data) {
    for (let key in data) {
      formData.append(key, data[key])
    }
  }
  return new Promise((resolve, reject) => {
    fetch(api(data), {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: formData,
      })
      .then((response) => {
        return response.json()
      })
      .catch((error) => {
        reject(error);
      }).then((responseData) => {
        console.log(responseData);
        if (!responseData) {
          reject(new Error('responseData is null'));
          return;
        }
        resolve(responseData);
      }).done();
  })
}

export default {
  fetchtOneToken() {
    return _fetchtOneToken()
  },
  getOnePostList(page, data, header) {
    return getData(_getOnePostList, page, data, header)
  },
  getDoubanBooks(page) {
    return getData(_getDoubanBooks, page, {}, {})
  },
  getDaily(id) {
    return getData(_getDaily, null, {
      id: id
    }, {})
  },
  getDailyList() {
    return getData(_getDailyList)
  },
  getStory(id){
    return getData(_getStory, null, {id:id},{ })
  },
  getOnePosts(data){
    return getData(_getOnePosts, null, data, {})
  },

  getOneList(data){
    return getData(_getOneList, null, data, {})
  },
  getBanners(data){
    return getData(_getBanners, null, data, {})
 
  }
};