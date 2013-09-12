# DATA-API

- order: 3

---

Widget 支持自动渲染，可以根据 DOM 上的 data-api 渲染相应的组件。

[示例](http://aralejs.org/widget/examples/auto-render.html)


## API

### autoRenderAll `Widget.autoRenderAll([root], [callback])`

根据 data-widget 属性，自动渲染找到的所有 Widget 类组件。

### query `Widget.query(selector)`

查询与 selector 匹配的第一个 DOM 节点，得到与该 DOM 节点相关联的 Widget 实例。

## 配置

### data-widget

指定 widget 名称，可使用 alias 的别名。

```
<div data-widget="xbox" class="box example">I am a box too.</div>
```

在 autoRenderAll 时会实例化 xbox，等价于

```
new Xbox({
  element: '.example'
})
```

### data-widget-role

data-widget-role 是指将 data-api 的 DOM 作为指定属性传入，默认值为 element。

看来比较难理解，那我们看个例子

```
<a class="example" href="" data-widget="xbox" data-widget-role="trigger" data-element="#content">link</a>
<div id="content">I am a box too.</div>
```

上面指定的 data-widget-role 为 trigger，就是把 .example 以 trigger 为属性传入，以上等价于

```
new Xbox({
  trigger: '.example',
  element: '#content'
});
```

### data-widget-auto-rendered

如果已经渲染过了 `data-widget-auto-rendered` 为 true，之后就会忽略

### data-api

如果 `data-api=off`，则不会实例化。如果在 body 上设置的话所有基于 Widget 扩展的组件, 都不会实例化。

### data-attr

其他 data-api 都会转换成属性，会将连字符转换成驼峰。

```
<a href="" data-widget="xbox" data-class-name="test" data-id="test">link</a>
```
