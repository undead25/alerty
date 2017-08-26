(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Alerty = factory());
}(this, (function () { 'use strict';

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var Alerty = function () {
    function Alerty() {
        var _this = this;

        classCallCheck(this, Alerty);

        this.noop = function () {};
        // Default options
        this.defaults = {
            okLabel: '\u786E\u5B9A',
            cancelLabel: '\u53D6\u6D88',
            time: 2000,
            maskClosable: true,
            escClosable: true,
            btnFocus: true,
            inputPlaceholder: '',
            inputValue: '',
            inputType: 'text'
        };
        // Modal element
        this.modal = null;
        // Modal's container element
        this.container = null;
        // Callback for ok
        this.resolve = null;
        // Callback for cancel
        this.reject = null;
        // Bind keydown event
        this.bindKeydown = null;
        /**
         * Alert
         * @param {string} msg - The message content
         * @param {Alerty.Options} - options
         * @returns {Promise<any>}
         */
        this.alert = function (msg, opts) {
            return _this.init('alert', msg, opts);
        };
        /**
         * Confirm
         * @param {string} msg - The message content
         * @param {Alerty.Options} - options
         * @returns {Promise<any>}
         */
        this.confirm = function (msg, opts) {
            return _this.init('confirm', msg, opts);
        };
        this.prompt = function (msg, opts) {
            return _this.init('prompt', msg, opts);
        };
    }

    createClass(Alerty, [{
        key: 'init',
        value: function init(type, msg, opts) {
            var _this2 = this;

            this.type = type;
            this.msg = msg;
            this.options = Object.assign({}, this.defaults, opts);
            this.open();
            return new Promise(function (resolve, reject) {
                _this2.resolve = resolve;
                _this2.reject = reject;
            });
        }
    }, {
        key: 'open',
        value: function open() {
            var _options = this.options,
                maskClosable = _options.maskClosable,
                escClosable = _options.escClosable,
                btnFocus = _options.btnFocus;

            this.container = document.createElement('div');
            this.container.innerHTML = this.renderDOM();
            document.body.classList.add('no-scrolling');
            this.container.classList.add('alerty-container', 'active');
            document.body.appendChild(this.container);
            this.modal = document.querySelector('.alerty');
            this.modal.classList.add('alerty-show');
            this.setFocus();
            this.bindEvents();
        }
    }, {
        key: 'renderDOM',
        value: function renderDOM() {
            var options = this.options,
                type = this.type,
                msg = this.msg;
            var title = options.title,
                okLabel = options.okLabel,
                cancelLabel = options.cancelLabel,
                inputValue = options.inputValue,
                inputPlaceholder = options.inputPlaceholder,
                inputType = options.inputType;

            var domBtnGroup = type === 'alert' ? '\n      <button type="" class="btn-ok">' + okLabel + '</button>\n    ' : '\n      <button type="" class="btn-ok">' + okLabel + '</button>\n      <button type="" class="btn-cancel">' + cancelLabel + '</button>\n    ';
            var domTitle = title ? '<div class="alerty-title">' + title + '</div>' : '';
            var domPrompt = type === 'prompt' ? '\n      <div class="alerty-prompt">\n        <input type=' + inputType + ' placeholder="' + inputPlaceholder + '" value="' + inputValue + '" autofocus>\n        <div class="input-line"></div>\n      </div>\n    ' : '';
            return ('\n      <div class="alerty">\n        ' + domTitle + '\n        <div class="alerty-content">\n          <p class="alerty-message">' + msg + '</p>\n          ' + domPrompt + '\n        </div>\n        <div class="alerty-action">\n          ' + domBtnGroup + '\n        </div>\n      </div>\n    ').replace(/(^|\n)\s*/g, '');
        }
    }, {
        key: 'bindEvents',
        value: function bindEvents() {
            var _this3 = this;

            var container = this.container,
                modal = this.modal,
                options = this.options,
                type = this.type;
            var maskClosable = options.maskClosable,
                escClosable = options.escClosable;

            var $btnOk = modal.querySelector('.btn-ok');
            var $btnCancel = modal.querySelector('.btn-cancel');
            var $input = modal.querySelector('input');
            // Handle button ok
            $btnOk.addEventListener('click', function () {
                _this3.close();
                _this3.resolve && setTimeout(function () {
                    type === 'prompt' ? _this3.resolve($input.value) : _this3.resolve();
                }, 200);
            });
            // Handle button cancel
            $btnCancel && $btnCancel.addEventListener('click', function () {
                _this3.close();
                _this3.reject && setTimeout(function () {
                    return Promise.resolve(_this3.reject());
                }, 200);
            });
            // Handle mask close
            maskClosable && container.addEventListener('click', function (e) {
                return e.target === container && _this3.close();
            });
            // Handle esc close
            if (escClosable) {
                this.bindKeydown = function (e) {
                    return e.keyCode === 27 && _this3.close();
                };
                document.body.addEventListener('keydown', this.bindKeydown);
            }
        }
    }, {
        key: 'setFocus',
        value: function setFocus() {
            var type = this.type,
                options = this.options,
                modal = this.modal;

            var $btnOk = modal.querySelector('.btn-ok');
            var $input = modal.querySelector('input');
            type === 'prompt' ? $input.focus() : options.btnFocus && $btnOk.focus();
        }
    }, {
        key: 'close',
        value: function close() {
            var _this4 = this;

            var modal = this.modal,
                container = this.container,
                resolve = this.resolve,
                reject = this.reject;

            modal.classList.remove('alerty-show');
            modal.classList.add('alerty-hide');
            container.classList.remove('active');
            document.body.classList.remove('no-scrolling');
            setTimeout(function () {
                container && container.parentNode && container.parentNode.removeChild(container);
                _this4.bindKeydown && document.body.removeEventListener('keydown', _this4.bindKeydown);
            }, 100);
        }
    }]);
    return Alerty;
}();

return Alerty;

})));
window.alerty = new Alerty()
