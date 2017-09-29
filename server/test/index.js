const serverCore = require('../Core/serverCore')
const axios = require('axios')

const queue = []

axios('http://localhost:3000').then(val => {
}, e => {
  serverCore(async (request, response, context) => {
    console(queue.length)
    let i = 0
    while (i < queue.length) {
      await queue[i](request, response, context)
      i++
    }
  })
})

exports.add = fn => {
  queue.push(fn)
}

exports.remove = fn => {
  const index = queue.indexOf(fn)
  if (index === -1) return false
  queue.splice(index, 1)
}
