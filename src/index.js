import fetchImages from './js/fetchImages.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';


const { searchForm, gallery, loadMoreBtn } = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};


function renderCardImage(arr) {
  const markup = arr.map(
    ({
      largeImageURL,
      webformatURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    }) => `<div class="photo-card">
              <a class="gallery-item" href="${largeImageURL}"><img class="photo" src="${webformatURL}" alt="${tags}" loading="lazy"/></a>
              <div class="info">
                  <p class="info-item">
                      <b>Likes</b>
                      <span class="info-item-api">${likes}</span>
                  </p>
                  <p class="info-item">
                      <b>Views</b>
                      <span class="info-item-api">${views}</span>
                  </p>
                  <p class="info-item">
                      <b>Comments</b>
                      <span class="info-item-api">${comments}</span>
                  </p>
                  <p class="info-item">
                      <b>Downloads</b>
                      <span class="info-item-api">${downloads}</span>
                  </p>
              </div>
            </div>`
  )
  .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
}

let lightbox = new SimpleLightbox('.photo-card a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

// loadMoreBtn.style.display = 'none';

let currentPage = 1;
let currentHits = 0;
let searchQuery = '';

searchForm.addEventListener('submit', onSubmitSearchForm);

async function onSubmitSearchForm(e) {
  e.preventDefault();
  searchQuery = e.currentTarget.searchQuery.value;
  currentPage = 1;

  if (searchQuery === '') {
    return;
  }

  const response = await fetchImages(searchQuery, currentPage);
  currentHits = response.hits.length;

  if (response.totalHits > 40) {
    loadMoreBtn.classList.remove('is-hidden');
  } else {
    loadMoreBtn.classList.add('is-hidden');
  }

  try {
    if (response.totalHits > 0) {
      Notify.success(`Hooray! We found ${response.totalHits} images.`);
      gallery.innerHTML = '';
      renderCardImage(response.hits);
      lightbox.refresh();
      // endCollectionText.classList.add('is-hidden');

      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * -100,
        behavior: 'smooth',
      });
    }

    if (response.totalHits === 0) {
      gallery.innerHTML = '';
      Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      loadMoreBtn.classList.add('is-hidden');
      // endCollectionText.classList.add('is-hidden');
    }
  } catch (error) {
    console.log(error);
  }
}

loadMoreBtn.addEventListener('click', onClickLoadMoreBtn);

async function onClickLoadMoreBtn() {
  currentPage += 1;
  const response = await fetchImages(searchQuery, currentPage);
  renderCardImage(response.hits);
  lightbox.refresh();
  currentHits += response.hits.length;

  if (currentHits === response.totalHits) {
    loadMoreBtn.classList.add('is-hidden');
    // endCollectionText.classList.remove('is-hidden');
  }
}