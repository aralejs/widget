define(function(require) {

  var DAParser = require('../src/daparser');
  var $ = require('$');
  var body = document.body;


  describe('DAParser', function() {

    test('single data-xx', function() {
      var div = $('<div data-key="value"></div>').appendTo(body);
      var dataset = DAParser.parseElement(div);

      expect(dataset.key).toBe('value');

      div.remove();
    });

    test('multi data-xx', function() {
      var div = $('<div data-key="value" data-key2="val2"></div>').appendTo(body);
      var dataset = DAParser.parseElement(div);

      expect(dataset['key']).toBe('value');
      expect(dataset['key2']).toBe('val2');

      div.remove();
    });

    test('convert dash-name to camelCasedName', function() {
      var div = $('<div data-x-y-123a-_B="val" data-x-y="val" data-AbcD-x="val"></div>').appendTo(body);
      var dataset = DAParser.parseElement(div);

      //console.dir(div[0].dataset);
      //console.dir(dataset);

      //expect(dataset['xY-123a-_b']).toBe('val');
      // chrome 和 firefox 的处理不同，悲催的兼容性，苦逼的前端呀。
      // 在 chrome 下:
      //expect(dataset['xY-123a-_b']).toBe(undefined);
      // 在 firefox 下：
      //expect(dataset['xY-123a-_b']).toBe(val);


      expect(dataset['xY']).toBe('val');
      expect(dataset['abcdX']).toBe('val');

      div.remove();
    });

    test('table element', function() {
      var table = $('<table><tr><td data-x="1"></td></tr></table>').appendTo(body);
      var dataset = DAParser.parseElement(table.find('td')[0]);

      expect(dataset['x']).toBe(1);
      table.remove();
    });
  });
});
