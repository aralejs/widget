# 历史记录

---

## 1.2.0

`improved` 升级到 spm@3.x 规范。

## 1.1.1

`tag:fixed` #55 修复 destroy 时会把之前绑定的事件清除的问题

`tag:improved` #54 标准化 DAParser 的写法

`tag:improved` 升级依赖 arale/base 到 1.1.1

## 1.1.0 [milestone](https://github.com/aralejs/widget/issues/37)

`tag:fixed` [#25](https://github.com/aralejs/widget/issues/25) destroy 的 bug

`tag:changed` [#47](https://github.com/aralejs/widget/issues/47) 不再使用 `this.template` 和 `this.model`

`tag:changed` [#36](https://github.com/aralejs/widget/issues/36) 当属性值为空字符串时的处理

`tag:new` [#39](https://github.com/aralejs/widget/issues/39) 彻底隔离样式冲突的 widget 方案

`tag:new` [#33](https://github.com/aralejs/widget/issues/33) handlebars runtime

`tag:new` [#26](https://github.com/aralejs/widget/issues/26) 支持 data-widget-role

`tag:improved` [#14](https://github.com/aralejs/widget/issues/14) delegateEvents 增强

`tag:improved` [#38](https://github.com/aralejs/widget/issues/38) 销毁 widget 创建的 element

`tag:improved` [#40](https://github.com/aralejs/widget/issues/40) 简化 initAttrs 参数

## 1.0.3

`tag:improved` [28](https://github.com/aralejs/widget/issues/28) Templatable 增加 cache，编译过后的模板不再编译，提高创建实例对象的性能。
