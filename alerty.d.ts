export = Alerty;
export as namespace Alerty;
declare namespace Alerty {
  // function alert(msg: string, opts: Options): Promise<any>;

  interface Options {
    title?: string;
    okLabel?: string;
    cancelLabel?: string;
    duration?: number;
    maskClosable?: boolean;
    escClosable?: boolean;
    btnFocus?: boolean;
    inputType?: string;
    inputPlaceholder?: string;
    // default value of input
    inputValue?: string;
    toastPlace?: string;
    toastDuration?: number;
  }

  type ModalType = 'alert' | 'confirm' | 'prompt' | 'toasts';
}