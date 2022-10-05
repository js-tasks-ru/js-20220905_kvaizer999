import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';
export default class SortableTable {
  static BACKEND_URL = 'https://course-js.javascript.ru';
  element;
  subElements = {};
  isLoading = false;
  offset = 15;
  start = 0;
  end = this.offset;

  constructor(headerConfig = [], {
    data = [], url = '', isSortedLocally = false, sorted = {
      id: 'title',
      order: 'asc'
    }
  } = {}) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.id = sorted.id;
    this.url = new URL(`${SortableTable.BACKEND_URL}/${url}`);
    this.order = sorted.order;
    this.isSortedLocally = isSortedLocally;
    this.render();
    this.addEventListeners();
    this.getData({});
  }

  async getData({field = this.id, order = this.order, start = 0, end = this.offset}) {
    this.isLoading = true;
    this.id = field;
    this.order = order;

    this.url.searchParams.set('_sort', field);
    this.url.searchParams.set('_order', order);
    this.url.searchParams.set('_start', start.toString());
    this.url.searchParams.set('_end', end.toString());

    try {
      const response = await fetch(this.url);
      if (response.ok) {
        this.isLoading = false;
        const data = await response.json();
        this.data = this.data.concat(data);
        this.addDataToTable(this.data);
      }
    } catch (err) {
      throw new Error(err.message);
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

  sort(field, order) {
    if (this.isSortedLocally) {
      this.data = this.sortOnClient(field, order);
      this.addDataToTable(this.data);
      return;
    }
    return this.sortOnServer(field, order);
  }

  addDataToTable(sortedData) {
    const allColumns = this.element.querySelectorAll('.sortable-table__cell[data-id]');
    const currentColumn = this.element.querySelector(`.sortable-table__cell[data-id=${this.id}]`);


    allColumns.forEach(column => {
      column.dataset.order = '';
    });

    currentColumn.dataset.order = this.order;

    this.subElements.body.innerHTML = this.getTableRows(sortedData);
  }

  async sortOnServer(field = this.id, order = this.order) {
    this.data = [];
    await this.getData({field, order});
    return this.data;
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
    this.start = 0;
    this.end = this.offset;

    const elem = event.target.closest('[data-sortable="true"]');

    if (elem.dataset.sortable === 'false') {
      return;
    }

    this.order = this.order === 'asc' ? 'desc' : 'asc';
    this.sort(elem.dataset.id, this.order);
  };

  infinityScrollHandler = async () => {
    const block = this.subElements.body;
    const contentHeight = block.offsetHeight;
    const yOffset = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const y = yOffset + windowHeight;
    if (y >= contentHeight && !this.isLoading) {
      this.start += this.offset;
      this.end += this.offset;

      await this.getData({
        field: this.id,
        sort: this.order,
        start: this.start,
        end: this.end
      });
      console.log(this.data);
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
    document.removeEventListener('scroll', this.infinityScrollHandler);
  }
}


