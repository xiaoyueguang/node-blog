module.exports = async (request, response, context) => {
  context.body = 'alert("hello world")'
  context.header['Content-Type'] = 'application/javascript'
}
