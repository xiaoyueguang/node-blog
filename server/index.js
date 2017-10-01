const routerMiddle = require('./router')
const Server = require('./Core/serverCore')
const DBMiddle = require('./Core/dbCore')
const templateMiddle = require('./Core/templateCore')

Server(async function (request, response, context) {
  await templateMiddle(request, response, context)
  await DBMiddle(request, response, context)
  await routerMiddle(request, response, context)
}, function (e) {
  console.log(e)
}, 3000)
