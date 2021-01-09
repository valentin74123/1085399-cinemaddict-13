import Observer from "../utils/observer.js";

export default class Films extends Observer {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(films) {
    this._films = films.slice();
    // this._defaultOrder = this._films.forEach((film) => film.id);
  }

  getFilms() {
    return this._films;
  }

  updateFilm(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting film`);
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  // addComment(updateType, update) {
  //   this._comments = [
  //     update,
  //     ...this._comments
  //   ];

  //   this._notify(updateType, update);
  // }

  // deleteComment(updateType, update) {
  //   const index = this._comments.findIndex((comment) => comment.id === update.id);

  //   if (index === -1) {
  //     throw new Error(`Can't delete unexisting comment`);
  //   }

  //   this._comments = [
  //     ...this._comments.slice(0, index),
  //     ...this._comments.slice(index + 1)
  //   ];

  //   this._notify(updateType);
  // }
}
