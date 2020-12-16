import SortView from "../view/sort.js";
import ListView from "../view/list.js";
import ListEmptyView from "../view/list-empty.js";
import FilmsListView from "../view/films-list.js";
import FilmsListContainerView from "../view/film-list-container.js";
// import FilmCardView from "../view/film-card.js";
import LoadMoreButtonView from "../view/load-more-button.js";
import CardPresenter from "./film-card.js";
import {updateItem, sortFilmDateUp, sortFilmRating} from "../utils/common.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {SortType} from "../utils/const.js";

const FILM_COUNT_PER_STEP = 5;


export default class FilmList {
  constructor(siteMainElement, siteFooterElement) {
    this._siteMainElement = siteMainElement;
    this._siteFooterElement = siteFooterElement;

    this.renderFilmCount = FILM_COUNT_PER_STEP;
    this._cardPresenter = {};
    this._currentSortType = SortType.DEFAULT;

    this._sortComponent = new SortView();
    this._listComponent = new ListView();
    this._filmsListComponent = new FilmsListView();
    this._filmsListContainerView = new FilmsListContainerView();
    this._listEmptyComponent = new ListEmptyView();

    this._loadMoreButtonComponent = new LoadMoreButtonView();

    this._handelFilmChange = this._handelFilmChange.bind(this);
    this._handelModelChange = this._handelModelChange.bind(this);
    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(boardFilms, comments) {
    this._boardFilms = boardFilms.slice();
    this._comments = comments.slice();

    this._sourceBoardFilms = boardFilms.slice();

    this._renderSort();

    render(this._siteMainElement, this._listComponent, RenderPosition.BEFOREEND);
    render(this._listComponent, this._filmsListComponent, RenderPosition.AFTERBEGIN);
    render(this._filmsListComponent, this._filmsListContainerView, RenderPosition.BEFOREEND);

    this._renderBoard();
  }

  _handelModelChange() {
    Object
      .values(this._cardPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handelFilmChange(updatedFilm) {
    this._boardFilms = updateItem(this._boardFilms, updatedFilm);
    this._cardPresenter[updatedFilm.id].init(updatedFilm, this._comments);
  }

  _sortFilms(sortType) {
    switch (sortType) {
      case SortType.DATE:
        this._boardFilms.sort(sortFilmDateUp);
        break;
      case SortType.RATING:
        this._boardFilms.sort(sortFilmRating);
        break;
      default:
        this._boardFilms = this._sourceBoardFilms.slice();
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortFilms(sortType);
    this._clearFilmsList();
    this._renderFilmsList();
  }

  _renderSort() {
    render(this._siteMainElement, this._sortComponent, RenderPosition.BEFOREEND);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderPopup(film, comments) {
    const cardPresenter = new CardPresenter(this._filmsListContainerView, this._siteFooterElement, this._handelFilmChange, this._handelModelChange);
    cardPresenter.init(film, comments);
    this._cardPresenter[film.id] = cardPresenter;
  }


  _renderFilmCards(from, to) {
    this._boardFilms
      .slice(from, to)
      .forEach((film) => {

        this._renderPopup(film, this._comments);
      });
  }

  _renderListEmpty() {
    render(this._siteMainElement, this._listEmptyComponent, RenderPosition.BEFOREEND);
  }

  _handleLoadMoreButtonClick() {
    this._renderFilmCards(this.renderFilmCount, this.renderFilmCount + FILM_COUNT_PER_STEP);
    this.renderFilmCount += FILM_COUNT_PER_STEP;

    if (this.renderFilmCount >= this._boardFilms.length) {
      remove(this._loadMoreButtonComponent);
    }
  }

  _renderLoadMoreButton() {
    render(this._filmsListComponent, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);

    this._loadMoreButtonComponent.setClickHandler(this._handleLoadMoreButtonClick);
  }


  _clearFilmsList() {
    Object
      .values(this._cardPresenter)
      .forEach((presenter) => presenter.destroy());
    this._cardPresenter = {};
    this.renderFilmCount = FILM_COUNT_PER_STEP;
    remove(this._loadMoreButtonComponent);
  }

  _renderFilmsList() {
    this._renderFilmCards(0, Math.min(this._boardFilms.length, FILM_COUNT_PER_STEP));

    if (this._boardFilms.length > FILM_COUNT_PER_STEP) {
      this._renderLoadMoreButton();
    }
  }

  _renderBoard() {
    if (this._boardFilms.every((film) => film.length)) {
      this._renderListEmpty();
      return;
    }

    this._renderFilmsList();
  }
}
