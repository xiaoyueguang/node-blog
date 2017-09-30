const routerMiddle = require('./router')
const Server = require('./Core/serverCore')
const DBMiddle = require('./Core/dbCore')

Server(async function (request, response, context) {
  context.header['Content-Type'] = 'text/json'

  DBMiddle(request, response, context)
  await routerMiddle(request, response, context)
}, function (e) {
  console.log(e)
}, 3000)
