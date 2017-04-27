import { addClass } from './util';

class Alerty {
  constructor() {
    const a: HTMLElement = document.getElementById('test');
    addClass(a, 'abc');
  }

  public a() {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, 3000, 'done');
    });
  }
}

export default Alerty;

