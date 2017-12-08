const {expect} = require('chai')
const dbCore = require('../../Core/dbCore')
const DB = dbCore.DB

describe('dbCORE: 助手函数', function () {
  it('generationValues: 将数组转化为所需要的值', function () {
    expect(dbCore.generationValues([1, 2, 3, 4]))
      .to.be.equal('(1, 2, 3, 4)')
  })

  it('checkTable, 检查table是否设置正确', function () {
    let table = ''
    function exec () {
      dbCore.checkTable(table)
    }
    expect(exec).to.throw('没设置表名')
    table = 'foo'
    expect(exec).to.not.throw()
  })

  it('wrapValue: 将值包裹上一层 ""', function () {
    expect(dbCore.wrapValue(1)).to.be.equal('"1"')
  })
})

describe('dbCore: DB类', function () {
  it('实例化后, 检查属性', function () {
    let db = new DB()
    ;['_table', '_where', '_sql', '_order'].forEach(key => {
      expect(db[key]).to.be.equal('')
    })
    expect(db).to.be.instanceOf(DB)
  })

  it('实例化后, 调用table方法能设置table且返回自身', function () {
    let db = new DB()
    let foo = db.table('foo')
    expect(foo).to.be.equal(db)
    expect(foo).to.be.instanceOf(DB)
    expect(foo._table).to.be.equal('foo')
  })

  it('实例化后, 调用where方法能设置where且返回自身', function () {
    let db = new DB()
    let foo = db.where('id = 1')
    expect(foo).to.be.equal(db)
    expect(foo).to.be.instanceOf(DB)
    expect(foo._where).to.be.equal('id = 1')
    db.where('id = 2', 'or')
    expect(foo._where).to.be.equal('id = 1 OR id = 2')
    db.where('id = 3', 'and')
    expect(foo._where).to.be.equal('id = 1 OR id = 2 AND id = 3')
  })

  it('实例化后, 调用where方法后, 通过generationWhere能获取到最终的where语句', function () {
    let db = new DB()
    expect(db.generationWhere()).to.be.a('string')
    expect(db.generationWhere()).to.be.equal('')
    db.where('id = 1')
    expect(db.generationWhere()).to.be.equal(' WHERE id = 1')
    db.where('id = 2')
    expect(db.generationWhere()).to.be.equal(' WHERE id = 1 AND id = 2')
    db.where('id = 3', 'and')
    expect(db.generationWhere()).to.be.equal(' WHERE id = 1 AND id = 2 AND id = 3')
    db.where('id = 4', 'or')
    expect(db.generationWhere()).to.be.equal(' WHERE id = 1 AND id = 2 AND id = 3 OR id = 4')
  })

  it('实例化后, 调用order方法能设置order且返回自身', function () {
    let db = new DB()
    let foo = db.order('id')
    expect(foo).to.be.instanceOf(DB)
    expect(foo._order).to.be.equal('id')
    foo.order('created_at desc')
    expect(foo._order).to.be.equal('id, created_at desc')
    foo.order('updated_at asc')
    expect(foo._order).to.be.equal('id, created_at desc, updated_at asc')
  })

  it('实例化后, 调用order方法后, 通过generationOrder能获取到最终的order语句', function () {
    let db = new DB()
    expect(db.generationOrder()).to.be.a('string')
    expect(db.generationOrder()).to.be.equal('')
    db.order('id')
    expect(db.generationOrder()).to.be.equal(' ORDER BY id')
    db.order('created_at desc')
    expect(db.generationOrder()).to.be.equal(' ORDER BY id, created_at desc')
    db.order('updated_at asc')
    expect(db.generationOrder()).to.be.equal(' ORDER BY id, created_at desc, updated_at asc')
  })
})

describe('dbCore: select', function () {
  it('没有table, 则抛出错误', function () {
    let db = new DB()
    function exec () {
      db.select()
    }
    expect(exec).to.throw('没设置表名')
  })

  it('返回的依然是本身', function () {
    let db = new DB()
    let foo = db.table('foo').select()
    expect(foo).to.be.equal(db)
    expect(foo).to.be.instanceOf(DB)
  })

  it('生成对应的SQL', function () {
    let db = new DB()
    db.table('foo')
      .select()
    expect(db._sql).to.be.equal('SELECT * FROM foo')
    db.select('*')
    expect(db._sql).to.be.equal('SELECT * FROM foo')
    db.select('title, id')
    expect(db._sql).to.be.equal('SELECT title, id FROM foo')
    db.select(['title', 'id'])
    expect(db._sql).to.be.equal('SELECT title, id FROM foo')
    db.where('id > 1')
    db.select(['title', 'id'])
    expect(db._sql).to.be.equal('SELECT title, id FROM foo WHERE id > 1')
    db.order('id desc')
    db.select(['title', 'id'])
    expect(db._sql).to.be.equal('SELECT title, id FROM foo WHERE id > 1 ORDER BY id desc')
  })
})

