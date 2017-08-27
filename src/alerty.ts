export default class Alerty {
  // if no cancel callback passed
  public noop: Function = () => { };

  // Default options
  private defaults: Alerty.Options = {
    okLabel: '\u786e\u5b9a',
    cancelLabel: '\u53d6\u6d88',
    maskClosable: true,
    escClosable: true,
    btnFocus: true,
    inputPlaceholder: '',
    inputValue: '',
    inputType: 'text',
    toastDuration: 2000
  };
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

  /**
   * Prompt
   * @param {string} msg - The message content
   * @param {Alerty.Options} - options
   * @returns {Promise<any>}
   */
  public prompt = (msg: string, opts: Alerty.Options): Promise<any> => this.init('prompt', msg, opts);

  /**
   * Toasts
   * @param {string} msg - The message content
   * @param {Alerty.Options} - options
   * @returns {Promise<any>}
   */
  public toasts = (msg: string, opts: Alerty.Options): Promise<any> => this.init('toasts', msg, opts);

  /**
   * Entry of all type
   * @param {Alerty.ModalType} type - modal type
   * @param {string} msg - modal message content
   * @param {Alerty.Options} opts - user options
   * @returns {Promise<any>}
   */
  private init(type: Alerty.ModalType, msg: string, opts: Alerty.Options): Promise<any> {
    this.type = type;
    this.msg = msg;
    this.options = Object.assign({}, this.defaults, opts);
    this.open();
    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  /**
   * Open dialog with rendered DOM.
   */
  private open(): void {
    this.container = document.createElement('div');
    const { container, options } = this;
    const { maskClosable, escClosable, btnFocus } = options;

    container.innerHTML = this.renderDOM();
    document.body.appendChild(container);

    container.classList.add('alerty-container');
    this.modal = document.querySelector('.alerty');
    this.modal.classList.add('alerty-show');

    if (this.type === 'toasts') {
      container.classList.add('toasts');
    } else {
      container.classList.add('active');
      document.body.classList.add('no-scrolling');
      this.setFocus();
    }

    this.bindEvents();
  }

  /**
   * Returns the DOM element string for dialog
   * @returns {string}
   */
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
        ${type !== 'toasts' ? `
          <div class="alerty-action">
            ${domBtnGroup}
          </div>
        ` : ''}
      </div>
    `.replace(/(^|\n)\s*/g, '');
  }

  /**
   * Bind events to elements.
   */
  private bindEvents(): void {
    const { container, modal, options, type } = this;
    const { maskClosable, escClosable, toastDuration } = options;
    const $btnOk = modal.querySelector('.btn-ok');
    const $btnCancel = modal.querySelector('.btn-cancel');
    const $input = modal.querySelector('input');

    // Handel toast auto close
    let toastTimer: number;
    if (type === 'toasts') {
      toastTimer = setTimeout(() => {
        this.close();
        this.resolve && setTimeout(() => this.resolve(), 200);
      }, toastDuration);
    }

    // Handle button ok
    $btnOk && $btnOk.addEventListener('click', () => {
      this.close();
      this.resolve && setTimeout(() => {
        type === 'prompt' ? this.resolve($input.value) : this.resolve();
      }, 200);
    });

    // Handle button cancel
    $btnCancel && $btnCancel.addEventListener('click', () => {
      this.close();
      this.reject && setTimeout(() => this.reject(), 200);
    });

    // Handle mask close
    maskClosable && container.addEventListener('click', (e: Event) => {
      e.target === container && this.close();

      // toasts need immediately close and run callback
      type === 'toasts' && setTimeout(() => {
        clearTimeout(toastTimer);
        this.resolve && this.resolve();
      }, 200);
    });

    // Handle esc close
    if (escClosable && type !== 'toasts') {
      this.bindKeydown = (e: KeyboardEvent) => e.keyCode === 27 && this.close();
      document.body.addEventListener('keydown', this.bindKeydown);
    }
  }

  /**
   * Set ok button or input element to be focused.
   */
  private setFocus(): void {
    const { type, options, modal } = this;
    const $btnOk = modal.querySelector('.btn-ok');
    const $input = modal.querySelector('input');
    type === 'prompt' ? $input.focus() : options.btnFocus && ($btnOk as HTMLElement).focus();
  }

  /**
   * Close modal and remove it from DOM.
   */
  private close(): void {
    const { modal, container, resolve, reject } = this;
    // animation for close using css
    modal.classList.remove('alerty-show');
    modal.classList.add('alerty-hide');
    container.classList.remove('active');

    // enable body's scroll
    document.body.classList.remove('no-scrolling');

    setTimeout(() => {
      (container && container.parentNode) && container.parentNode.removeChild(container);
      // remove evet bind to body
      this.bindKeydown && document.body.removeEventListener('keydown', this.bindKeydown);
    }, 100);
  }
}
