const Koa = require('koa')
const app = new Koa()
const debug = require('debug')('koa-weapp-demo')
const response = require('./middlewares/response')
const bodyParser = require('./middlewares/bodyparser')
const config = require('./config')
const proxy = require('koa-server-http-proxy')

const GANK_HOST_URI = 'http://gank.io/api';
const ZHIHU_HOST_URI = 'https://news-at.zhihu.com';
const ONE_HOST_URI = 'http://v3.wufazhuce.com:8000';
const BING_HOST_URI = 'https://www.bing.com';


// 使用响应处理中间件
app.use(response)

// 解析请求体
app.use(bodyParser())
app.setMaxListeners(20)

var booksPathRewrite = function(path, req) {
    // var page = path.replace(/[^0-9]/ig,""); 
    // return '/v2/book/series/'+ page + '/books'
    var path = path.replace('/books', '/v2/book/series') + '/books';
    console.log(path)
    return path
};

var postsathRewrite = function(path, req) {
    return path.replace('/posts', '/ajaxlist')
};

var dailyPathRewrite = function(path, req) {
    return path.replace('/daily', '/api/4/theme')
};

var storyPathRewrite = function(path, req) {
    return path.replace('/story', '/api/4/story')
};

var oneListPathRewrite = function(path, req) {
    return path.replace('/onelist', '/api/onelist')
}

var headers = {
    'Referer': '',
}

var onProxyReq = function(proxyReq, req, res) {
    proxyReq.setHeader('Referer', '');
    // console.log('proxyReq:', proxyReq)
    req.headers['referer'] = ''
    console.log('req:', req)
};

var onError = function(err, req, res) {
    res.writeHead(500, {
        'Content-Type': 'text/plain'
    });
    res.end('Something went wrong. And we are reporting a custom error message.');
}

var onProxyRes = function(proxyRes, req, res) {
    // proxyRes.headers['x-added'] = 'foobar';     // add new header to response
    console.log('res:', res)
}

var oneProxyReq = (proxyReq, req, res) => {
    proxyReq.setHeader('Referer', '');
    // proxyReq.setHeader('Accept', '');
    // proxyReq.setHeader('Accept-Encoding', '');
    proxyReq.setHeader('User-Agent', 'Paw/3.1.7 (Macintosh; OS X/10.13.6) GCDHTTPRequest');
    req.headers['referer'] = ''

}

const proxyTable = {
    '/posts': {
        target: 'http://m.wufazhuce.com/one',
        pathRewrite: postsathRewrite,
        changeOrigin: true,
    },
    '/token': {
        target: 'http://m.wufazhuce.com/one',
        pathRewrite: { '^/token': '' },
        changeOrigin: true,
    },
    '/books': {
        'target': 'https://api.douban.com',
        pathRewrite: booksPathRewrite,
        changeOrigin: true,
        onProxyReq: onProxyReq,
        onError: onError,
        onProxyRes: onProxyRes

    },
    '/daily-list': {
        target: ZHIHU_HOST_URI,
        pathRewrite: { '^/daily-list': '/api/4/themes' },
        changeOrigin: true,
    },
    '/daily': {
        target: ZHIHU_HOST_URI,
        pathRewrite: dailyPathRewrite,
        changeOrigin: true,
    },
    '/story': {
        target: ZHIHU_HOST_URI,
        pathRewrite: storyPathRewrite,
        changeOrigin: true,
    },
    '/idlist': {
        target: ONE_HOST_URI,
        pathRewrite: { '^/idlist': '/api/onelist/idlist/' },
        onProxyReq: oneProxyReq,
        changeOrigin: true
    },
    '/onelist': {
        target: ONE_HOST_URI,
        pathRewrite: oneListPathRewrite,
        onProxyReq: oneProxyReq,
        changeOrigin: true
    },
    '/image': {
        target: BING_HOST_URI,
        pathRewrite: { '^/image': '/HPImageArchive.aspx' },
        changeOrigin: true
    }
}
Object.keys(proxyTable).forEach((context) => {
    var options = proxyTable[context]
    app.use(proxy(context, options))
})

// 引入路由分发
const router = require('./routes')
app.use(router.routes())


// 启动程序，监听端口
app.listen(config.port, () => debug(`listening on port ${config.port}`))