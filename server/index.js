const routerMiddle = require('./router')
const Server = require('./Core/serverCore')

Server(function (request, response, context) {
  routerMiddle(request, response, context)
}, function (e) {
  console.log(e)
}, 3000)
