// import fetch from 'node-fetch'
const fetch = require("node-fetch");

module.exports = (...args) => {
  return fetch.apply(null, args).then(function (res) {
    return res.text()
  })
}

