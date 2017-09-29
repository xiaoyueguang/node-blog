const http = require('http')

module.exports = function (
  success = () => {},
  fail = () => {},
  port = 3000
) {
  const server = http.createServer(async (request, response) => {
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
      await success(request, response, context)
    } catch (e) {
      fail(e)
    }
    response.writeHead(context.status_code, context.header)
    response.write(context.body)
    response.end()
  }).listen(port)

  return server
}
