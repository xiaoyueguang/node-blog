const serverCore = require('../Core/serverCore')
const axios = require('axios')
const queue = []
// 随机端口
const port = exports.port = parseInt(Math.random() * 1000, 10) + 9000
axios.default.baseURL = `http://localhost:${port}`

serverCore(async function (context) {
  let i = 0
  while (i < queue.length) {
    await queue[i](context)
    i++
  }
}, e => {}, port)

// 添加方法
exports.add = fn => {
  console.log(port)
  queue.push(fn)
}
// 删除方法
exports.remove = fn => {
  const index = queue.indexOf(fn)
  if (index === -1) return false
  queue.splice(index, 1)
}
// 随机文字
exports.text = Math.random().toString(36).substr(2)
// URL
exports.baseURL = `http://localhost:${port}`
