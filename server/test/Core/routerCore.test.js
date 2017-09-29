const {expect} = require('chai')
const routerCore = require('../../Core/routerCore')
// const axios = require('axios')

describe('routerCore', () => {
  it('getQuesIndex: 当url中没有?时, 返回-1', function () {
    expect(routerCore.getQuesIndex('/foo'))
      .to.be.equal(-1)
  })
  it('getQuestIndex: 当url中有?时, 返回正确的序号', function () {
    expect(routerCore.getQuesIndex('/foo?'))
      .to.be.equal(4)
    expect(routerCore.getQuesIndex('/?'))
      .to.be.equal(1)
    expect(routerCore.getQuesIndex('/foo/bar/?'))
      .to.be.equal(9)
  })

  it('removeLastSlash: 当url最后为/时, 去掉他', function () {
    expect(routerCore.removeLastSlash('/'))
      .to.be.equal('/')
    expect(routerCore.removeLastSlash('/foo/'))
      .to.be.equal('/foo')
    expect(routerCore.removeLastSlash('/foo/bar/'))
      .to.be.equal('/foo/bar')
  })
  it('removeLastSlash: 当url最后不为/时, 不处理', function () {
    expect(routerCore.removeLastSlash('/foo'))
      .to.be.equal('/foo')
    expect(routerCore.removeLastSlash('/foo/bar'))
      .to.be.equal('/foo/bar')
  })

  it('matchParamsPath: 从url中抓去出params路径', function () {
    expect(routerCore.matchParamsPath('/foo'))
      .to.be.equal('/foo')
    expect(routerCore.matchParamsPath('/foo/bar'))
      .to.be.equal('/foo/bar')

    expect(routerCore.matchParamsPath('/foo/bar/'))
      .to.be.equal('/foo/bar')

    expect(routerCore.matchParamsPath('/foo?v=1'))
      .to.be.equal('/foo')
    expect(routerCore.matchParamsPath('/foo/bar/?v=1'))
      .to.be.equal('/foo/bar')
  })

  it('matchParams: 根据给定的模式, 抓取对应的路径', function () {
    expect(routerCore.matchParams('/foo/:id', '/foo'))
      .to.be.equal(false)
    expect(routerCore.matchParams('/foo/:id', '/foo/bar/1'))
      .to.be.equal(false)
    expect(routerCore.matchParams('/foo/:id/bar', '/foo/bar/1'))
      .to.be.equal(false)

    const foo = routerCore.matchParams('/foo/:id', '/foo/1')
    expect(foo).to.be.an('object')
    expect(foo.id).to.be.equal('1')

    const bar = routerCore.matchParams('/foo/:user/bar', '/foo/1/bar')
    expect(bar).to.be.an('object')
    expect(bar.user).to.be.equal('1')
  })

  it('ff', function () {
    require('../../index.js')

  })
})
