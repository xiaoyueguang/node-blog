// 8种方法
const methods = [
  'GET',
  'POST',
  'OPTIONS',
  'HEAD',
  'PUT',
  'DELETE',
  'TRACE',
  'CONNECT'
]

module.exports = exports = router
exports.methods = methods
/**
 * 抓取参数路径
 * @param {string} url 请求的url路径
 * @return {string}
 */
const matchParamsPath = exports.matchParamsPath = url => {
  const index = getQuesIndex(url)
  if (index === -1) return removeLastSlash(url)
  return removeLastSlash(url.substr(0, getQuesIndex(url)))
}
/**
 * 移除路径中最后的 `/` 符号.
 * 这表明 `/foo/bar`与`/foo/bar/` 是指向同一个路径
 * @param {string} str 字符串
 * @return {string}
 */
const removeLastSlash = exports.removeLastSlash = str => str === '/' ? str : str.replace(/\/$/, '')
/**
 * 获取路径中问号的序号
 * @param {string} url
 * @return {string}
 */
const getQuesIndex = exports.getQuesIndex = url => url.indexOf('?')

function router (request, response, context) {
  /**
   * 给路径指定控制器方法
   * @param {string} path 路径
   * @param {methods} controller 控制器方法
   */
  const define = (path, controller) => {
    const params = matchParams(path, matchParamsPath(request.url))
    if (params) {
      // 将抓取到的参数对象传入上下文
      context.params = params
      controller(request, response, context)
    }
  }

  const METHODS = {}
  methods.forEach(key => {
    METHODS[key.toLowerCase()] = (path, controller) => {
      request.method === key && define(path, controller)
    }
  })
  return Object.assign({}, METHODS, {any: define})
}
/**
 * 抓取参数路径中对应的参数. 如果没有则返回false
 * @param {string} reg 匹配的路径
 * @param {string} params 待匹配的路径
 * @return {object|boolean} 是否匹配成功
 */
function matchParams (reg, params) {
  let regArr = reg.split('/')
  let paramsArr = params.split('/')
  // 长度不一致, 一定不匹配
  if (regArr.length !== paramsArr.length) return false

  const paramsObj = {}
  let i = 0
  while (i < regArr.length) {
    const matchParam = regArr[i]
    // 参数前面为:
    if (matchParam[0] === ':') {
      paramsObj[matchParam.substr(1)] = paramsArr[i]
    } else {
      // 不匹配返回false
      if (matchParam !== paramsArr[i]) return false
    }
    i++
  }

  return paramsObj
}
exports.matchParams = matchParams
