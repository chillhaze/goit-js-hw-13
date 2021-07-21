// const axios = require('axios');

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '22569115-02a432c6c1c62bbb3a59801b7';
const ITEMS_PER_PAGE = 40;

function fetchImages(userInput) {
  const url = `${BASE_URL}/?key=${KEY}&q=${userInput}&image_type=photo&orientation=horizontal&safesearch=true&page=1&per_page=${ITEMS_PER_PAGE}`;

  return fetch(url).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    // console.log(response);
    return response.json();
  });
}

// async function fetchImages(userInput) {
//   try {
//     const url = `${BASE_URL}/?key=${KEY}&q=${userInput}&image_type=photo&orientation=horizontal&safesearch=true`;
//     const response = await axios.get(url);
//     console.log(response);
//   } catch (error) {
//     console.error(error);
//   }
// }

export default { fetchImages };
