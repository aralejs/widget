# Widget 

---------

[![spm package](http://spmjs.io/badge/arale-widget)](http://spmjs.io/package/arale-widget)
[![Build Status](https://travis-ci.org/aralejs/widget.png?branch=master)](https://travis-ci.org/aralejs/widget) [![Coverage Status](https://coveralls.io/repos/aralejs/widget/badge.png?branch=master)](https://coveralls.io/r/aralejs/widget?branch=master)

Widget 是 UI 组件的基础类，约定了组件的基本生命周期，实现了一些通用功能。基于 Widget
可以构建出任何你想要的 Web 界面组件。

----------

## 使用说明

Widget 继承了 [base](http://aralejs.org/base/)，可使用其中包括 [class](http://aralejs.org/class/)、[events](http://aralejs.org/events/)、[attribute](http://aralejs.org/base/docs/attribute.html)、[aspect](http://aralejs.org/base/docs/aspect.html) 等功能。

### 简单的继承

```js
var WidgetA = Widget.extend({
  attrs: {
    a: 1
  },

  method: function() {
    console.log(this.get('a'));
  }
});

var widget = new WidgetA({
  a: 2
}).render();
widget.method(); // => 2
```

### 生命周期

Widget 有一套完整的生命周期，控制着组件从创建到销毁的整个过程。主要有 `initialize`，`render`，`destroy` 三个过程。

#### Initialize

Widget 在实例化的时候会做一系列操作：

```js
.initAttrs() // 初始化属性，将实例化时的数据和默认属性做混合
.parseElement() // 模板解析
.initProps() // 提供给用户处理属性
.delegateEvents() // 事件代理，将事件代理到 `this.element` 上
.setup() // 实例化最后一步，用户自定义操作，提供给子类继承。
```

具体方法的使用可查看 API 文档。

#### Render

将 `this.element` 插入到文档流，默认插入到 document.body，可以通过 parentNode 指定。

Render 这一步操作从 Initialize 中独立出来，因为有些组件在实例化的时候不希望操作 DOM，如果希望实例化的时候处理可在 setup 里调用 `this.render()`。

#### Destroy

组件销毁。将 widget 生成的 element 和事件都销毁。

### 和 Attribute 的关系

Widget 使用了 Attribute，支持 getter/setter，但 Widget 做了一层扩展。

```js
var WidgetB = Widget.extend({
  attrs: {
    a: 1
  },

  _onRenderA: function(val) {
    console.log(val)
  }
});

var widget = new WidgetB();
widget.render(); // => 1
widget.set('a', 2); // => 2
```

提供了 `_onRender` + 属性名(首字母大写)的特性，在两种情况会触发

1. 在属性改变的时候

2. 在调用 render 方法的时候(插入文档流之前)，但当属性值为 `null` 或 `undefined` 时则不会触发。

### 模板渲染

每个 Widget 只会对应一个 element，会对他的 DOM 及事件进行操作。

element 的生成有两种情况

1. 实例化的时候传入
2. 由 template 生成

Widget 默认处理模板的方式是直接转换成 jQuery 对象，但不能处理数据。涉及到复杂的模板可以覆盖 `parseElementFromTemplate` 方法，可以继承覆盖也可以混入（比如 [templatable](http://aralejs.org/templatable/)）。

### 事件代理

事件代理是 Widget 非常好用的特性，将所有的事件都代理到 `this.element` 上。这样可以使得对应的
DOM 内容有修改时，无需重新绑定，在 destroy 的时候也会销毁这些事件。

`widget.delegateEvents()` 会在实例初始化时自动调用，这时会从 `this.events` 中取得声明的代理事件，比如

```js
var MyWidget = Widget.extend({
    events: {
        "dblclick": "open",
        "click .icon.doc": "select",
        "mouseover .date": "showTooltip"
    },
    open: function() {
        ...
    },
    select: function() {
        ...
    },
    ...
});
```

`events` 中每一项的格式是：`"event selector": "callback"`，当省略 `selector`
时，默认会将事件绑定到 `this.element` 上。`callback` 可以是字符串，表示当前实例上的方法名；
也可以直接传入函数。

`events` 还可以是方法，返回一个 events hash 对象即可。比如

```js
var MyWidget = Widget.extend({
    events: function() {
        var hash = {
            "click": "open",
            "click .close": "close"
        };

        return hash;
    },
    ...
});
```

`events` 中，还支持 `{{name}}` 表达式，比如上面的代码，可以简化为：

```js
var MyWidget = Widget.extend({
    events: {
        "click": "open",
        "click .close": "close",
        "mouseover {{attrs.panels}}": "hover"
    },
    ...
});
```
