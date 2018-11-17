var https = require('https');
var proxy = require('../tools/proxy.js');
// import proxy from '../tools/proxy.js'

const douban_movie = 'https://api.douban.com/v2/book/series/1/books'
/**
 *  var books =  async(ctx, next) => {
  await next()
  try {
    var res = await https.get(douban_movie)
    const {
      statusCode
    } = res;
    console.log(res)
    if (statusCode === 200) {
      ctx.state.data = await res.on("data");
    }
  } catch (err) {
    console.log(err);

  }
}

 */


module.exports = function*(ctx, next) {
  ctx.state.data = yield proxy(douban_movie)

}