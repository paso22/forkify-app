import {
  addBookmark,
  getResultsForGivenPage,
  loadRecipe,
  loadSearchResults,
  removeBookmark,
  state,
  updateServings
} from './model';
import recipeView from './view/recipeView';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import searchView from './view/searchView';
import resultsView from './view/resultsView';
import paginationView from './view/paginationView';
import bookmarkView from './view/bookmarkView';

const controlRecipes = async function() {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner();
    resultsView.update(getResultsForGivenPage(state.search.page));
    bookmarkView.update(state.bookmarks);

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

const controlBookmark = function() {
  if (!state.recipe.bookmarked) {
    addBookmark();
  } else {
    removeBookmark();
  }

  recipeView.update(state.recipe);
  bookmarkView.render(state.bookmarks);
};

const controlFetchBookmarks = function() {
  bookmarkView.render(state.bookmarks);
}

function init() {
  bookmarkView.addHandlerFetchBookmarks(controlFetchBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServing(controlServings);
  recipeView.addHandlerBookmark(controlBookmark);
  searchView.addHandlerSearch(controlSearch);
  paginationView.addHandlerPagination(controlPagination);
}

init();