describe('dbCore: insert', function () {
  it('如果没有table, 则抛出错误', function () {
    let db = new DB()
    function exec () {
      db.insert()
    }
    expect(exec).to.throw('没设置表名')
  })

  it('传入数据为空时, 则抛出错误', function () {
    let db = new DB()
    function exec () {
      db.table('foo')
        .insert()
    }
    expect(exec).to.be.throw('数据空!')
  })

  it('返回的依然是本身', function () {
    let db = new DB()
    let foo = db.table('foo').insert({})
    expect(foo).to.be.equal(db)
    expect(foo).to.be.instanceOf(DB)
  })

  it('生成对应的SQL', function () {
    let db = new DB()
    db.table('foo')
      .insert({name: 1})
    expect(db._sql).to.be.equal('INSERT INTO foo (name) values ("1")')

    db.insert({name: 1, age: 2})
    expect(db._sql).to.be.equal('INSERT INTO foo (name, age) values ("1", "2")')

    db.insert({name: 1, age: 2}, {name: 3, age: 4})
    expect(db._sql).to.be.equal('INSERT INTO foo (name, age) values ("1", "2"), ("3", "4")')
  })
})

describe('dbCore: update', function () {
  it('如果没有table, 则抛出错误', function () {
    let db = new DB()
    function exec () {
      db.update()
    }
    expect(exec).to.throw('没设置表名')
  })

  it('传入数据为空时, 则抛出错误', function () {
    let db = new DB()
    function exec () {
      db.table('foo')
        .update()
    }
    expect(exec).to.be.throw('数据空!')
  })

  it('返回的依然是本身', function () {
    let db = new DB()
    let foo = db.table('foo').update({})
    expect(foo).to.be.equal(db)
    expect(foo).to.be.instanceOf(DB)
  })

  it('生成对应的SQL', function () {
    let db = new DB()
    db.table('foo')
      .update({name: 1})

    expect(db._sql).to.be.equal('UPDATE foo SET name = "1"')
    db.update({name: 1, age: undefined})
    expect(db._sql).to.be.equal('UPDATE foo SET name = "1", age = default')
    db.update({name: 1, age: 1})
    expect(db._sql).to.be.equal('UPDATE foo SET name = "1", age = "1"')
    db.where('id = 3')
    db.update({name: 1, age: 1})
    expect(db._sql).to.be.equal('UPDATE foo SET name = "1", age = "1" WHERE id = 3')
  })
})

describe('dbCore: delete', function () {
  it('如果没有table, 则抛出错误', function () {
    let db = new DB()
    function exec () {
      db.delete()
    }
    expect(exec).to.throw('没设置表名')
  })

  it('返回的依然是本身', function () {
    let db = new DB()
    let foo = db.table('foo').delete()
    expect(foo).to.be.equal(db)
    expect(foo).to.be.instanceOf(DB)
  })

  it('生成对应的SQL', function () {
    let db = new DB()
    db.table('foo')
      .delete()
    expect(db._sql).to.be.equal('DELETE FROM foo')
    db.where('id = 1')
      .delete()
    expect(db._sql).to.be.equal('DELETE FROM foo WHERE id = 1')
  })
})

describe('实战: CURD', function () {
  let id
  const getWhere = () => `id = ${id}`
  it('添加数据', function (done) {
    async function exec (cb) {
      let db = new DB()
      db.table('blog_articles')
        .insert({
          title: '标题',
          content: '内容'
        })
      let {result} = await db.exec()
      id = result.insertId
      expect(result.affectedRows).to.be.equal(1)
      done()
    }
    exec()
  })

  it('查询数据', function (done) {
    async function exec (cb) {
      let db = new DB()
      db.table('blog_articles')
        .where(getWhere())
        .select()
      let {result: [data]} = await db.exec()
      expect(data.id).to.be.equal(id)
      expect(data.title).to.be.equal('标题')
      expect(data.content).to.be.equal('内容')
      done()
    }
    exec()
  })

  it('修改数据', function (done) {
    async function exec (cb) {
      let db = new DB()
      db.table('blog_articles')
        .where(getWhere())
        .update({
          title: '修改后的标题',
          content: '修改后的内容'
        })
      let {result} = await db.exec()
      expect(result.affectedRows).to.be.equal(1)
      expect(result.changedRows).to.be.equal(1)
      done()
    }
    exec()
  })

  it('查询修改后的数据数据', function (done) {
    async function exec (cb) {
      let db = new DB()
      db.table('blog_articles')
        .where(getWhere())
        .select()
      let {result: [data]} = await db.exec()
      expect(data.id).to.be.equal(id)
      expect(data.title).to.be.equal('修改后的标题')
      expect(data.content).to.be.equal('修改后的内容')
      done()
    }
    exec()
  })

  it('删除数据', function (done) {
    async function exec (cb) {
      let db = new DB()
      db.table('blog_articles')
        .where(getWhere())
        .delete()
      let {result} = await db.exec()
      expect(result.affectedRows).to.be.equal(1)
      done()
    }
    exec()
  })

  it('查询删除后的数据数据', function (done) {
    async function exec (cb) {
      let db = new DB()
      db.table('blog_articles')
        .where(getWhere())
        .select()
      let {result} = await db.exec()
      expect(result.length).to.be.equal(0)
      done()
    }
    exec()
  })
})
