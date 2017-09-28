const http = require('http')

const logTime = (context, text) => (context.body += text + ': ' + new Date().getTime() + '<br/>')

let index = 0

http.createServer(async (request, response) => {
  const context = {
    // 主体内容
    body: '',
    // 状态
    status_code: 200,
    // 头
    header: {
      // 内容类型
      'Content-Type': 'text/plain'
    },
    // 是否继续?
    isNext: true
  }
  try {
    // 这里按照顺序 添加中间件
    logTime(context, '开始')
    await sleep(request, response, context)
    await sleep(request, response, context)
    await sleep(request, response, context)
    await sleep(request, response, context)
    await sleep(request, response, context)
    await sleep(request, response, context)
  } catch (e) {
    console.log(e)
  }

  response.writeHead(context.status_code, context.header)
  response.write(context.body)
  response.end()
}).listen(3000)

function sleep (request, response, context) {
  if (!context.isNext) return Promise.resolve()
  return new Promise((resolve, reject) => {
    if (Math.random() > 0.5) {
      const error = `sleep ${index} 中间件报错`
      context.body = JSON.stringify({
        code: 1,
        msg: error
      })
      context.status_code = 500
      context.header['Content-Type'] = 'text/json'
      context.isNext = false
      throw new Error(error)
    }
    setTimeout(() => {
      logTime(context, index++)
      context.header['Content-Type'] = 'text/html'
      resolve()
    }, 1000)
  })
}
