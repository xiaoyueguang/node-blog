const pug = require('pug')
const {VIEW_PATH} = require('../conf')

module.exports = exports = async (request, response, context) => {
  context.header['Content-Type'] = 'text/html'
  context.view = exports.view
}
/**
 * 模板引擎
 * @param {string} template 模板路径
 * @param {object} dataSource 数据源
 * @return {string} 返回编译后的html
 */
exports.view = (template, dataSource = {}) => {
  const compiler = pug.compileFile(`./${VIEW_PATH}/${template}.pug`)
  return compiler(dataSource)
}
