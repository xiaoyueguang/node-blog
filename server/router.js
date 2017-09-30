const home = require('./Controller/home')
const foo = require('./Controller/foo')
const bar = require('./Controller/bar')
const router = require('./Core/routerCore')

module.exports = async function (request, response, context) {
  const {get, post, any} = router(request, response, context)

  await get('/foo', foo)
  await get('/foo/:id', bar)
  await get('/bar', foo)
  await post('/bar', bar)
  await any('/', home)
}
