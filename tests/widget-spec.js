define(function(require) {

  var expect = require('expect')
  var Widget = require('../src/widget')
  var DAParser = require('../src/daparser')
  var $ = require('$')


  describe('Widget', function() {

    it('initAttrs', function() {
      var div = $('<div id="a"></div>').appendTo(document.body)

      var WidgetA = Widget.extend({
        attrs: {
          element: '#default',
          foo: 'foo',
          template: '<span></span>'
        },
        model: {
          title: 'default title',
          content: 'default content'
        }
      })

      var a = new WidgetA({
        element: '#a',
        bar: 'bar',
        template: '<a></a>',
        model: {
          title: 'title a'
        }
      })

      // 传入的
      expect(a.get('bar')).to.equal('bar')

      // 继承的
      expect(a.get('foo')).to.equal('foo')

      // 覆盖的
      expect(a.get('template')).to.equal('<a></a>')

      // 混入的
      expect(a.model.title).to.equal('title a')
      expect(a.model.content).to.equal('default content')

      // attr 式属性
      expect(a.element[0].id).to.equal('a')

      div.remove()
    })

    it('parseElement', function() {
      var div = $('<div id="a"></div>').appendTo(document.body)

      // 如果 config 里不传 element，默认用 $('<div></div>') 构建
      var widget = new Widget()
      expect(widget.element[0].tagName).to.equal('DIV')

      // 如果传入 selector，会自动转为为 $ 对象
      widget = new Widget({ element: '#a' })
      expect(widget.element[0].id).to.equal('a')

      // 如果传入 DOM 对象，会自动转换为 $ 对象
      widget = new Widget({ element: document.getElementById('a') })
      expect(widget.element[0].id).to.equal('a')

      // 如果传入 $ 对象，保持不变
      widget = new Widget({ element: $('#a') })
      expect(widget.element[0].id).to.equal('a')

      // 如果传入的 dom 对象不存在，则报错
      try {
        new Widget({ element: '#b' })
        expect('应该抛错').to.equal('没有抛错')
      } catch (e) {
      }

      // 同时传入 template 和 element 时，element 优先
      widget = new Widget({ element: '#a', template: '<span></span>' })
      expect(widget.element[0].tagName).to.equal('DIV')

      // 只传入 template 时，从 template 构建
      widget = new Widget({ template: '<span></span>' })
      expect(widget.element[0].tagName).to.equal('SPAN')

      div.remove()
    })

    it('parse data attrs', function() {

      // 默认解析 data-api
      var widget = new Widget()

      // 可通过选项关闭 data-api
      document.body.setAttribute('data-api', 'off')

      var dataset = DAParser.parseElement(widget.element)
      delete dataset['widgetCid']

      expect(dataset).to.eql({})
    })

    it('delegateEvents / undelegateEvents', function() {
      var counter = 0
      var event = {}, that = {}

      // 通过 events 注册事件代理
      var TestWidget = Widget.extend({
        events: {
          'click p': 'fn1',
          'click li': 'fn2',
          'mouseenter span': 'fn3'
        },

        fn1: function() {
          counter++
        },

        fn2: function() {
          counter++
        },

        fn3: function(ev) {
          event = ev
          that = this
        }
      })

      var widget = new TestWidget({
        template: '<div><p></p><ul><li></li></ul><span></span></div>'
      }).render()

      widget.$('p').trigger('click')
      expect(counter).to.equal(1)

      counter = 0
      widget.$('li').trigger('click')
      expect(counter).to.equal(1)

      counter = 0
      widget.element.trigger('click')
      expect(counter).to.equal(0)

      counter = 0
      widget.$('span').trigger('mouseenter')
      expect(event.currentTarget.tagName).to.equal('SPAN')
      expect(that).to.equal(widget)


      // 通过实例添加事件
      widget.delegateEvents({
        'click p': 'fn2',
        'click span': function() {
          counter++
        }
      })

      function incr() {
        counter++
      }

      widget.delegateEvents('click li', incr)

      counter = 0
      widget.$('li').trigger('click')
      expect(counter).to.equal(2)

      counter = 0
      widget.$('p').trigger('click')
      expect(counter).to.equal(2)

      counter = 0
      widget.$('span').trigger('click')
      expect(counter).to.equal(1)


      // 注销事件
      /* 不支持第二个参数
       counter = 0
       widget.undelegateEvents('click p', 'fn2')
       widget.$('p').trigger('click')
       expect(counter).to.equal(1)

       counter = 0
       widget.undelegateEvents('click li', incr)
       widget.$('li').trigger('click')
       expect(counter).to.equal(1)
       */

      counter = 0
      widget.undelegateEvents('click p')
      widget.$('p').trigger('click')
      expect(counter).to.equal(0)

      counter = 0
      widget.undelegateEvents()
      widget.$('li').trigger('click')
      widget.$('p').trigger('click')
      expect(counter).to.equal(0)
    })

    it('events hash can be a function', function() {
      var counter = 0

      var TestWidget = Widget.extend({

        events: function() {
          return {
            'click h3': 'incr',
            'click p': 'incr'
          }
        },

        incr: function() {
          counter++
        }
      })

      var widget = new TestWidget({
        template: '<div><h3></h3><p></p></div>'
      }).render()

      widget.$('h3').trigger('click')
      expect(counter).to.equal(1)

      counter = 0
      widget.$('p').trigger('click')
      expect(counter).to.equal(1)
    })

    it('the default event target is `this.element`', function() {
      var counter = 0

      var TestWidget = Widget.extend({

        events: function() {
          return {
            'click': 'incr'
          }
        },

        incr: function() {
          counter++
        }
      })

      var widget = new TestWidget().render()
      widget.element.trigger('click')
      expect(counter).to.equal(1)
    })

    it('parentNode is a document fragment', function() {
      var id = 'test' + new Date()
      var divs = $('<div id="' + id + '"></div><div></div>')

      new Widget({
        element: divs.eq(0),
        parentNode: document.body
      }).render()

      expect(document.getElementById(id).nodeType).to.equal(1)
    })

    it('template in delegate-events', function() {
      var counter = 0

      var A = Widget.extend({

        attrs: {
          buttons: 'button'
        },

        events: {
          'click p': 'incr',
          'click {{attrs.buttons}}': 'incr'
        },

        incr: function() {
          counter++
        }
      })

      var a = new A({
        template: '<div><header>x</header><button>x</button><p>x</p><div id="ttt"></div></div>'
      }).render()

      a.$('p').trigger('click')
      expect(counter).to.equal(1)

      counter = 0
      $(a.get('buttons')).trigger('click')
      expect(counter).to.equal(1)
    })

    it('delegate events inherited from ancestors', function() {
      var counter = 0

      function incr() {
        counter++
      }

      var A = Widget.extend({
        events: {
          'click p': incr
        }
      })

      var B = A.extend({
        events: {
          'click div': incr
        }
      })

      var object = new B({
        template: '<section><p></p><div></div><span></span></section>',
        events: {
          'click span': incr
        }
      }).render()

      counter = 0
      object.$('p').trigger('click')
      expect(counter).to.equal(1)

      counter = 0
      object.$('div').trigger('click')
      expect(counter).to.equal(1)

      counter = 0
      object.$('span').trigger('click')
      expect(counter).to.equal(1)
    })

    it('ignore null element during delegating events', function() {
      var counter = 0

      function incr() {
        counter++
      }

      var A = Widget.extend({
        attrs: {
          cancelButton: null
        },

        events: {
          'click {{attrs.cancelButton}}': 'incr'
        }
      })

      new A()
      // no error occurs
    })

    it('#76: set default attrs automatically', function() {

      var A = Widget.extend({
        attrs: {
          a: 1,
          b: 1
        },

        _onRenderA: function(val) {
          this.a = val
        }
      })

      var a = new A({ b: 2 })
      expect(a.get('a')).to.equal(1)
      expect(a.get('b')).to.equal(2)
      expect(a.a).to.equal(undefined)

      a.render()
      expect(a.a).to.equal(1)
    })

    it('set attribute before render method', function() {
      var r = [], p = []

      var A = Widget.extend({
        attrs: {
          a: 1
        },

        _onRenderA: function(val, prev) {
          r.push(val)
          p.push(prev)
        }
      })

      var a = new A({ a: 2 })
      a.set('a', 3)
      a.render()

      expect(r.join()).to.equal('3')
      expect(p.join()).to.equal('')
    })

    it('default values in attrs', function() {
      var counter = 0

      function incr() {
        counter++
      }

      var A = Widget.extend({
        attrs: {
          bool: false,
          str: '',
          str2: 'x',
          obj: {},
          arr: [],
          fn: null,
          obj2: null,
          fn2: undefined,
          fn3: function() {
          }
        },

        _onRenderBool: incr,
        _onRenderStr: incr,
        _onRenderStr2: incr,
        _onRenderObj: incr,
        _onRenderObj2: incr,
        _onRenderArr: incr,
        _onRenderFn: incr,
        _onRenderFn2: incr,
        _onRenderFn3: incr
      })

      var a = new A()
      expect(counter).to.equal(0)

      // 只有 bool / str2 / fn3 的改变会触发事件
      a.render()
      expect(counter).to.equal(3)

      // 测试 onXxx
      counter = 0
      var b = new A({
        str2: ''
      })

      // 未调用 render() 之前都未执行
      expect(counter).to.equal(0)

      b.render()
      expect(counter).to.equal(2); //  bool 和 fn3 属性的改变有效
    })

    it('call render() after first render', function() {
      var counter = 0

      function incr() {
        counter++
      }

      var A = Widget.extend({
        attrs: {
          a: 1
        },

        _onRenderA: incr
      })

      var a = new A()
      a.render()
      expect(counter).to.equal(1)

      a.render()
      expect(counter).to.equal(1)
    })

    it('statics white list', function() {

      var A = Widget.extend()

      expect(typeof A.autoRender).to.equal('function')
      expect(typeof A.autoRenderAll).to.equal('undefined')
    })

    it('data attr api', function() {
      var div = $('<div id="data-attr-api-test" data-a=1 data-b="b" data-arr="[1,2,3]" data-c="true" data-d=\'{"num": 1, "str": "s", "bool": true}\'></div>')
          .appendTo(document.body)

      var t = new Widget({ element: '#data-attr-api-test', b: 'b2' })

      expect(t.get('a')).to.equal(1)
      expect(t.get('b')).to.equal('b2')
      expect(t.get('c')).to.equal(true)
      expect(t.get('d').num).to.equal(1)
      expect(t.get('d').str).to.equal('s')
      expect(t.get('d').bool).to.equal(true)
      expect(t.get('arr')).to.eql([1, 2, 3])
    })

    it('onXx setter in attrs', function() {
      var counter = 0

      function incr() {
        counter++
      }

      var helpers = { 'a': incr }

      var TestWidget = Widget.extend({

        attrs: {
          onXx: function() {
            counter++
          },
          onYy: {
            setter: function(val) {
              return helpers[val]
            }
          }
        },

        test: function() {
          this.trigger('xx')
          this.trigger('yy')
        }
      })

      var t = new TestWidget({ onYy: 'a' })
      t.test()

      expect(counter).to.equal(2)
    })

    it('inherited attrs', function() {

      var A = Widget.extend({
        attrs: {
          a: '',
          b: null
        }
      })

      var B = A.extend({
        attrs: {
          a: '1'
        }
      })

      var C = B.extend({
        attrs: {
          a: '2',
          b: 'b'
        }
      })

      var c = new C()

      expect(c.get('a')).to.equal('2')
      expect(c.get('b')).to.equal('b')
    })

    it('#3: parentNode is a jQuery object', function() {

      $('<div id="test1"></div>').appendTo('body');

      var w = new Widget({ parentNode: $('#test1') })
      w.render()

      expect($('#test1 div').html()).to.equal('')
      $('#test1').remove();
    })

    it('override object in prototype', function() {

      var B = Widget.extend({
        o: { p1: '1' }
      })

      var C = B.extend({
        o: { p2: '2' }
      })

      var c = new C()
      expect(c.o.p1).to.equal(undefined)
      expect(c.o.p2).to.equal('2')
    })

    it('mix events object in prototype', function() {

      var B = Widget.extend({
        events: { p1: '1' }
      })

      var C = B.extend({
        events: { p2: '2' }
      })

      var c = new C()
      expect(c.events.p1).to.equal('1')
      expect(c.events.p2).to.equal('2')
    })

  })


  // Helpers
  // -------

  var keys = Object.keys

  if (!keys) {
    keys = function(o) {
      var result = []

      for (var name in o) {
        if (o.hasOwnProperty(name)) {
          result.push(name)
        }
      }
      return result
    }
  }

});
