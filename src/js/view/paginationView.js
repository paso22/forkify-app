import icons from 'url:../../img/icons.svg';
import { View } from './view';

class PaginationView extends View {
  _parentEl = document.querySelector('.pagination');

  _renderMarkup() {
    const currPage = this._data.page;
    const numberOfPages = Math.ceil(this._data.result.length / this._data.resultsPerPage);

    //page 1 and other
    if (currPage === 1 && numberOfPages > 1) {
      return this._renderNextPage(currPage);
    }

    // last page
    if (currPage > 1 && currPage === numberOfPages) {
      return this._renderPreviousPage(currPage);
    }

    // middle page
    if (currPage > 1 && numberOfPages > 1 && currPage < numberOfPages) {
      return `${this._renderPreviousPage(currPage)} ${this._renderNextPage(currPage)}`;
    }
  }

  _renderNextPage(currPage) {
    return `<button data-goto="${currPage + 1}" class="btn--inline pagination__btn--next">
            <span>Page ${currPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`;
  }

  _renderPreviousPage(currPage) {
    return `<button data-goto="${currPage - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currPage - 1}</span>
          </button>`;
  }

  addHandlerPagination(handler) {
    this._parentEl.addEventListener('click', function(e) {
      e.preventDefault();
      const goToPage = +e.target.closest('.btn--inline').dataset.goto;
      handler(goToPage);
    });
  }
}

export default new PaginationView();