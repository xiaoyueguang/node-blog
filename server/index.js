const routerMiddle = require('./router')
const Server = require('./Core/serverCore')
const DBMiddle = require('./Core/dbCore')

Server(function (request, response, context) {
  DBMiddle(request, response, context)
  routerMiddle(request, response, context)
}, function (e) {
  console.log(e)
}, 3000)
