(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Alerty = factory());
}(this, (function () { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











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
        classCallCheck(this, Alerty);

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
    }
    /**
     * Alert
     * @param {string} msg - The message content
     * @param {Alerty.Options} [opts=this.defaults] - options
     * @returns {Promise<any>}
     */


    createClass(Alerty, [{
        key: 'alert',
        value: function alert(msg) {
            var _this = this;

            var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.defaults;

            opts = Object.assign({}, this.defaults, opts);
            return new Promise(function (resolve) {
                return _this.open('alert', msg, opts).then(resolve);
            });
        }
        /**
         * Confirm
         * @param {string} msg - The message content
         * @param {Alerty.Options} [opts=this.defaults] - options
         * @returns {Promise<any>}
         */

    }, {
        key: 'confirm',
        value: function confirm(msg) {
            var _this2 = this;

            var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.defaults;

            opts = Object.assign({}, this.defaults, opts);
            return new Promise(function (onOk, onCancel) {
                return _this2.open('confirm', msg, opts).then(onOk, onCancel);
            });
        }
    }, {
        key: 'prompt',
        value: function prompt(msg) {
            var _this3 = this;

            var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.defaults;

            if ((typeof msg === 'undefined' ? 'undefined' : _typeof(msg)) === 'object') {
                opts = msg;
                msg = '';
            }
            opts = Object.assign({}, this.defaults, opts);
            return new Promise(function (onOk, onCancel) {
                return _this3.open('prompt', msg, opts).then(onOk, onCancel);
            });
        }
    }, {
        key: 'open',
        value: function open(type, msg, opts) {
            var _this4 = this;

            var maskClosable = opts.maskClosable,
                escClosable = opts.escClosable,
                btnFocus = opts.btnFocus;

            var $container = document.createElement('div');
            $container.innerHTML = this.renderDOM(type, msg, opts);
            document.body.classList.add('no-scrolling');
            $container.classList.add('alerty-container', 'active');
            document.body.appendChild($container);
            var $modal = document.querySelector('.alerty');
            var $btnOk = $modal.querySelector('.btn-ok');
            var $btnCancel = $modal.querySelector('.btn-cancel');
            var prompt = $modal.querySelector('.alerty-prompt');
            var input = prompt && prompt.querySelector('input');
            $modal.classList.add('alerty-show');
            btnFocus && $btnOk.focus();
            return new Promise(function (onOk, onCancel) {
                $btnOk.addEventListener('click', function () {
                    _this4.close($modal, $container).then(onOk);
                });
                $btnCancel && $btnCancel.addEventListener('click', function () {
                    _this4.close($modal, $container).then(onCancel);
                });
                maskClosable && $container.addEventListener('click', function (e) {
                    e.target === $container && _this4.close($modal, $container).then(type === 'alert' ? onOk : onCancel);
                });
                if (escClosable) {
                    _this4.bindKeydown = function (e) {
                        e.keyCode === 27 && _this4.close($modal, $container).then(type === 'alert' ? onOk : onCancel);
                    };
                    document.body.addEventListener('keydown', _this4.bindKeydown);
                }
            });
        }
    }, {
        key: 'close',
        value: function close($modal, $container) {
            var _this5 = this;

            $modal.classList.remove('alerty-show');
            $modal.classList.add('alerty-hide');
            $container.classList.remove('active');
            document.body.classList.remove('no-scrolling');
            return new Promise(function (resolve) {
                setTimeout(function () {
                    $container && $container.parentNode && $container.parentNode.removeChild($container);
                    _this5.bindKeydown && document.body.removeEventListener('keydown', _this5.bindKeydown);
                    setTimeout(function () {
                        resolve && resolve();
                    }, 100);
                }, 100);
            });
        }
    }, {
        key: 'renderDOM',
        value: function renderDOM(type, msg, opts) {
            var title = opts.title,
                okLabel = opts.okLabel,
                cancelLabel = opts.cancelLabel,
                inputValue = opts.inputValue,
                inputPlaceholder = opts.inputPlaceholder,
                inputType = opts.inputType;

            var domBtnGroup = type === 'alert' ? '\n      <button type="" class="btn-ok">' + okLabel + '</button>\n    ' : '\n      <button type="" class="btn-ok">' + okLabel + '</button>\n      <button type="" class="btn-cancel">' + cancelLabel + '</button>\n    ';
            var domTitle = title ? '<div class="alerty-title">' + title + '</div>' : '';
            var domPrompt = type === 'prompt' ? '\n      <div class="alerty-prompt">\n        <input type=' + inputType + ' placeholder="' + inputPlaceholder + '" value="' + inputValue + '" autofocus>\n        <div class="input-line"></div>\n      </div>\n    ' : '';
            return ('\n      <div class="alerty">\n        ' + domTitle + '\n        <div class="alerty-content">\n          <p class="alerty-message">' + msg + '</p>\n          ' + domPrompt + '\n        </div>\n        <div class="alerty-action">\n          ' + domBtnGroup + '\n        </div>\n      </div>\n    ').replace(/(^|\n)\s*/g, '');
        }
    }]);
    return Alerty;
}();

return Alerty;

})));
window.alerty = new Alerty()
