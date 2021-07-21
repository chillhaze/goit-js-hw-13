import refs from './refs';
import Notiflix from 'notiflix';
// Notiflix.Notify.init({ position: 'right-bottom' });

import ImagesApiService from './fetchImages';
import imgCardTpl from '../partials/card.hbs';

const imagesApiService = new ImagesApiService();

hideLoadMoreBtn();
refs.searchForm.addEventListener('submit', onSubmitBtnPush);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnPush);

function onSubmitBtnPush(e) {
  e.preventDefault();

  clearPage();
  hideLoadMoreBtn();

  const form = e.currentTarget;
  imagesApiService.query = form.elements.searchQuery.value.trim();
  imagesApiService.query = form.elements.searchQuery.value.trim();
  imagesApiService.resetPage();

  if (imagesApiService.searchQuery !== '') {
    imagesApiService
      .fetchImages()
      .then(images => {
        showNumberOfImages(images.totalHits);
        if (images.totalHits < 1) {
          onSearchError();
          return;
        } else if (images.totalHits <= imagesApiService.itemsPerPage) {
          onReachEndError();
          hideLoadMoreBtn();
          renderPage(images);
          return;
        }
        showLoadMoreBtn();
        return renderPage(images);
      })
      .catch(err => {
        onSearchError(err);
      })
      .finally(() => form.reset());
  } else {
    clearPage();
    onSearchError();
  }
}

function onLoadMoreBtnPush(e) {
  imagesApiService.fetchImages().then(images => {
    if (images.hits.length < imagesApiService.itemsPerPage) {
      onReachEndError();
      hideLoadMoreBtn();
    }
    return renderPage(images);
  });
}

function renderPage(items) {
  // let { webformatURL, largeImageURL, tags, likes, views, comments, downloads } = items;
  const markup = imgCardTpl(items.hits);

  refs.galleryContainer.insertAdjacentHTML('beforeend', markup);
}

function onSearchError() {
  imagesApiService.resetPage();
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.',
  );
  clearPage();
  hideLoadMoreBtn();
}

function onReachEndError() {
  Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
}

function clearPage() {
  refs.galleryContainer.innerHTML = '';
}

function hideLoadMoreBtn() {
  refs.loadMoreBtn.classList.remove('visible');
}

function showLoadMoreBtn() {
  refs.loadMoreBtn.classList.add('visible');
}

function showNumberOfImages(items) {
  Notiflix.Notify.success(`Hooray! We found ${items} images.`);
}
