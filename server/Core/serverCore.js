const http = require('http')
module.exports = function (
  success = () => {},
  fail = () => {},
  port = 3000
) {
  const server = http.createServer(async (request, response) => {
    const context = {
      // 主体内容
      body: 'Not Found',
      // 状态
      status_code: 404,
      // 头
      header: {
        // 内容类型
        'Content-Type': 'text/plain'
      },
      // 是否继续?
      isNext: true,
      isBinary: false,
      request,
      response
    }

    try {
      await success(context)
    } catch (e) {
      fail(e)
    }
    response.writeHead(context.status_code, context.header)
    const writeObject = [context.body]
    context.isBinary && writeObject.push('binary')
    response.write(context.body + '', context.isBinary ? 'binary' : '')
    response.end()
  }).listen(port)

  return server
}
