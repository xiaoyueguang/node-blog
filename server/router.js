const home = require('./Controller/home')
const foo = require('./Controller/foo')
const bar = require('./Controller/bar')
const router = require('./Core/routerCore')

module.exports = async function (request, response, context) {
  const {get, post, any} = router(request, response, context)

  get('/foo', foo)
  get('/foo/:id', bar)
  get('/bar', foo)
  post('/bar', bar)
  any('/', home)
}
