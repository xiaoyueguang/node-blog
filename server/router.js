const home = require('./Controller/home')
const router = require('./Core/routerCore')

module.exports = async function (request, response, context) {
  const {get, post, delete: Delete} = router(request, response, context)

  await get('/', home.index)
  await get('/detail/:id', home.detail)
  await post('/detail', home.create)
  await post('/detail/:id', home.update)
  await Delete('/detail/:id', home.delete)
}
