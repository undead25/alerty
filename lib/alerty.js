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
        classCallCheck(this, Alerty);

        // static defaults params
        this.defaults = {
            okLabel: '\u786E\u5B9A',
            cancelLabel: '\u53D6\u6D88',
            time: 2000
        };
    }

    createClass(Alerty, [{
        key: 'alert',
        value: function alert(content) {
            var _this = this;

            var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.defaults;

            opts = Object.assign({}, this.defaults, opts);
            return new Promise(function (resolve, reject) {
                _this.open('alert', content, opts).then(function () {
                    return resolve();
                });
            });
        }
    }, {
        key: 'open',
        value: function open(type, content, opts) {
            var _this2 = this;

            if (typeof document === 'undefined') {
                console.error('Alerty need doccument environment!');
                return;
            }
            var $container = document.createElement('div');
            $container.classList.add('alerty-container');
            $container.innerHTML = this.renderDOM(type, content, opts);
            document.body.appendChild($container);
            document.body.classList.add('no-scrolling');
            // cache alerty element
            var $modal = document.querySelector('.alerty');
            var $title = $modal.querySelector('.alerty-title');
            var message = $modal.querySelector('.alerty-message');
            var btnArea = $modal.querySelector('.alerty-action');
            var $btnOk = $modal.querySelector('.btn-ok');
            // const btnCancel = $modal.querySelector('.btn-cancel');
            // const prompt = $modal.querySelector('.alerty-prompt');
            // const input = prompt.querySelector('input');
            $container.classList.add('active');
            $modal.classList.add('alerty-show');
            return new Promise(function (resolve, reject) {
                $btnOk.addEventListener('click', function () {
                    _this2.close($modal, $container);
                    resolve();
                }, false);
                $container.addEventListener('click', function () {
                    _this2.close($modal, $container);
                    resolve();
                }, false);
            });
        }
    }, {
        key: 'close',
        value: function close($modal, $container) {
            $modal.classList.remove('alerty-show');
            $modal.classList.add('alerty-hide');
            $container.classList.remove('active');
            document.body.classList.remove('no-scrolling');
            setTimeout(function () {
                $container && $container.parentNode && $container.parentNode.removeChild($container);
            }, 100);
        }
    }, {
        key: 'renderDOM',
        value: function renderDOM(type, content, opts) {
            var title = opts.title,
                okLabel = opts.okLabel,
                cancelLabel = opts.cancelLabel;

            var domBtnGroup = type === 'alert' ? '\n      <a class="btn-ok">' + okLabel + '</a>\n    ' : '\n      <a class="btn-ok">' + okLabel + '</a>\n      <a class="btn-cancel">' + cancelLabel + '</a>\n    ';
            var domTitle = title ? '<div class="alerty-title">' + title + '</div>' : '';
            var domPrompt = type === 'prompt' ? '\n      <div class="alerty-prompt">\n        <input type="text" placeholder="" value="">\n        <div class="input-line"></div>\n      </div>\n    ' : '';
            return ('\n      <div class="alerty">\n        ' + domTitle + '\n        <div class="alerty-content">\n          <p class="alerty-message">' + content + '</p>\n          ' + domPrompt + '\n        </div>\n        <div class="alerty-action">\n          ' + domBtnGroup + '\n        </div>\n      </div>\n    ').replace(/(^|\n)\s*/g, '');
        }
    }]);
    return Alerty;
}();

return Alerty;

})));
window.alerty = new Alerty()
