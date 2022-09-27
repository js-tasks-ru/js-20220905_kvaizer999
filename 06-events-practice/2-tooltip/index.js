class Tooltip {
  static instance;
  element;

  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }

    Tooltip.instance = this;
  }

  initialize() {
    this.addEventListeners();
  }

  render(elem) {
    this.element = document.createElement('div');
    this.element.className = 'tooltip';
    this.element.innerHTML = elem;
    document.body.append(this.element);
  }

  onMouseOverHandler = (event) => {
    const closest = event.target.closest('[data-tooltip]');

    if (closest) {
      this.render(closest.dataset.tooltip);
      document.addEventListener('pointermove', this.onMouseMoveHandler);
    }

  };

  onMouseMoveHandler = (event) => {
    if (event.target.dataset.tooltip) {
      this.element.style.left = (event.clientX + 10) + 'px';
      this.element.style.top = (event.clientY + 10) + 'px';
    }
  };

  onMouseLeaveHandler = (event) => {
    if (event.target.dataset.tooltip) {
      this.remove();
      document.removeEventListener('pointermove', this.onMouseMoveHandler);
    }
  };

  addEventListeners() {
    document.addEventListener('pointerover', this.onMouseOverHandler);
    document.addEventListener('pointerout', this.onMouseLeaveHandler);
  }

  removeEventListeners() {
    document.removeEventListener('pointerover', this.onMouseOverHandler);
    document.removeEventListener('pointerout', this.onMouseLeaveHandler);
    document.removeEventListener('pointermove', this.onMouseMoveHandler);
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.removeEventListeners();
    this.element = null;
  }
}

export default Tooltip;

