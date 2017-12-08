exports.index = async context => {
  let db = new context.DB()
  db.table('blog_articles')
    .select('*')

  let {result} = await db.exec()

  context.body = context.view('home/index', {items: result})
}

exports.detail = async context => {
  let db = new context.DB()
  db.table('blog_articles')
    .where(`id = ${context.params.id}`)
    .select('*')
  let {result} = await db.exec()
  context.body = JSON.stringify(result)
}

exports.create = async context => {
  let db = new context.DB()
  db.table('blog_articles')
    .insert({
      title: '添加的标题',
      content: '添加的内容'
    })
  let {result} = await db.exec()
  context.body = JSON.stringify(result)
}

exports.update = async context => {
  let db = new context.DB()
  db.table('blog_articles')
    .where(`id = ${context.params.id}`)
    .update({
      title: '修改的标题',
      content: '修改的内容'
    })
  let {result} = await db.exec()
  context.body = JSON.stringify(result)
}

exports.delete = async context => {
  let db = new context.DB()
  db.table('blog_articles')
    .where(`id = ${context.params.id}`)
    .delete()
  let {result} = await db.exec()
  context.body = JSON.stringify(result)
}

exports.chenlin = async context => {
  context.body = JSON.stringify('HELLO CHENLIN!')
}
