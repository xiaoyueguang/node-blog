const {expect} = require('chai')
const staticCore = require('../../Core/staticCore')

describe('staticCore: 助手方法', function () {
  const getSuffix = staticCore.getSuffix
  const getType = staticCore.getType

  it('getSuffix: 获取后缀', function () {
    expect(getSuffix('foo.jpg')).to.be.equal('jpg')
    expect(getSuffix('foo.png')).to.be.equal('png')
  })

  it('getType: 获取对应的内容', function () {
    expect(getType('html')).to.be.equal('text/html')
    expect(getType('css')).to.be.equal('text/css')
    expect(getType('js')).to.be.equal('application/x-javascript')
    expect(getType('gif')).to.be.equal('image/gif')
    expect(getType('jpg')).to.be.equal('image/jpeg')
    expect(getType('jpeg')).to.be.equal('image/jpeg')
    expect(getType('png')).to.be.equal('image/png')
  })
})
