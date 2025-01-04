import { getResultsForGivenPage, loadRecipe, loadSearchResults, state, updateServings } from './model';
import recipeView from './view/recipeView';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import searchView from './view/searchView';
import resultsView from './view/resultsView';
import paginationView from './view/paginationView';

if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async function() {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner();
    resultsView.update(getResultsForGivenPage(state.search.page));

    await loadRecipe(id);
    recipeView.render(state.recipe);

  } catch (err) {
    console.error(err);
    recipeView.renderError();
  }
};

const controlServings = function(newServing) {
  updateServings(newServing);
  recipeView.update(state.recipe);
};

const controlSearch = async function() {
  try {
    const query = searchView.getQuery();
    if (!query) return;

    resultsView.renderSpinner();
    await loadSearchResults(query);

    resultsView.render(getResultsForGivenPage(state.search.page));
    paginationView.render(state.search);
  } catch (err) {
    console.error(err);
    resultsView.renderError();
  }
};

const controlPagination = function(goToPage) {
  resultsView.render(getResultsForGivenPage(goToPage));
  paginationView.render(state.search);
};

function init() {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServing(controlServings);
  searchView.addHandlerSearch(controlSearch);
  paginationView.addHandlerPagination(controlPagination);
}

init();