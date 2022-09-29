import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable {
  static BACKEND_URL = 'https://course-js.javascript.ru';
  static offset = 30;

  element;
  subElements = {};

  constructor(headerConfig = [], {data = [], url = '', sorted = {id: 'title', order: 'asc'}} = {}) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.url = `${SortableTable.BACKEND_URL}/${url}`;
    this.id = sorted.id;
    this.order = sorted.order;
    this.isLoading = false;
    this.render();
    this.getData(this.id, this.order);
  }

  async getData({field = this.id, order = this.order, start = 0, end = 30}) {
    this.isLoading = true;
    this.id = field;
    this.order = order;
    this.start = +start;
    this.end = +end;

    const requestUrl = `${this.url}?_sort=${field}&_order=${order}&_start=${start}&_end=${end}`;
    try {
      const response = await fetch(requestUrl);
      if (response.ok) {
        this.isLoading = false;
        this.data = await response.json();
        this.addDataToTable(field, order);
      }
    } catch (err) {
      this.sortOnClient(field, order);
      throw new Error(err.message);
    }
  }

  sortOnSever({field = this.id, order}) {
    this.getData({field, order});
  }

  async sort({field = this.id, order}) {
    try {
      await this.sortOnSever({field, order});
    } catch (e) {
      this.sortOnClient(field, order);
      throw new Error('Network issue');
    }
  }

  sortOnClient(field, order) {
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

  addDataToTable(field, order) {
    // const sortedData = this.sortData(field, order);
    const allColumns = this.element.querySelectorAll('.sortable-table__cell[data-id]');
    const currentColumn = this.element.querySelector(`.sortable-table__cell[data-id=${field}]`);


    allColumns.forEach(column => {
      column.dataset.order = '';
    });

    currentColumn.dataset.order = order;

    this.subElements.body.insertAdjacentHTML('beforeend', this.getTableRows(this.data));
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
    this.addEventListeners();
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
    this.sort({field: elem.dataset.id, order: this.order});
  };

  infinityScrollHandler = async () => {
    const block = this.subElements.body;
    const contentHeight = block.offsetHeight;
    const yOffset = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const y = yOffset + windowHeight;
    if (y >= contentHeight && !this.isLoading) {
      console.log('123');
      await this.getData({
        field: this.id,
        sort: this.sort,
        start: this.start + SortableTable.offset,
        end: this.end + SortableTable.offset
      });
    }
  }

  addEventListeners() {
    const header = this.element.querySelector('.sortable-table__header[data-element]');
    header.addEventListener('click', this.onHeaderClickHandler);
    document.addEventListener('scroll', this.infinityScrollHandler);
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

