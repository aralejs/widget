# 基本的事件操作

- order: 1

---

<style>
    .markdown-body .widget {
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


## Events Delegation


### HTML

````html
<div id="example1" class="example widget">
    <h3>我是标题，请点击我一下。</h3>
    <p>我是段落，请将鼠标悬浮在我上面，我会变色的。</p>
</div>
````

### JavaScript

````js
seajs.use(['widget', 'jquery'], function(Widget, $) {

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
