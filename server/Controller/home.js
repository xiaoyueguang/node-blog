module.exports = (request, response, context) => {
  let db = new context.DB()
  db.table('table')
    .where('id = 1')
    .where('id = 2', 'or')
    .select('*')

  context.body = 'Hello World!'
}
