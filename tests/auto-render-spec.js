var $ = require('jquery');
var Widget = require('../widget');

describe('AutoRender', function() {
  it('autoRenderAll', function(done) {
    var dom = $('<div data-widget="widget" data-class-name="widget" data-id="test1"></div>');
    dom.appendTo(document.body);
    Widget.autoRenderAll(function() {
      var test = Widget.query('#test1');
      expect(test.get('className')).to.be('widget');
      expect(test.element[0]).to.be(dom[0]);
      dom.remove();
      test.destroy();
      done();
    });
  });

  it('autoRender trigger', function(done) {
    var dom = $('<div id="element">element</div>').appendTo(document.body);
    var trigger = $('<div id="test2" data-widget="widget" data-class-name="widget" data-widget-role="trigger" data-element="#element"></div>');
    trigger.appendTo(document.body);
    Widget.autoRenderAll(function() {
      var test = Widget.query('#test2');
      expect(test.get('className')).to.be('widget');
      expect(test.get('trigger')[0]).to.be(trigger[0]);
      expect(test.element.html()).to.be('element');
      trigger.remove();
      dom.remove();
      test.destroy();
      done();
    });
  });

  it('autoRender template', function(done) {
    var dom = $('<div id="tpl"><p>element</p></div>').appendTo(document.body);
    var trigger = $('<div id="test3" data-widget="widget" data-widget-role="trigger" data-template="#tpl"></div>');
    trigger.appendTo(document.body);
    Widget.autoRenderAll(function() {
      var test = Widget.query('#test3');
      expect(test.element.html().toLowerCase()).to.be('<p>element</p>');
      trigger.remove();
      dom.remove();
      test.destroy();
      done();
    });
  });
});
