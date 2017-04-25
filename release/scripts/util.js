"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function addClass(el, cls) {
    var elClass = el.className;
    var blank = (elClass !== '') ? ' ' : '';
    var added = elClass + blank + cls;
    el.className = added;
}
exports.addClass = addClass;
function removeClass(el, cls) {
    var elClass = " " + el.className + " ";
    elClass = elClass.replace(/(\s+)/gi, ' ');
    var removed = elClass.replace(' ' + cls + ' ', ' ');
    removed = removed.replace(/(^\s+)|(\s+$)/g, '');
    el.className = removed;
}
exports.removeClass = removeClass;
function hasClass(el, cls) {
    var elClass = el.className;
    var elClassList = elClass.split(/\s+/);
    var x = elClassList.length;
    for (var i = 0; i < x; i++) {
        if (elClassList[x] == cls) {
            return true;
        }
    }
    return false;
}
exports.hasClass = hasClass;
function addEvent(el, type, func) {
    if (el.addEventListener) {
        el.addEventListener(type, func, false);
    }
    else if (el.attachEvent) {
        el.attachEvent('on' + type, func);
    }
    else {
        el['on' + type] = func;
    }
}
exports.addEvent = addEvent;
function removeEvent(el, type, func) {
    if (el.removeEventListener) {
        el.removeEventListener(type, func, false);
    }
    else if (el.detachEvent) {
        el.detachEvent('on' + type, func);
    }
    else {
        delete el['on' + type];
    }
}
exports.removeEvent = removeEvent;
function removeElement(el) {
    (el && el.parentNode) && el.parentNode.removeChild(el);
}
exports.removeElement = removeElement;
