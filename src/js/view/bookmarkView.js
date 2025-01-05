import { View } from './view';
import previewView from './previewView';

class BookmarkView extends View {
  _parentEl = document.querySelector('.bookmarks__list');

  _renderMarkup() {
    return this._data.map((bookmark) => previewView.render(bookmark, false)).join('');
  }
}

export default new BookmarkView();