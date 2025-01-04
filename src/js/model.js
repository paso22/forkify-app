import { API_URL, RES_PER_PAGE } from './config';
import { getJSON } from './helper';

export const state = {
  recipe: {},
  search: {
    query: '',
    result: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE
  }
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