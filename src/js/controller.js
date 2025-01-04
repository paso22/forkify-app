import { loadRecipe, loadSearchResults, state } from './model';
import recipeView from './view/recipeView';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import searchView from './view/searchView';
import resultsView from './view/resultsView';

if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async function() {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner();

    await loadRecipe(id);
    recipeView.render(state.recipe);

  } catch (err) {
    console.error(err);
    recipeView.renderError();
  }
};

const controlSearch = async function() {
  try {
    const query = searchView.getQuery();
    if (!query) return;

    resultsView.renderSpinner();
    await loadSearchResults(query);
    resultsView.render(state.search.result);
  } catch (err) {
    console.error(err);
    resultsView.renderError();
  }
};

function init() {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearch);
}

init();