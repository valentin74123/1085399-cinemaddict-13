import {createElement} from "../utils.js";

const createsListTemplate = () => {
  return `<section class="films">

  </section>`;
};

export default class List {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createsListTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
