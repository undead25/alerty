export default class Alerty {
  // Default options
  private defaults: Alerty.Options = {
    okLabel: '\u786e\u5b9a',
    cancelLabel: '\u53d6\u6d88',
    time: 2000,
    maskClosable: true,
    escClosable: true,
    btnFocus: true,
    inputPlaceholder: '',
    inputValue: '',
    inputType: 'text'
  }

  private bindKeydown: (e: KeyboardEvent) => void;

  /**
   * Alert
   * @param {string} msg - The message content
   * @param {Alerty.Options} [opts=this.defaults] - options
   * @returns {Promise<any>} 
   */
  public alert(msg: string, opts: Alerty.Options = this.defaults): Promise<any> {
    opts = Object.assign({}, this.defaults, opts);
    return new Promise(resolve => this.open('alert', msg, opts).then(resolve));
  }

  /**
   * Confirm
   * @param {string} msg - The message content
   * @param {Alerty.Options} [opts=this.defaults] - options
   * @returns {Promise<any>} 
   */
  public confirm(msg: string, opts: Alerty.Options = this.defaults): Promise<any> {
    opts = Object.assign({}, this.defaults, opts);
    return new Promise((onOk, onCancel) => this.open('confirm', msg, opts).then(onOk, onCancel));
  }

  public prompt(msg: string, opts: Alerty.Options = this.defaults): Promise<any> {
    if (typeof msg === 'object') {
      opts = msg;
      msg = '';
    }
    opts = Object.assign({}, this.defaults, opts);
    return new Promise((onOk, onCancel) => this.open('prompt', msg, opts).then(onOk, onCancel));
  }

  private open(type: string, msg: string, opts: Alerty.Options): Promise<any> {
    const { maskClosable, escClosable, btnFocus } = opts;

    const $container = document.createElement('div');
    $container.innerHTML = this.renderDOM(type, msg, opts);
    document.body.classList.add('no-scrolling');
    $container.classList.add('alerty-container', 'active');
    document.body.appendChild($container);

    const $modal = document.querySelector('.alerty');
    const $btnOk = $modal.querySelector('.btn-ok');
    const $btnCancel = $modal.querySelector('.btn-cancel');
    const prompt = $modal.querySelector('.alerty-prompt');
    const input = prompt && prompt.querySelector('input');

    $modal.classList.add('alerty-show');
    btnFocus && ($btnOk as HTMLElement).focus();

    return new Promise((onOk, onCancel) => {
      $btnOk.addEventListener('click', () => {
        this.close($modal, $container).then(onOk);
      });

      $btnCancel && $btnCancel.addEventListener('click', () => {
        this.close($modal, $container).then(onCancel);
      })

      maskClosable && $container.addEventListener('click', (e: Event) => {
        e.target === $container && this.close($modal, $container).then(type === 'alert' ? onOk : onCancel);
      });

      if (escClosable) {
        this.bindKeydown = (e: KeyboardEvent) => {
          e.keyCode === 27 && this.close($modal, $container).then(type === 'alert' ? onOk : onCancel)
        }
        document.body.addEventListener('keydown', this.bindKeydown);
      }
    });
  }

  private close($modal: Element, $container: Element) {
    $modal.classList.remove('alerty-show');
    $modal.classList.add('alerty-hide');
    $container.classList.remove('active');
    document.body.classList.remove('no-scrolling');
    return new Promise(resolve => {
      setTimeout(() => {
        ($container && $container.parentNode) && $container.parentNode.removeChild($container);
        this.bindKeydown && document.body.removeEventListener('keydown', this.bindKeydown);
        setTimeout(() => {
          resolve && resolve();
        }, 100);
      }, 100);
    })
  }

  private renderDOM(type: string, msg: string, opts: Alerty.Options): string {
    let { title, okLabel, cancelLabel, inputValue, inputPlaceholder, inputType } = opts;

    const domBtnGroup = type === 'alert' ? `
      <button type="" class="btn-ok">${okLabel}</button>
    ` : `
      <button type="" class="btn-ok">${okLabel}</button>
      <button type="" class="btn-cancel">${cancelLabel}</button>
    `;
    const domTitle = title ? `<div class="alerty-title">${title}</div>` : '';
    const domPrompt = type === 'prompt' ? `
      <div class="alerty-prompt">
        <input type=${inputType} placeholder="${inputPlaceholder}" value="${inputValue}" autofocus>
        <div class="input-line"></div>
      </div>
    ` : '';

    return `
      <div class="alerty">
        ${domTitle}
        <div class="alerty-content">
          <p class="alerty-message">${msg}</p>
          ${domPrompt}
        </div>
        <div class="alerty-action">
          ${domBtnGroup}
        </div>
      </div>
    `.replace(/(^|\n)\s*/g, '');
  }
}
