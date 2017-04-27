export function addClass(el: HTMLElement, cls: string): void {
  const elClass: string = el.className;
  const blank: string = (elClass !== '') ? ' ' : '';
  const added: string = elClass + blank + cls;
  el.className = added;
}

export function removeClass(el: HTMLElement, cls: string): void {
  let elClass: string = ` ${el.className} `;
  elClass = elClass.replace(/(\s+)/gi, ' ');
  let removed: string = elClass.replace(' ' + cls + ' ', ' ');
  removed = removed.replace(/(^\s+)|(\s+$)/g, '');
  el.className = removed;
}

export function hasClass(el: HTMLElement, cls: string): boolean {
  const elClass: string = el.className;
  const elClassList: Array<string> = elClass.split(/\s+/);
  let x = elClassList.length;
  for (let i = 0; i < x; i++) {
    if (elClassList[x] == cls) {
      return true;
    }
  }
  return false;
}

export function addEvent(el: HTMLElement, type: string, func: () => any): void {
  if (el.addEventListener) {
    el.addEventListener(type, func, false);
  } else if (el['attachEvent']) {
    el['attachEvent']('on' + type, func);
  } else {
    el['on' + type] = func;
  }
}

export function removeEvent(el: HTMLElement, type: string, func: () => any): void {
  if (el.removeEventListener) {
    el.removeEventListener(type, func, false);
  } else if (el['detachEvent']) {
    el['detachEvent']('on' + type, func);
  } else {
    delete el['on' + type];
  }
}

export function removeElement(el: HTMLElement):void {
  (el && el.parentNode) && el.parentNode.removeChild(el);
}
