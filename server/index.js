const routerMiddle = require('./router')
const Server = require('./Core/serverCore')
const DBMiddle = require('./Core/dbCore')
const templateMiddle = require('./Core/templateCore')
const staticMiddle = require('./Core/staticCore')

Server(async function (request, response, context) {
  await staticMiddle(request, response, context)
  await context.static('/public', './public')

  await templateMiddle(request, response, context)
  await DBMiddle(request, response, context)
  await routerMiddle(request, response, context)
}, function (e) {
  console.log(e)
}, 3000)
