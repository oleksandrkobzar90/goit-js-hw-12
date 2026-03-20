import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let lightbox;
const gallery = document.querySelector('.gallery');
const loaderWrap = document.querySelector('.loader-wrap');
const loadMore = document.querySelector('.load-more');

// Створення розмітки галереї
function createMarkup(images) {
  return images
    .map(img => {
      const {
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = img;
      const alt = tags;
      return `<li class="gallery-item">
  <a class="gallery-link" href="${largeImageURL}" title="${alt}">
    <img
      class="gallery-img"
      src="${webformatURL}"
      alt="${alt}"
      loading="lazy"
      width="640"
      height="360"
    />
    <div class="gallery-info">
      <span class="gallery-info-item">Likes<span class='indicators'>${likes}</span></span>
      <span class="gallery-info-item">Views<span class='indicators'>${views}</span></span>
      <span class="gallery-info-item">Comments<span class='indicators'>${comments}</span></span>
      <span class="gallery-info-item">Downloads<span class='indicators'>${downloads}</span></span>
    </div>
  </a>
</li>`;
    })
    .join('');
}

export function createGallery(images) {
  if (!gallery) return;
  gallery.innerHTML = createMarkup(images);

  if (!lightbox) {
    lightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
    });
  } else {
    lightbox.refresh();
  }
}

// Для Load More
export function appendGallery(images) {
  if (!gallery) return;
  gallery.insertAdjacentHTML('beforeend', createMarkup(images));
  if (lightbox) {
    lightbox.refresh();
  }
}

// Очистка галереї перед створенням розмітки нових даних
export function clearGallery() {
  if (gallery) gallery.innerHTML = '';
}

// Зявляється css-loader
export function showLoader() {
  if (loaderWrap) {
    loaderWrap.classList.remove('is-hidden');
  }
}

// Прибирається css-loader
export function hideLoader() {
  if (loaderWrap) {
    loaderWrap.classList.add('is-hidden');
  }
}

export function showLoadMoreButton() {
  if (loadMore) {
    loadMore.classList.remove('is-hidden');
  }
}

export function hideLoadMoreButton() {
  if (loadMore) {
    loadMore.classList.add('is-hidden');
  }
}
