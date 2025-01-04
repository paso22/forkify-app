import icons from 'url:../../img/icons.svg';

export class View {
  _data;

  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError();

    this._data = data;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', this._renderMarkup());
  }

  update(data) {
    this._data = data;
    const newMarkup = this._renderMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const currElements = Array.from(this._parentEl.querySelectorAll('*'));
    const newElements = Array.from(newDOM.querySelectorAll('*'));

    newElements.forEach(((newEl, i) => {
      const currEl = currElements[i];

      if (!newEl.isEqualNode(currEl) && newEl.firstChild?.nodeValue.trim() !== '') {
        currEl.textContent = newEl.textContent;
      }

      if (!newEl.isEqualNode(currEl)) {
        Array.from(newEl.attributes).forEach(
          attr => currEl.setAttribute(attr.name, attr.value));
      }
    }));
  }

  _clear() {
    this._parentEl.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>`;

    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>`;

    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }
}