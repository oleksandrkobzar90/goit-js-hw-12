import axios from 'axios';

// Пошуковий запит на сервер звикористанням ключового слова переданого з input та одержання JSON
axios.defaults.baseURL = 'https://pixabay.com/api/';
axios.defaults.params = {
  key: '54988014-84e46a9f0470ced10c87901a9',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
};

export function getImagesByQuery(query) {
  return axios
    .get('', { params: { q: String(query).trim() } })
    .then(res => res.data)
    .catch(err => console.error(err));
}
