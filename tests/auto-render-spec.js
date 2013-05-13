define(function(require) {

  var $ = require('$');
  var Widget = require('widget');

  describe('AutoRender', function() {
    it('autoRenderAll', function(done) {
      var dom1 = $('<div id="test1" data-widget="widget" data-class-name="widget"></div>');
      dom1.appendTo(document.body);
      Widget.autoRenderAll(function() {
        var test = Widget.query('#test1');

        expect(test.get('className')).to.be('widget');
        dom1.remove();
        test.destroy();
        done();
      });
    });
  });
});