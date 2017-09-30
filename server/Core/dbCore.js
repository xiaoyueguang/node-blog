const mysql = require('mysql')
const {HOST, USER, PASSWORD, PORT, DATABASE} = require('../conf')

class DB {
  constructor () {
    this._table = ''
    this._where = ''
    this._order = ''
    this._sql = ''
  }
  /**
   * 设置表
   * @param {string} table 表名
   * @return {DB}
   */
  table (table) {
    if (!table) return this
    this._table = table
    return this
  }
  /**
   * 设置 条件
   * @param {string} where 条件
   * @param {string} relation 关系
   * @return {DB}
   */
  where (where, relation = 'and') {
    if (this._where === '') {
      this._where = where
      return this
    }
    if (relation.toLowerCase() === 'and') {
      this._where += ` AND ${where}`
    } else {
      this._where += ` OR ${where}`
    }
    return this
  }
  /**
   * 设置 排序
   * @param {string} order 排序方式
   * @return {DB}
   */
  order (order) {
    if (this._order === '') {
      this._order = order
    } else {
      this._order += `, ${order}`
    }
    return this
  }
  /**
   * 生成ORDER语句
   * @return {string}
   */
  generationOrder () {
    if (this._order === '') return ''
    return ' ORDER BY ' + this._order
  }
  /**
   * 生成WHERE语句
   * @return {string}
   */
  generationWhere () {
    if (this._where === '') return ''
    return ' WHERE ' + this._where
  }
  /**
   * 生成插入语句
   * @param {object} data 插入的数据
   * @return {DB}
   */
  insert () {
    checkTable(this._table)
    const items = [...arguments]
    if (items.length === 0) throw new Error('数据空!')
    const key = Object.keys(items[0])
    const keyString = generationValues(key)

    const values = []
    items.forEach(item => {
      values.push(generationValues(Object.values(item).map(wrapValue)))
    })

    this._sql = `INSERT INTO ${this._table} ${keyString} values ${values.join(', ')}`
  }
  /**
   * 生成查询语句
   * @param {string|undefined|array} fields 查询字段
   * @return {DB}
   */
  select (fields) {
    checkTable(this._table)
    let fieldsString = ''
    if (fields === undefined) {
      fieldsString = '*'
    } else {
      if (typeof fields === 'string') {
        fieldsString = fields
      } else {
        fieldsString = fields.join(', ')
      }
    }

    this._sql = `SELECT ${fieldsString} FROM ${this._table}${this.generationWhere()}${this.generationOrder()}`
    return this
  }
  /**
   * 生成更新语句
   * @param {object} data 保存的数据
   * @return {DB}
   */
  update (data) {
    checkTable(this._table)
    if (!data) throw new Error('数据空!')
    const keyValues = []
    for (let key in data) {
      const value = data[key]
      keyValues.push(`${key} = ${value ? wrapValue(value) : 'default'}`)
    }
    this._sql = `UPDATE ${this._table} SET ${keyValues.join(', ')}${this.generationWhere()}`
    return this
  }
  /**
   * 删除表中数据
   */
  delete () {
    checkTable(this._table)
    this._sql = `DELETE FROM ${this._table}${this.generationWhere()}`
  }
  /**
   * 执行
   * @param {string} sql
   * @return {Promise<object>}
   */
  exec (sql) {
    if (sql) this._sql = sql
    return new Promise((resolve, reject) => {
      const connection = mysql.createConnection({
        host: HOST,
        user: USER,
        password: PASSWORD,
        database: DATABASE,
        port: PORT
      })
      connection.connect()
      connection.query(this._sql, function (error, result, fields) {
        if (error) reject(error)
        resolve({result, fields})
      })
      connection.end()
    })
  }

  sum (field) {}
  avg (field) {}
  max (field) {}
  min (field) {}
}

/**
 * 数据库中间件
 * @param {request} request
 * @param {response} response
 * @param {context} context
 * @return
 */
async function DBMiddle (request, response, context) {
  context.DB = DB
}
/**
 * 从数组转化为插入所需要的值
 * @param {array} items 待转化的数组
 * @return {string}
 */
function generationValues (items) {
  return `(${items.join(', ')})`
}
/**
 * 检查
 * @param {string} table 表名
 * @return {void}
 */
function checkTable (table) {
  if (table === '') throw new Error('没设置表名')
}
/**
 * 给值添加 "" 包裹
 * @param {string} val
 * @return {string}
 */
function wrapValue (val) {
  return '"' + val + '"'
}

module.exports = exports = DBMiddle
exports.DB = DB
exports.generationValues = generationValues
exports.checkTable = checkTable
exports.wrapValue = wrapValue
