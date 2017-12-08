const {expect} = require('chai')
const router = require('../../Core/routerCore')
const {add, remove, text, baseURL} = require('../helper')
const axios = require('axios')

describe('routerCore: 助手方法', () => {
  it('getQuesIndex: 当url中没有?时, 返回-1', function () {
    expect(router.getQuesIndex('/foo'))
      .to.be.equal(-1)
  })
  it('getQuestIndex: 当url中有?时, 返回正确的序号', function () {
    expect(router.getQuesIndex('/foo?'))
      .to.be.equal(4)
    expect(router.getQuesIndex('/?'))
      .to.be.equal(1)
    expect(router.getQuesIndex('/foo/bar/?'))
      .to.be.equal(9)
  })

  it('removeLastSlash: 当url最后为/时, 去掉他', function () {
    expect(router.removeLastSlash('/'))
      .to.be.equal('/')
    expect(router.removeLastSlash('/foo/'))
      .to.be.equal('/foo')
    expect(router.removeLastSlash('/foo/bar/'))
      .to.be.equal('/foo/bar')
  })
  it('removeLastSlash: 当url最后不为/时, 不处理', function () {
    expect(router.removeLastSlash('/foo'))
      .to.be.equal('/foo')
    expect(router.removeLastSlash('/foo/bar'))
      .to.be.equal('/foo/bar')
  })

  it('matchParamsPath: 从url中抓去出params路径', function () {
    expect(router.matchParamsPath('/foo'))
      .to.be.equal('/foo')
    expect(router.matchParamsPath('/foo/bar'))
      .to.be.equal('/foo/bar')

    expect(router.matchParamsPath('/foo/bar/'))
      .to.be.equal('/foo/bar')

    expect(router.matchParamsPath('/foo?v=1'))
      .to.be.equal('/foo')
    expect(router.matchParamsPath('/foo/bar/?v=1'))
      .to.be.equal('/foo/bar')
  })

  it('matchParams: 根据给定的模式, 抓取对应的路径', function () {
    expect(router.matchParams('/foo/:id', '/foo'))
      .to.be.equal(false)
    expect(router.matchParams('/foo/:id', '/foo/bar/1'))
      .to.be.equal(false)
    expect(router.matchParams('/foo/:id/bar', '/foo/bar/1'))
      .to.be.equal(false)

    const foo = router.matchParams('/foo/:id', '/foo/1')
    expect(foo).to.be.an('object')
    expect(foo.id).to.be.equal('1')

    const bar = router.matchParams('/foo/:user/bar', '/foo/1/bar')
    expect(bar).to.be.an('object')
    expect(bar.user).to.be.equal('1')
  })
})

describe('routerCore: 业务方法', function () {
  this.timeout(100000)
  it('any: 能匹配所有方法', function (done) {
    ajaxHelp('any', done)
  })

  it('get: 只有get 能获取', function (done) {
    ajaxHelp('get', done)
  })

  it('post: 只有post 能获取', function (done) {
    ajaxHelp('post', done)
  })

  it('options: 只有options 能获取', function (done) {
    ajaxHelp('options', done)
  })

  it('head: 只有head 能获取', function (done) {
    ajaxHelp('head', done)
  })

  it('put: 只有put 能获取', function (done) {
    ajaxHelp('put', done)
  })

  it('delete: 只有delete 能获取', function (done) {
    ajaxHelp('delete', done)
  })
})

async function ajaxHelp (method, done) {
  const fn = context => {
    const Router = router(context)

    Router[method]('/foo', context => {
      context.body = text
    })
  }
  add(fn)

  let url = baseURL + '/foo'
  let [
    {data: getData},
    {data: postData},
    {data: optionsData},
    {data: headData},
    {data: putData},
    {data: deleteData}
  ] = await Promise.all([
    axios.get(url),
    axios.post(url),
    axios.options(url),
    axios.head(url),
    axios.put(url),
    axios.delete(url)
  ])
  expect(getData).to.be.equal(getText('get'))
  expect(postData).to.be.equal(getText('post'))
  expect(optionsData).to.be.equal(getText('options'))
  // 方法为head时, 获取响应消息报头, 响应主体为空
  expect(headData).to.be.equal('')
  expect(putData).to.be.equal(getText('put'))
  expect(deleteData).to.be.equal(getText('delete'))

  remove(fn)
  done()

  function getText (type) {
    if (method === 'any') return text
    return type === method ? text : ''
  }
}
