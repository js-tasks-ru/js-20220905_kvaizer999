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
            <div class='column-chart__container'>
                <div class='column-chart__header'>${this.formatHeading ? this.formatHeading(this.value) : this.value}</div>
                <div class='column-chart__chart'>${this.getDataList(data)}</div>
            </div>
        </div>
    `;

    if (!(this.data.length && this.value)) {
      const chartContainer = element.querySelector('.column-chart__container');
      const columnChart = element.querySelector('.column-chart');

      columnChart.classList.remove('.column-chart');
      columnChart.classList.add('column-chart_loading');

      const skeleton = document.createElement('img');
      skeleton.src = './charts-skeleton.svg';
      skeleton.alt = 'skeleton';

      chartContainer.append(skeleton);
    }
    return element.firstElementChild;
  }

  update(newData) {
    this.data = newData;
    const chart = this.element.querySelector('.column-chart__chart');
    chart.innerHTML = `${this.getDataList(newData)}`;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    delete this;
  }
}
