const {expect} = require('chai')

const {add, port, remove, text} = require('../helper')
const axios = require('axios')

describe('serverCore', function () {
  it('开启服务器', function (done) {
    const fn = (request, response, context) => {
      context.body = text
    }
    add(fn)
    axios.get(`http://localhost:${port}`)
      .then(({data}) => {
        expect(text).to.be.equal(data)
        remove(fn)
        done()
      })
  })
})
