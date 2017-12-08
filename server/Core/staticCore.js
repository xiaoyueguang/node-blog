const fs = require('fs')

const suffixMap = {
  html: 'text/html',
  css: 'text/css',
  js: 'application/x-javascript',
  gif: 'image/gif',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png'
}

function readFile (path) {
  return new Promise((resolve, reject) => {
    fs.stat('.' + path, (err, stats) => {
      if (err) reject(err)
      if (stats) {
        fs.readFile('.' + path, 'binary', (err, data) => {
          if (err) reject(err)
          resolve(data)
        })
      } else {
        resolve('')
      }
    })
  })
}

module.exports = exports = async context => {
  context.static = async function (url, path, response) {
    let matchURL = context.request.url.substr(0, url.length + 1)
    // 匹配到的时候就才读取
    if (url + '/' === matchURL) {
      let text
      try {
        text = await readFile(context.request.url)
        context.status_code = 200
        const type = getType(getSuffix(context.request.url))
        context.header['Content-Type'] = type
        // const time = new Date().getTime()
        if (type.indexOf('image') > -1) {
        }
        context.isBinary = true
        context.body = text
      } catch (e) {
      }
      // 告诉下个中间件不需要处理了
      context.isNext = false
    }
  }
}

/**
 * 获取后缀名
 * @param {string} path 路径
 * @return {string}
 */
function getSuffix (path) {
  const paths = path.split('.')
  return paths[paths.length - 1]
}

/**
 * 获取对应的数据
 * @param {string} suffix 后缀名
 * @return {string}
 */
function getType (suffix) {
  return suffixMap[suffix]
}

exports.getSuffix = getSuffix
exports.getType = getType
