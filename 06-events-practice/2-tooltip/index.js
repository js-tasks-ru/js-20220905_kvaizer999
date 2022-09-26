class Tooltip {
  constructor() {
    this.addEventListeners();
  }

  initialize() {
    this.render();
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
    document.body.append(this.element);
  }

  onMouseOverHandler = (event) => {
    if (event.target.tagName === 'DIV') {
      this.element.hidden = false;
      this.element.innerHTML = event.target.dataset.tooltip;
    } else {
      this.element.hidden = true;
    }
  };

  onMouseMoveHandler = (event) => {
    if (event.target.tagName === 'DIV') {
      this.element.style.left = (event.clientX + 10) + 'px';
      this.element.style.top = (event.clientY + 10) + 'px';
    }
  };

  onMouseLeaveHandler = () => {
    this.element.hidden = true;
    this.element.innerHTML = '';
  };

  addEventListeners() {
    const containers = document.querySelectorAll('[data-tooltip]');
    console.log(containers);
    [...containers].forEach(item => {
      item.addEventListener('mouseover', this.onMouseOverHandler);
      item.addEventListener('mousemove', this.onMouseMoveHandler);
      item.addEventListener('mouseleave', this.onMouseLeaveHandler);
    });
  }

  removeEventListeners() {
    const containers = document.querySelectorAll('[data-tooltip]');
    console.log(containers);
    [...containers].forEach(item => {
      item.removeEventListener('mouseover', this.onMouseOverHandler);
      item.removeEventListener('mousemove', this.onMouseMoveHandler);
      item.removeEventListener('mouseleave', this.onMouseLeaveHandler);
    });
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

