class Alerty {
  // static defaults params
  private defaults = {
    okLabel: '\u786e\u5b9a',
    cancelLabel: '\u53d6\u6d88',
    time: 2000
  }

  public alert(content: string, opts: any = this.defaults) {
    opts = Object.assign({}, this.defaults, opts);
    return new Promise((resolve, reject) => {
      this.open('alert', content, opts).then(() => resolve());
    })
  }

  private open(type: string, content: string, opts: any) {
    if (typeof document === 'undefined') {
      console.error('Alerty need doccument environment!');
      return;
    }

    const $container = document.createElement('div');
    $container.classList.add('alerty-container');

    $container.innerHTML = this.renderDOM(type, content, opts);
    document.body.appendChild($container);
    document.body.classList.add('no-scrolling');

    // cache alerty element
    const $modal = document.querySelector('.alerty');
    const $title = $modal.querySelector('.alerty-title');
    const message = $modal.querySelector('.alerty-message');
    const btnArea = $modal.querySelector('.alerty-action');
    const $btnOk = $modal.querySelector('.btn-ok');
    // const btnCancel = $modal.querySelector('.btn-cancel');
    // const prompt = $modal.querySelector('.alerty-prompt');
    // const input = prompt.querySelector('input');

    $container.classList.add('active');
    $modal.classList.add('alerty-show');

    return new Promise((resolve, reject) => {
      $btnOk.addEventListener('click', () => {
        this.close($modal, $container);
        resolve();
      }, false);
      $container.addEventListener('click', () => {
        this.close($modal, $container);
        resolve();
      }, false);
    });
  }

  private close($modal: Element, $container: Element) {
    $modal.classList.remove('alerty-show');
    $modal.classList.add('alerty-hide');
    $container.classList.remove('active');
    document.body.classList.remove('no-scrolling');
    setTimeout(() => {
      ($container && $container.parentNode) && $container.parentNode.removeChild($container);
    }, 100);
  }

  private renderDOM(type: string, content: string, opts: any): string {
    const { title, okLabel, cancelLabel } = opts;

    const domBtnGroup = type === 'alert' ? `
      <a class="btn-ok">${okLabel}</a>
    ` : `
      <a class="btn-ok">${okLabel}</a>
      <a class="btn-cancel">${cancelLabel}</a>
    `;
    const domTitle = title ? `<div class="alerty-title">${title}</div>` : '';
    const domPrompt = type === 'prompt' ? `
      <div class="alerty-prompt">
        <input type="text" placeholder="" value="">
        <div class="input-line"></div>
      </div>
    ` : '';

    return `
      <div class="alerty">
        ${domTitle}
        <div class="alerty-content">
          <p class="alerty-message">${content}</p>
          ${domPrompt}
        </div>
        <div class="alerty-action">
          ${domBtnGroup}
        </div>
      </div>
    `.replace(/(^|\n)\s*/g, '');
  }
}

export default Alerty;
