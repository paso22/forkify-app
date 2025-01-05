import { API_REQUEST_KEY, API_URL, RES_PER_PAGE } from './config';
import { AJAX, getJSON, sendJSON } from './helper';

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
    const data = await AJAX(`${API_URL}/${id}?key=${API_REQUEST_KEY}`);

    state.recipe = getRecipeObject(data);

    state.recipe.bookmarked = state.bookmarks.some(b => b.id === state.recipe.id);

  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async function(query) {
  try {
    state.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${API_REQUEST_KEY}`);

    state.search.result = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key })
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

export const uploadRecipe = async function(newRecipe) {
  const ingredients = Object.entries(newRecipe)
    .filter(entry => entry[0].startsWith('ingredient')
      && entry[1] !== '')
    .map(ing => {
      const ingArr = ing[1].replaceAll(' ', '').split(',');
      if (ingArr.length !== 3) throw new Error('Wrong ingredient format!');

      const [quantity, unit, description] = ingArr;

      return {
        quantity: quantity ? +quantity : null,
        unit,
        description
      };
    });

  // const newRecipeArr = Object.entries(newRecipe);
  // const ingredients =
  //   newRecipeArr.filter(ing => (ing[0].startsWith('ingredient') && ing[1] !== ''))
  //     .map(ing => ing[1]);
  // console.log(ingredients);
  //
  // const ingredientsForPOST = [];
  //
  // ingredients.forEach(ing => {
  //   const currIngArr = ing.split(',');
  //
  //   ingredientsForPOST.push(
  //     {
  //       quantity: currIngArr[0],
  //       unit: currIngArr[1],
  //       description: currIngArr[2]
  //     }
  //   );
  // });

  const recipe = {
    title: newRecipe.title,
    source_url: newRecipe.sourceUrl,
    image_url: newRecipe.image,
    publisher: newRecipe.publisher,
    cooking_time: +newRecipe.cookingTime,
    servings: +newRecipe.servings,
    ingredients
  };

  const addedRecipe = await AJAX(`${API_URL}?key=${API_REQUEST_KEY}`, recipe);
  state.recipe = getRecipeObject(addedRecipe);
  console.log(state.recipe);
  addBookmark();
};

const getRecipeObject = function(data) {
  const { recipe } = data.data;

  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key })
  };
};

const init = function() {
  const bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
  if (bookmarks) state.bookmarks = bookmarks;
};

init();