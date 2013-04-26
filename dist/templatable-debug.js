define("arale/widget/1.0.4/templatable-debug", [ "$-debug", "gallery/handlebars/1.0.1/handlebars-debug" ], function(require, exports, module) {
    var $ = require("$-debug");
    var Handlebars = require("gallery/handlebars/1.0.1/handlebars-debug");
    var compiledTemplates = {};
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
            //优先使用model
            // model || (model = this.model)
            if (!model) {
                model = this.model;
                if (model) {
                    console && console.warn && console.warn("请使用attrs来代替model！");
                } else {
                    var model = {};
                    for (var key in this.attrs) {
                        model[key] = this.get(key);
                    }
                }
            }
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
            var compiledTemplate = typeof template === "function" ? template : compiledTemplates[template];
            if (!compiledTemplate) {
                compiledTemplate = compiledTemplates[template] = Handlebars.compile(template);
            }
            // 生成 html
            var html = compiledTemplate(model);
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
        //解析一些自定义的属性
        //data-widget-role
        //在渲染dom后被调用
        _parseWidgetExtension: function() {
            var self = this;
            this.$("[data-widget-role]").each(function() {
                var $this = $(this), role = $this.attr("data-widget-role");
                self[role] = $this;
            });
            return this;
        },
        // 刷新 selector 指定的局部区域
        renderPartial: function(selector) {
            var template = convertObjectToTemplate(this.templateObject, selector);
            if (template && selector) {
                this.$(selector).html(this.compile(template));
            } else if (template) {
                //如果没有选择器就更新自身
                this.element.html(this.compile(template));
            } else {
                this.element.html(this.compile());
            }
            return this;
        }
    };
    // Helpers
    // -------
    var _compile = Handlebars.compile;
    Handlebars.compile = function(template) {
        return isFunction(template) ? template : _compile.call(Handlebars, template);
    };
    // 将 template 字符串转换成对应的 DOM-like object
    function convertTemplateToObject(template) {
        return isFunction(template) ? null : $(encode(template));
    }
    // 根据 selector 得到 DOM-like template object，并转换为 template 字符串
    function convertObjectToTemplate(templateObject, selector) {
        if (!templateObject) return;
        var element;
        if (selector) {
            element = templateObject.find(selector);
        } else {
            element = templateObject;
        }
        if (element.length === 0) {
            throw new Error("Invalid template selector: " + selector);
        }
        return decode(element.html());
    }
    function encode(template) {
        return template.replace(/({[^}]+}})/g, "<!--$1-->").replace(/\s(src|href)\s*=\s*(['"])(.*?\{.+?)\2/g, " data-templatable-$1=$2$3$2");
    }
    function decode(template) {
        return template.replace(/(?:<|&lt;)!--({{[^}]+}})--(?:>|&gt;)/g, "$1").replace(/data-templatable-/gi, "");
    }
    function isFunction(obj) {
        return typeof obj === "function";
    }
});
