# templatable performance test

------------------------------------

<button id="btn">Begin</button>
<div id="console-div"></div>
<div id="container">aaa</div>

````javascript
seajs.use(['$', 'widget', 'templatable'], function($, Widget, Templatable) {
    var MyWidget = Widget.extend({
        Implements: Templatable,
        template: '<p>{{a}} - {{a}} - {{a}} - {{a}} - {{a}} - {{a}} - {{a}} - {{a}} - {{a}} - {{a}} - {{a}} - {{a}} - {{a}} - {{a}} - {{a}} - {{a}} - {{a}} - {{a}} - {{a}} - {{a}} - {{a}} - {{a}} - {{a}} - {{a}} - {{a}}</p>'
    });

    $(function() {
        var $console = $('#console-div');
        var $container = $('#container');
        $('#btn').click(function() {
            var startTime = (new Date()).getTime();
            $console.append('start: ' + startTime + '<br/>');

            var w;

            for (var i = 0; i < 20; i++) {
                w = new MyWidget({
                    model: {
                        a: i
                    },
                    parentNode: $container
                });
                w.render();
            }

            var endTime = (new Date()).getTime();
            $console.append('end: ' + endTime + '<br/>');
            $console.append('total cost: ' + (endTime - startTime) + '<br/>');
        });
    });
});
````