var DAParser = require('../src/daparser')
var expect = require('expect.js')
var $ = require('jquery')
  
var body = document.body


describe('DAParser', function() {

  it('single data-xx', function() {
    var div = $('<div data-key="value"></div>').appendTo(body)
    var dataset = DAParser.parseElement(div)

    expect(dataset.key).to.equal('value')

    div.remove()
  })

  it('multi data-xx', function() {
    var div = $('<div data-key="value" data-key2="val2"></div>').appendTo(body)
    var dataset = DAParser.parseElement(div)

    expect(dataset['key']).to.equal('value')
    expect(dataset['key2']).to.equal('val2')

    div.remove()
  })

  it('convert dash-name to camelCasedName', function() {
    var div = $('<div data-x-y-123a-_B="val" data-x-y="val" data-AbcD-x="val"></div>').appendTo(body)
    var dataset = DAParser.parseElement(div)

    //console.dir(div[0].dataset)
    //console.dir(dataset)

    //expect(dataset['xY-123a-_b']).to.equal('val')
    // chrome 和 firefox 的处理不同，悲催的兼容性，苦逼的前端呀。
    // 在 chrome 下:
    //expect(dataset['xY-123a-_b']).to.equal(undefined)
    // 在 firefox 下：
    //expect(dataset['xY-123a-_b']).to.equal(val)


    expect(dataset['xY']).to.equal('val')
    expect(dataset['abcdX']).to.equal('val')

    div.remove()
  })

  it('table element', function() {
    var table = $('<table><tr><td data-x="1"></td></tr></table>').appendTo(body)
    var dataset = DAParser.parseElement(table.find('td')[0])

    expect(dataset['x']).to.equal(1)
    table.remove()
  })

  it('object', function() {
    var div = $('<div data-object="{\'a\':\'a\', \'b\':1}"></div>').appendTo(body)
    var dataset = DAParser.parseElement(div)

    expect(dataset['object']).to.eql({a:'a', b: 1})
    div.remove()
  })

})
