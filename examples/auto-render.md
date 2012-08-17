
## 加载器配置

首先，页面中要加载 `sea.js`，并配置好别名：

````javascript
seajs.config({
    'widget': '../src/widget'
});
````

注意：实际使用时，别名值需要修改为实际路径，比如 `{ 'widget': '1.0.0' }`

---

<style>
.box {
        zoom: 1;
        display: inline;
        display: inline-block;
        border: 1px solid #ccc;
        padding: 20px;
        min-width: 300px;
        margin-right: 20px;
    }
</style>


## 示例：自动渲染


通过在 HTML 代码结构中添加 `data-widget` 属性，然后在页尾执行 `Widget.autoRenderAll`
方法，可以实现页面组件的自动渲染。


### HTML


<div id="example1" data-widget="widget" data-class-name="box">
I am a box.
</div>

<div data-widget="widget" class="box example">
I am a box too.
</div>

````html
<div id="example1" data-widget="widget" data-class-name="box">
I am a box.
</div>

<div data-widget="widget" class="box example">
I am a box too.
</div>
````

### JavaScript

````javascript
//一般放置在页尾：
seajs.use(['widget', 'jquery'], function(Widget, $) {

    // 使用 autoRenderAll 自动渲染所有页面组件
    Widget.autoRenderAll(function() {

        // 使用 query 方法获取到与指定 DOM 节点相关联的 Widget 实例
        var example1 = Widget.query('#example1')

        // 对实例进行一些操作
        example1.element.html('I am rendered automatically.')

        // 操作第二个实例
        var example2 = Widget.query('div.example')

        // 操作下
        example2.element.html('I am rendered automatically too.')
    })

});
````
