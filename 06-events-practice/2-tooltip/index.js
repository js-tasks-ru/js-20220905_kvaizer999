class Tooltip {
  constructor() {
    this.render();
    this.addEventListeners();
  }

  static stringParser() {
    const divs = document.querySelectorAll('[data-tooltip]');
    [...divs].forEach(div => {
      const children = div.childNodes;
      [...children].forEach(item => {
        const spans = [];
        if (item.nodeType === Node.TEXT_NODE) {
          item.data.split(' ').forEach(word => {
            if (word.trim() !== '') {
              const span = document.createElement('span');
              span.innerHTML = `${word} `;
              spans.push(span);
            }
          });
          item.replaceWith(...spans);
        }
      });
    });
  }

  initialize() {
    Tooltip.stringParser();
  }

  template() {
    return `
       <div class="tooltip" hidden></div>
    `;
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.template();
    this.element = wrapper.firstElementChild;
    const container = document.querySelector('[data-tooltip]');
    container.append(this.element);
  }

  onMouseOverHandler = (event) => {
    if (event.target.tagName === 'SPAN') {
      this.element.hidden = false;
      this.element.innerHTML = event.target.innerText;
      this.element.style.left = (event.clientX + 10) + 'px';
      this.element.style.top = (event.clientY + 10) + 'px';
    } else {
      this.element.hidden = true;
    }
  };

  onMouseLeaveHandler = () => {
    this.element.hidden = true;
    this.element.innerHTML = '';
  }

  addEventListeners() {
    const container = document.querySelector('[data-tooltip]');
    container.addEventListener('mouseover', this.onMouseOverHandler);
    container.addEventListener('mouseleave', this.onMouseLeaveHandler);
  }

  removeEventListeners() {
    const container = document.querySelector('[data-tooltip]');
    container.removeEventListener('mouseover', this.onMouseOverHandler);
    container.removeEventListener('mouseleave', this.onMouseLeaveHandler);
  }

  remove() {
    this.element.remove();
    this.removeEventListeners();
  }

  destroy() {
    this.remove();
    this.element = null;
  }
}

export default Tooltip;

