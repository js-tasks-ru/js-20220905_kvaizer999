
export default class ColumnChart {
  constructor(props = {}) {
    this.data = props.data || [];
    this.label = props.label || '';
    this.value = props.value || 0;
    this.formatHeading = props.formatHeading;
    this.link = props.link || '';
    this.chartHeight = 50;
    this.element = this.render();
  }

  getColumnProps(num) {
    const maxValue = Math.max(...this.data);
    const scale = this.chartHeight / maxValue;
    const percent = (num / maxValue * 100).toFixed(0) + '%';
    const value = String(Math.floor(num * scale));
    return [value, percent];
  }

  getDataList(data = this.data) {
    return data.map(item => {
      const style = `--value:${this.getColumnProps(item)[0]}`;
      const percent = this.getColumnProps(item)[1];
      return `<div style=${style} data-tooltip=${percent}></div>`;
    }).join('');
  }

  render(data = this.data) {
    const element = document.createElement('div');

    element.innerHTML = `
        <div class='column-chart' style="--chart-height: ${this.chartHeight}">
            <div class='column-chart__title'>
                ${this.label}
                ${this.link && `<a class="column-chart__link" href=${this.link}>View all</a>`}
            </div>
            ${(this.data.length && this.value) ? `<div class='column-chart__container'>
                <div class='column-chart__header'>${this.formatHeading ? this.formatHeading(this.value) : this.value}</div>
                <div class='column-chart__chart'>${this.getDataList(data)}</div>
            </div>` : `<div class="column-chart_loading"><img src='./charts-skeleton.svg' alt="skeleton"/></div>`}
        </div>
    `;

    return element.firstElementChild;
  }

  update(newData) {
    this.data = newData;
    const chart = this.element.querySelector('.column-chart__chart');
    chart.innerHTML = `${this.getDataList(newData)}`;
  }

  remove() {
    this.element.parentElement.remove();
  }

  destroy() {
    delete this;
  }
}
