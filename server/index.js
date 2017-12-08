const routerMiddle = require('./router')
const Server = require('./Core/serverCore')
const DBMiddle = require('./Core/dbCore')
const templateMiddle = require('./Core/templateCore')
const staticMiddle = require('./Core/staticCore')

Server(async function (context) {
  await staticMiddle(context)
  await context.static('/public', './public')

  await templateMiddle(context)
  await DBMiddle(context)
  await routerMiddle(context)
}, function (e) {
  console.log(e)
}, 3000)
