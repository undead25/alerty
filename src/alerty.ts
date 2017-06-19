class Alerty {
  // static defaults params
  private defaults = {
    okLabel: '\u786e\u5b9a',
    cancelLabel: '\u53d6\u6d88',
    time: 2000
  }

  // html templates
  private template = `
    <div class="alerty-overlay" tabindex="-1"></div>
    <div class="alerty">
      <div class="alerty-title"></div>
      <div class="alerty-content">
        <p class="alerty-message"></p>
        <div class="alerty-prompt">
          <input type="text" placeholder="" value="">
          <div class="input-line"></div>
        </div>
      </div>
      <div class="alerty-action">
        <a class="btn-cancel"></a>
        <a class="btn-ok"></a>
      </div>
    </div>
  `.replace(/(^|\n)\s*/g, '');

  constructor() { }

  public alert() {

  }

  private open(type: string, content: string, opts: Object) {
    if (typeof document === 'undefined') {
      console.error('Alerty need doccument environment!');
      return;
    }

    const container = document.createElement('div');
    container.innerHTML = this.template;
    document.body.appendChild(container);

    // cache alerty element
    const modal = document.querySelector('.alerty');
    const overlay = document.querySelector('.alerty-overlay');
    const title = modal.querySelector('.alerty-title');
    const message = modal.querySelector('.alerty-message');
    const btnArea = modal.querySelector('.alerty-action');
    const btnOk = modal.querySelector('.btn-ok');
    const btnCancel = modal.querySelector('.btn-cancel');
    const prompt = modal.querySelector('.alerty-prompt');
    const input = prompt.querySelector('input');

    overlay.classList.add('active');
    modal.classList.add('alerty-show');

    message.innerHTML = content;
  }
}

export default Alerty;
