import {
  addBookmark,
  getResultsForGivenPage,
  loadRecipe,
  loadSearchResults,
  removeBookmark,
  state,
  updateServings, uploadRecipe
} from './model';
import recipeView from './view/recipeView';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import searchView from './view/searchView';
import resultsView from './view/resultsView';
import paginationView from './view/paginationView';
import bookmarkView from './view/bookmarkView';
import addRecipeView from './view/addRecipeView';
import { MODAL_CLOSE_TIMEOUT } from './config';

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

    const resultsData = getResultsForGivenPage(state.search.page);
    console.log(resultsData);
    resultsView.render(resultsData);
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
};

const controlShowRecipe = async function(newRecipe) {
  try {
    addRecipeView.renderSpinner();
    await uploadRecipe(newRecipe);

    addRecipeView.renderMessage();
    recipeView.render(state.recipe);
    bookmarkView.render(state.bookmarks);

    window.history.pushState(null, '', `#${state.recipe.id}`);

    setTimeout(function() {
      addRecipeView.toggleForm();
    }, MODAL_CLOSE_TIMEOUT * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }

  location.reload();
};

function init() {
  bookmarkView.addHandlerFetchBookmarks(controlFetchBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServing(controlServings);
  recipeView.addHandlerBookmark(controlBookmark);
  searchView.addHandlerSearch(controlSearch);
  paginationView.addHandlerPagination(controlPagination);
  addRecipeView.addHandlerUploadRecipe(controlShowRecipe);
}

init();