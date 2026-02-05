import { togleModal } from './js/modal.js';

const key = 'JHFGnXEDch2MFGcn1xSI30ZApMODKhwX';
const baseURL = 'https://app.ticketmaster.com/discovery/v2/events.json';
const pageLimit = 20;
const eventListContainer = document.querySelector('.event-list');
const searchKeywordInput = document.querySelector('.header-search');

// pagination
const paginationPrevBtn = document.querySelector('.pagination-prev');
const paginationNextBtn = document.querySelector('.pagination-next');
const paginationCurrent = document.querySelector('.pagination-current');
const paginationTotal = document.querySelector('.pagination-total');

let currentPage = 0;
let totalPages = 0;
let currentSearchQuery = '';

// events
async function getEvents(page = 0, keyword = '') {
  try {
    let url = `${baseURL}?apikey=${key}&page=${page}&size=${pageLimit}`;

    if (keyword) {
      url += `&keyword=${keyword}`;
    } else {
      url += '&classificationName=music&source=universe';
    }

    let response = await fetch(url);

    if (!response.ok) {
      throw new Error('HTTP error: ' + response.status);
    }

    let data = await response.json();
    console.log(data._embedded.events);
    return data;
  } catch (error) {
    console.error(error);
  }
}

// '4_3';
// '3_2';
// imgs
function getEventImg(event) {
  const img =
    event.images.find(img => img.ratio === '4_3') ||
    event.images.find(img => img.ratio === '3_2') ||
    event.images[0];

  return img.url;
}
// render
function renderEvents(events) {
  const markup = events
    .map(event => {
      const imgUrl = getEventImg(event);

      return `
      <li data-id="${event.id}" class="event-item">
    <div class="event-box">
    <div class="event-img-box">
      <img
        class="event-img"
        src="${imgUrl}"
        alt="${event.name}"
      />
    </div>

    <p class="event-name">${event.name}</p>
    <p class="event-time">${event.dates.start.localDate}</p>
    <div class="icon-box">
    <p class="event-location">${event._embedded?.venues?.[0]?.name ?? 'Місце невідоме'}</p>
    </div>
  </div>
</li>

      `;
    })
    .join('');

  eventListContainer.innerHTML = markup;
}

// pagination
function updatePaginationDisplay() {
  paginationCurrent.textContent = currentPage + 1;
  paginationTotal.textContent = totalPages;

  paginationPrevBtn.disabled = currentPage === 0;
  paginationNextBtn.disabled = currentPage === totalPages - 1;
}

//current page
async function loadPage(page, keyword = '') {
  try {
    const data = await getEvents(page, keyword);
    renderEvents(data._embedded.events);

    totalPages = Math.ceil(data.page.totalElements / pageLimit);
    currentPage = page;

    updatePaginationDisplay();
  } catch (error) {
    console.error('Помилка завантаження сторінки:', error);
  }
}

// modal
async function getEventById(id) {
  try {
    const response = await fetch(
      `https://app.ticketmaster.com/discovery/v2/events/${id}.json?apikey=JHFGnXEDch2MFGcn1xSI30ZApMODKhwX`
    );

    if (!response.ok) {
      throw new Error('HTTP error: ' + response.status);
    }
    const event = await response.json();
    return event;
  } catch (error) {
    console.error(error);
  }
}

function renderModal(event) {
  const modalContent = document.querySelector('.modal-content');
  const imgUrl = getEventImg(event);

  modalContent.innerHTML = `
   <img src="${imgUrl}" class="event-modal-circleImg" alt="#">
<div class="modal-box">
  <img src="${imgUrl}" class="event-modal-img" alt="#">
  <div class="modal-info-box">
  <h3 class="modal-info modal-title">INFO</h3>
  <p class="modal-descr modal-text">
      ${event.description}
    </p>
    <h3 class="modal-name modal-title">WHEN</h3>
     <p class="modal-time modal-text">
      ${event.dates?.start?.localDate ?? 'Дата невідома'}
    </p>

    <p class="modal-time modal-text">
      ${event.dates?.start?.localTime ?? 'Час невідомий'}
    </p>
<h3 class="modal-name modal-title ">WHERE</h3>
    <span class="modal-location modal-text">
      ${event._embedded?.venues?.[0]?.country?.name ?? ''}
    </span>
    <span class="modal-location modal-text">
      ${event._embedded?.venues?.[0]?.city?.name ?? ''}
    </span>

    <p class="modal-location modal-text">
      ${event._embedded?.venues?.[0]?.address?.line1 ?? 'Адреса невідома'}
    </p>
   <h3 class="modal-name modal-title" >WHO</h3>
   <p class="modal-time modal-text">
      ${event.name}
    </p>
     <h3 class="modal-name modal-title">PRICES </h3>
     <p class="modal-standart-price modal-text">Standart 300 UAH</p>
<button class="modal-buy">BUY TICKETS</button>
       <p class="modal-vip-price modal-text">VIP 1000 UAH</p>
       <button class="modal-buy">BUY TICKETS</button>
  </div>
  </div>
  <button class="modal-more">MORE FROM THIS AUTHOR</button>  `;
  
}

eventListContainer.addEventListener('click', async e => {
  const card = e.target.closest('.event-item');
  if (!card) return;

  const eventId = card.dataset.id;

  try {
    const event = await getEventById(eventId);
    renderModal(event);
    togleModal();
  } catch (error) {
    console.error('Помилка завантаження деталей подій:', error);
  }
});

async function OnKeywordSearch() {
  const keyword = searchKeywordInput.value.trim();

  if (!keyword) {
    currentSearchQuery = '';
    loadPage(0);
    return;
  }

  currentSearchQuery = keyword;
  currentPage = 0;
  loadPage(0, keyword);
}

searchKeywordInput.addEventListener('input', OnKeywordSearch);

paginationPrevBtn.addEventListener('click', () => {
  if (currentPage > 0) {
    loadPage(currentPage - 1, currentSearchQuery);
  }
});

paginationNextBtn.addEventListener('click', () => {
  if (currentPage < totalPages - 1) {
    loadPage(currentPage + 1, currentSearchQuery);
  }
});

async function startApp() {
  try {
    const events = await getEvents();

    renderEvents(events._embedded.events);
    loadPage(0);
  } catch (error) {
    console.error(' Помилка запуску проєкту:', error);
  }
}

startApp();
