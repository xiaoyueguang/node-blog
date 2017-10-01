const {expect} = require('chai')
const templateCore = require('../../Core/templateCore')
const view = templateCore.view
const {add, remove, baseURL} = require('../helper')
const axios = require('axios')

describe('templateCore: 模板编译', function () {
  it('数据源为空', function () {
    expect(view('test/index'))
      .to.be.equal('<h1>Hello World!</h1>')
  })

  it('数据源不为空', function () {
    expect(view('test/dataSource', {name: 'World'}))
      .to.be.equal('<h1>Hello World!</h1>')
  })
})

describe('templateCore: 测试', function () {
  this.timeout(50000)
  it('数据源为空时', function (done) {
    const fn = async (request, response, context) => {
      await templateCore(request, response, context)
      context.body = context.view('test/index')
    }
    add(fn)
    axios.get(baseURL + '/')
      .then(({data}) => {
        expect(data).to.be.equal('<h1>Hello World!</h1>')
        remove(fn)
        done()
      })
  })

  it('数据源不为空', function (done) {
    const fn = async (request, response, context) => {
      await templateCore(request, response, context)
      context.body = context.view('test/index', {name: 'World'})
    }
    add(fn)
    axios.get(baseURL + '/')
      .then(({data}) => {
        expect(data).to.be.equal(`<h1>Hello World!</h1>`)
        remove(fn)
        done()
      })
  })
})
