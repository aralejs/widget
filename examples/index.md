# 基本的事件操作

- order: 1

---

<style>
    .widget {
        zoom: 1;
        display: inline;
        display: inline-block;
        border: 1px solid #ccc;
        padding: 20px;
        min-width: 300px;
    }

    #example3 li {
        list-style: none;
        clear: both;
    }

    #example3 li a {
        float: left;
    }

    #example3 .remove {
        float: right;
        text-decoration: none;
        color: red;
    }

    #example4 .action {
        padding: 0 20px
    }

    #example4 .action a {
        padding: 0 10px
    }
</style>


## 示例一：Events Delegation


### HTML

````html
<div id="example1" class="example widget">
    <h3>我是标题，请点击我一下。</h3>
    <p>我是段落，请将鼠标悬浮在我上面，我会变色的。</p>
</div>
````

### JavaScript

````js
seajs.use(['widget', 'templatable', 'handlebars', '$'], function(Widget, Templatable, Handlebars, $) {

    var WidgetA = Widget.extend({

        events: {
            'click h3': 'heading',
            'mouseover p': 'paragraph'
        },

        heading: function() {
            this.$('h3').html('标题被点击了。');
        },

        paragraph: function() {
            this.$('p').css('background-color', 'red');
        }
    });

    var a = new WidgetA({ element: '#example1' });
});
````


## 示例二：Templatable Widget


### HTML

````html
<div id="example2" class="example">
</div>
````

### JavaScript

````js
seajs.use(['widget', 'templatable', 'handlebars', '$'], function(Widget, Templatable, Handlebars, $) {

    var WidgetB = Widget.extend({

        Implements: Templatable,

        template: '<div id="b" class="widget"><h3>{{title}}</h3><p>{{content}}</p></div>',

        model: {
            title: '我是默认标题',
            content: '我是默认内容'
        },

        events: {
            'click': 'animate'
        },

        animate: function() {
            this.$('p').slideToggle('slow');
        },

        setup: function() {
            this.$('p').css({
                'height': 100,
                'padding': 20,
                'backgroundColor': '#eee'
            });
        }
    });

    var b = new WidgetB({
        model: {
            content: '我是传入的内容，点击我试试'
        },
        parentNode: '#example2'
    }).render();
});
````


## 示例三：Template Helpers


### HTML

<div id="example3" class="example">
    <script id="template-c" type="text/x-handlebars-template">
        <div>
            <h3>{{title}}</h3>
            <ul>{{list items}}</ul>
        </div>
    </script>
</div>

```
<div id="example3" class="example">
    <script id="template-c" type="text/x-handlebars-template">
        <div>
            <h3>{{title}}</h3>
            <ul>{{list items}}</ul>
        </div>
    </script>
</div>
```

### JavaScript

````js
seajs.use(['widget', 'templatable', 'handlebars', '$'], function(Widget, Templatable, Handlebars, $) {

    var WidgetC = Widget.extend({

        Implements: Templatable,

        events: {
            'click li .remove': 'remove',
            'click h3': 'toggle',
            'mouseenter ul': 'focus',
            'mouseleave ul': 'blur'
        },

        templateHelpers: {
            'list': function(items) {
                var out = '';

                for (var i = 0, len = items.length; i < len; i++) {
                    var item = items[i];
                    out += '<li>' + item.text +
                           '<a href="#" class="remove">X</a></li>';
                }

                return new Handlebars.SafeString(out);
            }
        },

        remove: function(event) {
            event.preventDefault();
            $(event.target).parent().remove();
        },

        toggle: function() {
            this.$('ul').slideToggle('slow');
        },

        focus: function() {
            this.$('ul').css('backgroundColor', '#eee');
        },

        blur: function() {
            this.$('ul').css('backgroundColor', '');
        },

        setup: function() {
            this.element.attr('style', this.get('style'));
            this.element.addClass(this.get('className'));
        }

    });

    var c = new WidgetC({
        className: 'widget',
        titleClassName: 'title',
        style: 'width: 350px',
        model: {
            title: "设计原则（点击我）",
            items: [
                { "text": "开放：开源开放，海纳百川。（悬浮上来）" },
                { "text": "简单：如无必要，勿增实体。" },
                { "text": "易用：一目了然，容易学习。" }
            ]
        },
        template: $('#template-c').html(),
        parentNode: '#example3'
    }).render();
});
````
