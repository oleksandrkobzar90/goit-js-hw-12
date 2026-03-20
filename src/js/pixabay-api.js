import axios from 'axios';

// Пошуковий запит на сервер звикористанням ключового слова переданого з input та одержання JSON
axios.defaults.baseURL = 'https://pixabay.com/api/';
axios.defaults.params = {
  key: '54988014-84e46a9f0470ced10c87901a9',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
};

export async function getImagesByQuery(query, page = 1, per_page = 15) {
  per_page = per_page < 15 ? 15 : per_page;
  try {
    const res = await axios.get('', {
      params: { q: String(query), page: page, per_page: per_page },
    });
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
