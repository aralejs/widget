# 简单的 TabView

- order: 3

---

<style>
    #simple-tabs {
        width: 400px;
    }

    .nav li {
        list-style: none;
        float: left;
        border: 1px solid #eee;
        padding: 5px 10px;
        border-bottom: none;
        cursor: pointer;
    }

    .nav li.active {
        background: #eee;
    }

    .content {
        clear: both;
        border: 1px solid #eee;
        height: 200px;
        width: 500px;
        overflow: hidden;
    }

    .content div {
        height: 200px;
        padding: 20px;
    }

    #egg {
        padding: 5px 20px;
        margin: 10px 0;
    }
</style>


## 示例：简单的 TabView


下面演示如何基于 Widget 来快速开发一个简单的 TabView 界面组件。

### HTML

````html
<div id="demo">
    <ul class="nav">
        <li>开放</li>
        <li>简单</li>
        <li>易用</li>
    </ul>
    <div class="content">
        <div>开源开放，海纳百川。</div>
        <div>如无必要，勿增实体。</div>
        <div>一目了然，容易学习。</div>
    </div>
</div>
<button id="egg">手贱</button>
````

### JavaScript

````js
seajs.use(['widget', 'jquery'], function(Widget, $) {

    // 基于 Widget 定义 SimpleTabView 组件
    var SimpleTabView = Widget.extend({

        attrs: {
            triggers: {
                value: '.nav li',
                getter: function(val) {
                    return this.$(val);
                },
                readOnly: true
            },

            panels: {
                value: '.content div',
                getter: function(val) {
                    return this.$(val);
                },
                readOnly: true
            },

            activeIndex: {
                value: 0
            }
        },

        events: {
            'click .nav li': '_switchToEventHandler'
        },

        _onRenderActiveIndex: function(val, prev) {
            var triggers = this.get('triggers');
            var panels = this.get('panels');

            triggers.eq(prev).removeClass('active');
            triggers.eq(val).addClass('active');

            panels.eq(prev).hide();
            panels.eq(val).show();
        },

        _switchToEventHandler: function(ev) {
            var index = this.get('triggers').index(ev.target);
            this.switchTo(index);
        },

        switchTo: function(index) {
            this.set('activeIndex', index);
        },

        setup: function() {
            this.get('panels').hide();
            this.switchTo(this.get('activeIndex'))
        },

        add: function(title, content) {
            var li = $('<li>' + title + '</li>');
            var div = $('<div>' + content + '</div>');

            li.appendTo(this.get('triggers')[0].parentNode);
            div.appendTo(this.get('panels')[0].parentNode);

            return this;
        },

        setActiveContent: function(content) {
            this.get('panels').eq(this.get('activeIndex')).html(content);
        },

        size: function() {
            return this.get('triggers').length;
        }
    });


    var tabView = new SimpleTabView({
        element: '#demo',
        activeIndex: 0
    }).render();


    // 彩蛋：增加一点小趣味
    var counter = 1;

    $('#egg').on('click', function() {
        if (counter < 4) {
            tabView.add('哈哈', '你居然点击了 ' + counter++ + ' 次')
                    .switchTo(tabView.size() - 1);
        }
        else if (counter++ === 4) {
            tabView.setActiveContent('囧，你居然还点击，手真贱呀');
        }
        else {
            tabView.element.replaceWith('悄悄的我走了，带走了所有代码⋯⋯');
            $(this).remove();
        }
    });

});
````
