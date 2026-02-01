import { togleModal } from './js/modal.js';

const key = 'JHFGnXEDch2MFGcn1xSI30ZApMODKhwX';
const baseURL = 'https://app.ticketmaster.com/discovery/v2/events.json';
const pageLimit = 20;
const eventListContainer = document.querySelector('.event-list');
const searchKeywordInput = document.querySelector('.header-search');


// events
async function getEvents() {
  try {
    let response = await fetch(
      `${baseURL}?apikey=${key}&classificationName=music&page=0&size=${pageLimit}&source=universe`
    );

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

      return `<li data-id="${event.id}" class="event-item">
    <img alt='' class="event-img" src="${imgUrl}"></img>
    <p class="event-name">${event.name}</p>
    <p class="event-time">${event.dates.start.localDate}</p>    
    <p class="event-location">${event._embedded.venues[0].name}  </p>    
    </li>`;
    })
    .join('');

  eventListContainer.innerHTML = markup;
}


// modal
async function getEventById(id){
  try {
     const response = await fetch(`https://app.ticketmaster.com/discovery/v2/events/${id}.json?apikey=JHFGnXEDch2MFGcn1xSI30ZApMODKhwX`);

    if (!response.ok) {
      throw new Error('HTTP error: ' + response.status);
    }
    const event = await response.json();
    return event;
  } catch (error) {
    console.error(error)
  }
}

function renderModal(event) {
  const modalContent = document.querySelector('.modal-content');
  const imgUrl = getEventImg(event);
  
  modalContent.innerHTML = `
  <img src="${imgUrl}" class="event-modal-img" alt="#">
    <p class="modal-event-name">${event.name}</p>
    <span class="modal-location">
      ${event._embedded?.venues?.[0]?.country?.name ?? ''}
    </span>,
    <span class="modal-location">
      ${event._embedded?.venues?.[0]?.city?.name ?? ''}
    </span>

    <p class="modal-location">
      ${event._embedded?.venues?.[0]?.address?.line1 ?? 'Адреса невідома'}
    </p>

    <p class="modal-time">
      ${event.dates?.start?.localDate ?? 'Дата невідома'}
    </p>

    <p class="modal-time">
      ${event.dates?.start?.localTime ?? 'Час невідомий'}
    </p>
  `;
}

eventListContainer.addEventListener('click', async e => {
  const card = e.target.closest('.event-item');
  if (!card) return;

  const eventId = card.dataset.id;

  try {
    const event = await getEventById(eventId)
    renderModal(event)
    togleModal()
  } catch (error) {
    console.error('Помилка завантаження деталей подій:', error);
  }
});

async function OnKeywordSearch() {
  const keyword = searchKeywordInput.value.trim();

  if (!keyword) {
    return;
  }
  try {
    const response = await fetch(
      `${baseURL}?apikey=${key}&keyword=${(keyword)}&size=20`
    );
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const data = await response.json();
       if (data._embedded?.events) {
         const events = data._embedded.events;
        renderEvents(events);
       } else {
         console.log('Подій не знайдено');
       }
  } catch (error) {
    console.error('Помилка завантаження деталей подій при пошуку:', error);
  }
}

searchKeywordInput.addEventListener('input',OnKeywordSearch)


// start-app

async function startApp() {
  try {
    const events = await getEvents();

    renderEvents(events._embedded.events);

  } catch (error) {
    console.error(' Помилка запуску проєкту:', error);
  }
}


startApp();
