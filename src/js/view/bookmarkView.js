import { View } from './view';
import previewView from './previewView';

class BookmarkView extends View {
  _parentEl = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it ;)';

  _renderMarkup() {
    return this._data.map((bookmark) => previewView.render(bookmark, false)).join('');
  }

  addHandlerFetchBookmarks(handler) {
    window.addEventListener('load', handler);
  }
}

export default new BookmarkView();