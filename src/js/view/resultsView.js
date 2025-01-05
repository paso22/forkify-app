import { View } from './view';
import previewView from './previewView';

class ResultsView extends View {
  _parentEl = document.querySelector('.results');
  _errorMessage = 'No recipe found for your query! Please try again';

  _renderMarkup() {
    return this._data.map((res) => previewView.render(res, false)).join('');
  }
}

export default new ResultsView();