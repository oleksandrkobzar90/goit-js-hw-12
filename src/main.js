// Описаний у документації
import iziToast from 'izitoast';
// Додатковий імпорт стилів
import 'izitoast/dist/css/iziToast.min.css';

// Імпорт функцій з js
import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  appendGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';
import errorIcon from './img/Error.svg';

const form = document.querySelector('.form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let query;
let page = 1;
const per_page = 15;
let totalPages;

// Пошукове слово введене в input при submit передається у файл pixabay-api.js для пошуку на сервері відповідних зображень
form.addEventListener('submit', async event => {
  event.preventDefault();
  const formData = new FormData(event.target);
  query = formData.get('search-text').trim();
  page = 1;

  // Перевірка на порожній пошуковий рядок
  if (!query) {
    iziToast.error({
      position: 'topRight',
      message: `Please enter a search term.`,
      backgroundColor: '#ef4040',
      iconUrl: errorIcon,
    });
    return;
  }

  // Очистка галереї перед розміткою нових даних
  clearGallery();

  // Демонстрація завантажувача
  showLoader();
  hideLoadMoreButton();

  // Пошук по ключовому слові на сервері.
  try {
    const data = await getImagesByQuery(query, page, per_page);

    // Перевірка чи дані не порожні, тобто незнайдено жодного елементу за ключовим словом, а тому масив порожній.
    // Виводиться повідомлення про пороржній масив.
    if (data.hits.length === 0) {
      iziToast.error({
        position: 'topRight',
        message: `Sorry, there are no images matching<br/>your search query. Please try again!`,
        backgroundColor: '#ef4040',
        iconUrl: errorIcon,
      });
      return;
    }

    // Отримання загальноъ кількості елементів в колекції, що отримана за ключовим словом
    totalPages = Math.ceil(data.totalHits / per_page);

    // Розмітка нових даних
    createGallery(data.hits);

    // Показ кнопки тільки якщо є ще сторінки
    if (totalPages > 1) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();

      iziToast.warning({
        position: 'topRight',
        message: `We're sorry, but you've reached the end of search results.`,
        backgroundColor: '#96d4f8',
      });
    }
  } catch (err) {
    console.error(err);
    return iziToast.error({
      position: 'topRight',
      message: 'Something went wrong. Please try again later!',
      backgroundColor: '#ef4040',
      iconUrl: errorIcon,
    });
  } finally {
    hideLoader();
  }

  event.target.reset();
});

loadMoreBtn.addEventListener('click', async () => {
  // Перевірка чи остання сторінка колекції.
  if (page >= totalPages) return;

  page += 1;
  showLoader();
  hideLoadMoreButton();

  try {
    const data = await getImagesByQuery(query, page, per_page);
    // Розмітка нових даних
    appendGallery(data.hits);

    // Виклик функції scrollPage для планої прокрутки сторінки
    scrollPage();

    // Перевірка чи на останній сторінці колекції.
    if (page >= totalPages) {
      iziToast.warning({
        position: 'topRight',
        message: `We're sorry, but you've reached the end of search results.`,
        backgroundColor: '#96d4f8',
      });
      hideLoadMoreButton();
    } else {
      showLoadMoreButton();
    }
  } catch (err) {
    console.error(err);
    iziToast.error({
      position: 'topRight',
      message: 'Something went wrong. Please try again later!',
      backgroundColor: '#ef4040',
      iconUrl: errorIcon,
    });
  } finally {
    hideLoader();
  }
});

function scrollPage() {
  const elem = gallery.lastElementChild;

  const height = elem.getBoundingClientRect().height;

  window.scrollBy({
    top: height * 2,
    behavior: 'smooth',
  });
}
