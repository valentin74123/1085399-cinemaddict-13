import FilmCardView from "../view/film-card.js";
import PopupView from "../view/popup.js";
import {generateComment} from "../mock/comments.js";
import CommentsModel from "../model/comments.js";
import {render, RenderPosition, replace, appendChild, removeChild, remove} from "../utils/render.js";
import {UserAction, UpdateType} from "../utils/const.js";
import {getRandomInteger} from "../utils/common.js";

const COMMENT_COUNT_MAX = 5;
const COMMENT_COUNT_MIN = 1;

const Mode = {
  CARD: `CARD`,
  POPUP: `POPUP`
};

export default class Card {
  constructor(filmsListContainerView, siteFooterElement, changeData, changeMode) {
    this._filmsListContainerView = filmsListContainerView;
    this._siteFooterElement = siteFooterElement;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._filmCardComponent = null;
    this._popupComponent = null;
    this._mode = Mode.CARD;

    this._hendleCardClick = this._hendleCardClick.bind(this);
    this._hendlePopupClick = this._hendlePopupClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);


    this._hendleAddWatchlisClick = this._hendleAddWatchlisClick.bind(this);
    this._hendleWatchedClick = this._hendleWatchedClick.bind(this);
    this._hendleFavoriteClick = this._hendleFavoriteClick.bind(this);

    //

    this._hendleAddWatchlisPopupClick = this._hendleAddWatchlisPopupClick.bind(this);
    this._hendleWatchedPopupClick = this._hendleWatchedPopupClick.bind(this);
    this._hendleFavoritePopupClick = this._hendleFavoritePopupClick.bind(this);

    const comments = new Array(getRandomInteger(COMMENT_COUNT_MIN, COMMENT_COUNT_MAX)).fill().map(generateComment);
    this._commentsModel = new CommentsModel();
    this._commentsModel.setComments(comments);

    this._handleDeleteCommentClick = this._handleDeleteCommentClick.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._commentsModel.addObserver(this._handleModelEvent);
  }

  init(film) {
    this._film = film;


    this._comments = this._commentsModel.getComments();


    this._prevFilmCardComponent = this._filmCardComponent;
    this._prevPopupComponent = this._popupComponent;

    this._filmCardComponent = new FilmCardView(film);
    this._popupComponent = new PopupView(film, this._comments);
    this._body = document.querySelector(`body`);


    this._filmCardComponent.setPosterClickHandler(this._hendleCardClick);
    this._filmCardComponent.setTitleClickHandler(this._hendleCardClick);
    this._filmCardComponent.setCommentsClickHandler(this._hendleCardClick);
    this._popupComponent.setCloseButtonClickHandler(this._hendlePopupClick);

    this._popupComponent.setDeleteClickHandler(this._handleDeleteCommentClick); //

    this._filmCardComponent.setAddWatchlisClickHandler(this._hendleAddWatchlisClick);
    this._filmCardComponent.setWatchedClickHandler(this._hendleWatchedClick);
    this._filmCardComponent.setFavoriteClickHandler(this._hendleFavoriteClick);

    //

    this._popupComponent.setAddWatchlisClickHandler(this._hendleAddWatchlisPopupClick);
    this._popupComponent.setWatchedClickHandler(this._hendleWatchedPopupClick);
    this._popupComponent.setFavoriteClickHandler(this._hendleFavoritePopupClick);

    if (this._prevFilmCardComponent === null || this._prevPopupComponent === null) {
      render(this._filmsListContainerView, this._filmCardComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.CARD) {
      replace(this._filmCardComponent, this._prevFilmCardComponent);
    }

    if (this._mode === Mode.POPUP) {
      replace(this._filmCardComponent, this._prevFilmCardComponent);
      replace(this._popupComponent, this._prevPopupComponent);
    }

    remove(this._prevFilmCardComponent);
    remove(this._prevPopupComponent);
  }

  destroy() {
    remove(this._filmCardComponent);
    remove(this._popupComponent);
  }

  resetView() {
    if (this._mode !== Mode.CARD) {
      this._closePopup();
    }
  }


  _openPopup() {
    render(this._siteFooterElement, this._popupComponent, RenderPosition.BEFOREEND);
    appendChild(this._siteFooterElement, this._popupComponent);
    this._body.classList.add(`hide-overflow`);
    this._changeMode();
    this._mode = Mode.POPUP;
  }

  _closePopup() {
    removeChild(this._siteFooterElement, this._popupComponent);
    this._body.classList.remove(`hide-overflow`);
    this._mode = Mode.CARD;
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._closePopup();
      document.removeEventListener(`keydown`, this._escKeyDownHandler);
    }
  }

  _hendleCardClick() {
    this._openPopup();
    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }


  _hendleAddWatchlisClick() {
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        Object.assign(
            {},
            this._film,
            {
              isAddToWatchlist: !this._film.isAddToWatchlist
            }
        )
    );
  }

  _hendleWatchedClick() {
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        Object.assign(
            {},
            this._film,
            {
              isWatched: !this._film.isWatched
            }
        )
    );
  }

  _hendleFavoriteClick() {
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        Object.assign(
            {},
            this._film,
            {
              isFavorite: !this._film.isFavorite
            }
        )
    );
  }

  //

  _hendleAddWatchlisPopupClick() {
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.PATCH,
        Object.assign(
            {},
            this._film,
            {isAddToWatchlist: !this._film.isAddToWatchlist}
        )
    );
  }

  _hendleWatchedPopupClick() {
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.PATCH,
        Object.assign(
            {},
            this._film,
            {isWatched: !this._film.isWatched}
        )
    );
  }

  _hendleFavoritePopupClick() {
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.PATCH,
        Object.assign(
            {},
            this._film,
            {isFavorite: !this._film.isFavorite}
        )
    );
  }

  // _handleAddCommentClick() {

  // }

  _handleDeleteCommentClick(commentId) {
    const comments = this._commentsModel.getComments().filter((el) => String(el.id) === String(commentId))[0];
    this._handleModelEvent(
        UserAction.DELETE_COMMENT,
        UpdateType.PATCH,
        comments
    );
  }

  _handleModelEvent(userAction, updateType, update) {
    switch (userAction) {
      case UserAction.ADD_COMMENT: {
        this._popupComponent.addComment(updateType, update);
        break;
      }
      case UserAction.DELETE_COMMENT: {
        this._commentsModel.deleteComment(updateType, update);
        break;
      }
    }
  }

  _hendlePopupClick() {
    this._closePopup();
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }
}
