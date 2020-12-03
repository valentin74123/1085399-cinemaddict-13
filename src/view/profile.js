import {createElement} from "../utils.js";

const ctreatesProfileTemplate = () => {
  return `<section class="header__profile profile">
    <p class="profile__rating">Sci-Fighter</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};

export default class Profile {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return ctreatesProfileTemplate();
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
