import refs from './refs';
import API from './fetchImages';
import Notiflix from 'notiflix';
Notiflix.Notify.init({ position: 'right-bottom' });
import imgCardTpl from '../partials/card.hbs';
// console.log(refs.searchForm);
// console.log(refs.searchInput);
// console.log(refs.submitBtn);
hideLoadMoreBtn();
refs.searchForm.addEventListener('submit', onSubmitBtnPush);

function onSubmitBtnPush(e) {
  e.preventDefault();

  clearPage();
  hideLoadMoreBtn();
  const form = e.currentTarget;
  const searchQuery = form.elements.searchQuery.value;

  API.fetchImages(searchQuery)
    .then(images => {
      if (images.totalHits < 1) {
        onSearchError();
        return;
      }
      console.dir(refs.submitBtn);
      return renderPage(images);
    })
    .catch(err => {
      onSearchError(err);
    })
    .finally(() => form.reset());
}

function renderPage(items) {
  // let { webformatURL, largeImageURL, tags, likes, views, comments, downloads } = items;
  const markup = imgCardTpl(items.hits);

  refs.galleryContainer.insertAdjacentHTML('beforeend', markup);
  refs.loadMoreBtn.classList.add('visible');
}

function onSearchError(error) {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.',
  );
  clearPage();
  hideLoadMoreBtn();
}

function clearPage() {
  refs.galleryContainer.innerHTML = '';
}

function hideLoadMoreBtn() {
  refs.loadMoreBtn.classList.remove('visible');
}
