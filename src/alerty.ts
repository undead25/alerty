export default class Alerty {
  public noop: Function = () => {};
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
  // User options
  private options: Alerty.Options;
  // Modal type
  private type: Alerty.ModalType;
  // Modal message content
  private msg: string;
  // Modal element
  private modal: Element = null;
  // Modal's container element
  private container: Element = null;
  // Callback for ok
  private resolve: (value?: any) => void = null;
  // Callback for cancel
  private reject: (reason?: any) => void = null;
  // Bind keydown event
  private bindKeydown: (e: KeyboardEvent) => void = null;

  /**
   * Alert
   * @param {string} msg - The message content
   * @param {Alerty.Options} - options
   * @returns {Promise<any>} 
   */
  public alert = (msg: string, opts: Alerty.Options): Promise<any> => this.init('alert', msg, opts);

  /**
   * Confirm
   * @param {string} msg - The message content
   * @param {Alerty.Options} - options
   * @returns {Promise<any>} 
   */
  public confirm = (msg: string, opts: Alerty.Options): Promise<any> => this.init('confirm', msg, opts);

  public prompt = (msg: string, opts: Alerty.Options): Promise<any> => this.init('prompt', msg, opts);

  private init(type: Alerty.ModalType, msg: string, opts: Alerty.Options): Promise<any> {
    this.type = type;
    this.msg = msg;
    this.options = Object.assign({}, this.defaults, opts);
    this.open();
    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    })
  }

  private open() {
    const { maskClosable, escClosable, btnFocus } = this.options;

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

  private renderDOM(): string {
    const { options, type, msg } = this;
    let { title, okLabel, cancelLabel, inputValue, inputPlaceholder, inputType } = options;

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

  private bindEvents(): void {
    const { container, modal, options, type } = this;
    const { maskClosable, escClosable } = options;
    const $btnOk = modal.querySelector('.btn-ok');
    const $btnCancel = modal.querySelector('.btn-cancel');
    const $input = modal.querySelector('input');

    // Handle button ok
    $btnOk.addEventListener('click', () => {
      this.close();
      this.resolve && setTimeout(() => {
        type === 'prompt' ? this.resolve($input.value) : this.resolve();
      }, 200);
    });

    // Handle button cancel
    $btnCancel && $btnCancel.addEventListener('click', () => {
      this.close();
      this.reject && setTimeout(() => Promise.resolve(this.reject()), 200);
    })

    // Handle mask close
    maskClosable && container.addEventListener('click', (e: Event) => e.target === container && this.close());

    // Handle esc close
    if (escClosable) {
      this.bindKeydown = (e: KeyboardEvent) => e.keyCode === 27 && this.close();
      document.body.addEventListener('keydown', this.bindKeydown);
    }
  }

  private setFocus(): void {
    const { type, options, modal } = this;
    const $btnOk = modal.querySelector('.btn-ok');
    const $input = modal.querySelector('input');
    type === 'prompt' ? $input.focus() : options.btnFocus && ($btnOk as HTMLElement).focus();
  }

  private close(): void {
    const { modal, container, resolve, reject } = this;
    modal.classList.remove('alerty-show');
    modal.classList.add('alerty-hide');
    container.classList.remove('active');
    document.body.classList.remove('no-scrolling');
    setTimeout(() => {
      (container && container.parentNode) && container.parentNode.removeChild(container);
      this.bindKeydown && document.body.removeEventListener('keydown', this.bindKeydown);
    }, 100);
  }
}
