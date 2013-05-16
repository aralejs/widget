# Widget 

---------

[![Build Status](https://travis-ci.org/aralejs/widget.png?branch=master)](https://travis-ci.org/aralejs/widget) [![Coverage Status](https://coveralls.io/repos/aralejs/widget/badge.png?branch=master)](https://coveralls.io/r/aralejs/widget?branch=1.1.0-dev)

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

2. 在调用 render 方法的时候，但当属性值为 `null` 或 `undefined` 时则不会触发。

### 模板渲染

### 事件代理



