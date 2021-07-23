import axios from 'axios';

export default class ImagesApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.itemsPerPage = 40;
    this.orientation = 'horizontal';
  }

  fetchImages() {
    const BASE_URL = 'https://pixabay.com/api/';
    const API_KEY = '22569115-02a432c6c1c62bbb3a59801b7';

    const url = `${BASE_URL}/?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=${this.orientation}&safesearch=true&page=${this.page}&per_page=${this.itemsPerPage}`;
    // Вариант через fetch()
    // return fetch(url).then(response => {
    //   if (!response.ok) {
    //     throw new Error(response.status);
    //   }
    //   this.incrementPage();
    //   return response.json();
    // });

    return axios
      .get(url)
      .then(response => {
        this.incrementPage();
        console.log(response.data.totalHits);
        return response.data;
      })
      .catch(error => console.log(error.message));
  }

  resetPage() {
    this.page = 1;
  }

  incrementPage() {
    this.page += 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
