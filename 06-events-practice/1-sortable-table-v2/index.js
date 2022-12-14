export default class SortableTable {
  element;
  subElements = {};

  constructor(headerConfig = [], {data = [], sorted = {}} = {}) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.id = sorted.id;
    this.order = sorted.order;
    this.render();
    this.sort(this.id, this.order);
    this.addEventListeners();
  }

  sortData(field, order) {
    const arr = [...this.data];
    const column = this.headerConfig.find(item => item.id === field);
    const {sortType} = column;
    const directions = {asc: 1, desc: -1};
    const direction = directions[order];

    return arr.sort((a, b) => {
      switch (sortType) {
      case 'number':
        return direction * (a[field] - b[field]);

      case 'string':
        return direction * a[field].localeCompare(b[field], ['ru', 'en']);

      default:
        return direction * (a[field] - b[field]);
      }
    });
  }

  sort(field, order) {
    const sortedData = this.sortData(field, order);
    const allColumns = this.element.querySelectorAll('.sortable-table__cell[data-id]');
    const currentColumn = this.element.querySelector(`.sortable-table__cell[data-id=${field}]`);


    allColumns.forEach(column => {
      column.dataset.order = '';
    });

    currentColumn.dataset.order = order;

    this.subElements.body.innerHTML = this.getTableRows(sortedData);
  }

  getTableHeader() {
    return `
        <div data-element="header" class="sortable-table__header sortable-table__row">
            ${this.headerConfig.map(item => this.getHeaderCell(item)).join('')}
        </div>
`;
  }

  getHeaderCell({id, title, sortable}) {
    return `
        <div data-id=${id} data-sortable=${sortable} class="sortable-table__cell" >
            <span>${title}</span>
            <span data-element="arrow" class="sortable-table__sort-arrow">
                <span class="sort-arrow"></span>
            </span>
        </div>
    `;
  }

  getTableBody() {
    return `
        <div data-element="body" class="sortable-table__body">
            ${this.getTableRows(this.data)}
        </div>
    `;
  }

  getTableRows(data = []) {
    return data.map(item => {
      return `
        <a href="/products/${item.id}" class="sortable-table__row">
            ${this.getTableRow(item)}
        </a>
      `;
    }).join('');
  }

  getTableRow(item) {
    const cells = this.headerConfig.map(({id, template}) => {
      return {id, template};
    });

    return cells.map(({id, template}) => {
      return template ? template(item[id]) : `<div class="sortable-table__cell">${item[id]}</div>`;
    }).join('');
  }

  getTable() {
    return `
       <div class="sortable-table">
           ${this.getTableHeader()}
           ${this.getTableBody()}
       </div>
    `;
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.getTable();
    const element = wrapper.firstElementChild;
    this.element = element;
    this.subElements = this.getSubElements(element);
  }

  getSubElements(element) {
    const result = {};
    const elements = element.querySelectorAll('[data-element]');
    for (const subElement of elements) {
      const name = subElement.dataset.element;
      result[name] = subElement;
    }

    return result;
  }

  onHeaderClickHandler = (event) => {
    const elem = event.target.closest('[data-sortable="true"]');
    
    if (elem.dataset.sortable === 'false') {
      return;
    }

    this.order = this.order === 'asc' ? 'desc' : 'asc';
    this.sort(elem.dataset.id, this.order);
  }

  addEventListeners() {
    const header = this.element.querySelector('.sortable-table__header[data-element]');
    header.addEventListener('click', this.onHeaderClickHandler);
  }


  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
  }
}
