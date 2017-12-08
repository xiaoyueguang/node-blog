module.exports = async context => {
  context.body = 'alert("hello world")'
  context.header['Content-Type'] = 'application/javascript'
}
