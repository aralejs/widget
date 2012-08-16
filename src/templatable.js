define(function(require, exports, module) {

  var $ = require('$');
  var Handlebars = require('handlebars');


  // 提供 Template 模板支持，默认引擎是 Handlebars
  module.exports = {

    // Handlebars 的 helpers
    templateHelpers: null,

    // template 对应的 DOM-like object
    templateObject: null,

    // 根据配置的模板和传入的数据，构建 this.element 和 templateElement
    parseElementFromTemplate: function() {
      this.templateObject = convertTemplateToObject(this.template);
      this.element = $(this.compile());
    },

    // 编译模板，混入数据，返回 html 结果
    compile: function(template, model) {
      template || (template = this.template);

      model || (model = this.model);
      if (model.toJSON) {
        model = model.toJSON();
      }

      var helpers = this.templateHelpers;

      // 注册 helpers
      if (helpers) {
        for (var name in helpers) {
          if (helpers.hasOwnProperty(name)) {
            Handlebars.registerHelper(name, helpers[name]);
          }
        }
      }

      // 生成 html
      var html = Handlebars.compile(template)(model);

      // 卸载 helpers
      if (helpers) {
        for (name in helpers) {
          if (helpers.hasOwnProperty(name)) {
            delete Handlebars.helpers[name];
          }
        }
      }

      return html;
    },

    // 刷新 selector 指定的局部区域
    renderPartial: function(selector) {
      var template = convertObjectToTemplate(this.templateObject, selector);
      this.$(selector).html(this.compile(template));
      return this;
    }
  };


  // Helpers
  // -------

  // 将 template 字符串转换成对应的 DOM-like object
  function convertTemplateToObject(template) {
    return $(encode(template));
  }

  // 根据 selector 得到 DOM-like template object，并转换为 template 字符串
  function convertObjectToTemplate(templateObject, selector) {
    // 没有选择器时，表示选择整个模板
    if (!selector) {
      return this.template;
    }

    // 根据 selector，获取对应的模板片段
    var element = templateObject.find(selector);
    if (element.length === 0) {
      throw new Error('Invalid template selector: ' + selector);
    }
    return decode(element.html());
  }


  var STAT_RE = /({[^}]+}})/g;
  var STAT_DECODE_RE = /(?:<|&lt;)!--({{[^}]+}})--(?:>|&gt;)/g;

  function encode(template) {
    return template.replace(STAT_RE, '<!--$1-->');
  }

  function decode(template) {
    return template.replace(STAT_DECODE_RE, '$1');
  }

});

// 调用 renderPartial 时，Templatable 对模板有一个约束：
// ** template 自身必须是有效的 html 代码片段**，比如
//   1. 代码闭合
//   2. 嵌套符合规范
//
// 总之，要保证在 template 里，将 `{{...}}` 转换成注释后，直接 innerHTML 插入到
// DOM 中，浏览器不会自动增加一些东西。比如：
//
// tbody 里没有 tr：
//  `<table><tbody>{{#each items}}<td>{{this}}</td>{{/each}}</tbody></table>`
//
// 标签不闭合：
//  `<div><span>{{name}}</div>`
