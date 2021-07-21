import refs from './refs';
import Notiflix from 'notiflix';
// Notiflix.Notify.init({ position: 'right-bottom' });

import ImagesApiService from './fetchImages';
import imgCardTpl from '../partials/card.hbs';
import SimpleLightbox from 'simplelightbox';

// Инициализация библиотеки SimpleLightbox
const lightbox = new SimpleLightbox('.gallery a');

// Создаю новый класс с данными и методами
const imagesApiService = new ImagesApiService();

// Прячу кнопку дополнительной загрузки изображений
hideLoadMoreBtn();

// Создаю слушателей событий
refs.searchForm.addEventListener('submit', onSubmitBtnPush);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnPush);

// Функция по отправке формы
function onSubmitBtnPush(e) {
  e.preventDefault();

  clearPage();
  hideLoadMoreBtn();

  // Получаю значенние ввода
  const form = e.currentTarget;
  imagesApiService.query = form.elements.searchQuery.value.trim();
  imagesApiService.resetPage();

  // Проверка на ввод пустой строки в поле поиска
  if (imagesApiService.searchQuery !== '') {
    // Получаю данные для рендера разметки
    imagesApiService
      .fetchImages()
      .then(images => {
        // Вызов оповещения с количеством найденых картинок
        showNumberOfImages(images.totalHits);

        if (images.totalHits < 1) {
          onSearchError();
          return;

          // Проверка на количество изображений
        } else if (images.totalHits <= imagesApiService.itemsPerPage) {
          onReachEndError();
          hideLoadMoreBtn();
          renderPage(images);
          return;
        }
        // Делаю кнопку загрузки дополнительных изображений видимой
        showLoadMoreBtn();

        // Рендер разметки
        return renderPage(images);
      })
      .catch(err => {
        // Отображение ошибки
        onSearchError(err);
      })
      // Сброс поля формы до начального значения
      .finally(() => form.reset());
  } else {
    clearPage();
    onSearchError();
  }
}

// Функция по нажатию на 'загрзуть еще'
function onLoadMoreBtnPush(e) {
  imagesApiService.fetchImages().then(images => {
    if (images.hits.length < imagesApiService.itemsPerPage) {
      onReachEndError();
      hideLoadMoreBtn();
    }
    return renderPage(images);
  });
}

// Функция добавления разметки в index.html
function renderPage(items) {
  const markup = imgCardTpl(items.hits);

  refs.galleryContainer.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

// Функция вызова уведомления об ошибке
function onSearchError() {
  imagesApiService.resetPage();
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.',
  );
  clearPage();
  hideLoadMoreBtn();
}

// Уведомление когда закончились результаты
function onReachEndError() {
  Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
}

// Очистка страницы
function clearPage() {
  refs.galleryContainer.innerHTML = '';
}

// Скрываем кнопку загрузки дополнительных изображений
function hideLoadMoreBtn() {
  refs.loadMoreBtn.classList.remove('visible');
}

// Делаем видимой кнопку загрузки дополнительных изображений
function showLoadMoreBtn() {
  refs.loadMoreBtn.classList.add('visible');
}

// Увдомление с количеством найденых результатов
function showNumberOfImages(items) {
  Notiflix.Notify.success(`Hooray! We found ${items} images.`);
}
