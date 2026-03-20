// Описаний у документації
import iziToast from 'izitoast';
// Додатковий імпорт стилів
import 'izitoast/dist/css/iziToast.min.css';

// Імпорт функцій з js
import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
} from './js/render-functions.js';
import errorIcon from './img/Error.svg';

const form = document.querySelector('.form');

// Пошукове слово введене в input при submit передається у файл pixabay-api.js для пошуку на сервері відповідних зображень
form.addEventListener('submit', event => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const query = formData.get('search-text');

  // Перевірка на порожній пошуковий рядок
  if (!query) return;

  // Очистка галереї перед розміткою нових даних
  clearGallery();

  // Демонстрація завантажувача
  showLoader();

  // Пошук по ключовому слові на сервері.
  setTimeout(() => {
    getImagesByQuery(query)
      .then(data => {
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

        // Розмітка нових даних
        createGallery(data.hits);
      })

      // Якщо помилка пов'язана з помилкою мережі, тобто з відсутністю з'єднання або даними undefined.
      .catch(err => {
        console.error(err);
        iziToast.error({
          position: 'topRight',
          message: 'Something went wrong. Please try again later!',
          backgroundColor: '#ef4040',
          iconUrl: errorIcon,
        });
        return;
      })
      .finally(() => hideLoader());
  }, 2000);

  event.target.reset();
});
