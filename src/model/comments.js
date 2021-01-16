import Observer from "../utils/observer.js";

export default class Comments extends Observer {
  constructor() {
    super();
    this._comments = [];
  }

  setComments(comments) {
    this._comments = comments.slice();
  }

  getComments() {
    return this._comments;
  }

  addComment(updateType, update) {
    this._comments = [
      update,
      ...this._comments
    ];

    this._notify(updateType, update);
  }

  deleteComment(updateType, update) {
    const index = this._comments.findIndex((comment) => comment.id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting comment`);
    }

    this._comments = [
      ...this._comments.slice(0, index),
      ...this._comments.slice(index + 1)
    ];


    this._notify(updateType);
  }

  // updateComments(actionType, updateType, update) {
  //   switch (actionType) {
  //     case UserAction.ADD_COMMENT:
  //       this._filmsModel.addComment(updateType, update);
  //       break;
  //     case UserAction.DELETE_COMMENT:
  //       this._filmsModel.deleteComment(updateType, update);
  //       break;
  //   }

  //   this._notify();
  // }
}
