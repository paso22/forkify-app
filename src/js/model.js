import { API_URL, RES_PER_PAGE } from './config';
import { getJSON } from './helper';

export const state = {
  recipe: {},
  search: {
    query: '',
    result: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE
  },
  bookmarks: []
};

export const loadRecipe = async function(id) {
  try {
    const data = await getJSON(`${API_URL}/${id}`);

    const { recipe } = data.data;
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients
    };

    state.recipe.bookmarked = state.bookmarks.some(b => b.id === state.recipe.id);

  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async function(query) {
  try {
    state.query = query;
    const data = await getJSON(`${API_URL}?search=${query}`);

    state.search.result = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url
      };
    });
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};

export const getResultsForGivenPage = function(page) {
  state.search.page = page;

  const startPage = (page - 1) * state.search.resultsPerPage;
  const endPage = page * state.search.resultsPerPage;
  return state.search.result.slice(startPage, endPage);
};

export const updateServings = function(newServing) {
  const oldServing = state.recipe.servings;
  state.recipe.servings = newServing;

  state.recipe.ingredients.forEach(ing => {
    ing.quantity = ing.quantity * (newServing / oldServing);
  });
};

const updateBookmarkStorage = function() {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function() {
  state.recipe.bookmarked = true;
  state.bookmarks.push(state.recipe);
  updateBookmarkStorage();
};

export const removeBookmark = function() {
  state.recipe.bookmarked = false;
  const index = state.bookmarks.findIndex(b => b.id === state.recipe.id);
  state.bookmarks.splice(index, 1);
  updateBookmarkStorage();
};

const init = function() {
  const bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
  if (bookmarks) state.bookmarks = bookmarks;
};

init();