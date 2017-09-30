exports.index = async (request, response, context) => {
  let db = new context.DB()
  db.table('article')
    .select('*')

  let {result} = await db.exec()

  context.body = JSON.stringify(result)
}

exports.detail = async (request, response, context) => {
  let db = new context.DB()
  db.table('article')
    // 
    .where(`id = ${context.params.id}`)
    .select('*')
  let {result} = await db.exec()
  context.body = JSON.stringify(result)
}

exports.create = async (request, response, context) => {
  let db = new context.DB()
  db.table('article')
    .insert({
      title: '添加的标题',
      content: '添加的内容'
    })
  let {result} = await db.exec()
  context.body = JSON.stringify(result)
}

exports.update = async (request, response, context) => {
  let db = new context.DB()
  db.table('article')
    .where(`id = ${context.params.id}`)
    .update({
      title: '修改的标题',
      content: '修改的内容'
    })
  let {result} = await db.exec()
  context.body = JSON.stringify(result)
}

exports.delete = async (request, response, context) => {
  let db = new context.DB()
  db.table('article')
    .where(`id = ${context.params.id}`)
    .delete()
  let {result} = await db.exec()
  context.body = JSON.stringify(result)
}
