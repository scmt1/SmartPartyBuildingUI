(function () {
    'use strict';

    let Tools = tinymce.util.Tools.resolve('tinymce.util.Tools');
    let global = tinymce.util.Tools.resolve('tinymce.PluginManager');

    let defaults = {
        // max: 0, // 最多可以输入多少字
        spaces: !1, // 是否含空格
        isInput: !1, // 是否在超出后还可以输入
        toast: null, // 自定义的提示方法, 默认用编辑器自带
    };

    class WordLimit {
        constructor(editor, options) {
            this.editor = editor;
            this.options = Tools.extend(defaults, options);

            var _this = this,
                oldContent = editor.getContent(),
                WordCount = editor.plugins.wordcount,
                preCount = 0,
                _wordCount = 0;

            editor.on('input paste undo redo Keyup ', function(e) {

                var content = editor.getContent() || e.content || '';

                if(!_this.options.spaces) { // 字数
                    _wordCount = WordCount.body.getCharacterCount();

                } else { // 不含空格字数
                    _wordCount = WordCount.body.getCharacterCountWithoutSpaces();
                }

                if(_wordCount > _this.options.max) {
                    preCount = _wordCount;
                    // 禁止再输入
                    if(_this.options.isInput == !1) {
                        // 内容超出还原
                        editor.setContent(oldContent);

                        // 还原后重新统计
                        if(!_this.options.spaces) {
                            _wordCount = WordCount.body.getCharacterCount();
                        } else {
                            _wordCount = WordCount.body.getCharacterCountWithoutSpaces();
                        }
                    }

                    editor.getBody().blur();
                    editor.fire('wordlimit', {
                        maxCount: _this.options.max,
                        wordCount: _wordCount,
                        preCount: preCount,
                        isPaste: (e.type === 'paste' || e.paste) || false
                    });
                }

                oldContent = editor.getContent();
            });
        }
    };

    function Plugin () {
        global.add('wordlimit', function (editor) {

            var options = editor.getParam('wordlimit', {}, 'object');

            if(!options && !options.max) {
                return !1;
            }

            if(typeof options.toast !== 'function') {
                options.toast = function(message) {
                    editor.notificationManager.open({
                        text: message,
                        type: 'error',
                        timeout: 3000,
                    });
                }
            }

            if(!editor.plugins.wordcount) {
                options.toast('请先在tinymce的plugins配置wordlimit之前加入wordcount插件');
                return !1;
            }

            editor.on('init', function (e) {
                new WordLimit(editor, options);
            });
        });
    }

    Plugin();

}());
