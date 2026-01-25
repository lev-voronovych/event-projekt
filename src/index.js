const key ='JHFGnXEDch2MFGcn1xSI30ZApMODKhwX'
const baseURL = 'https://app.ticketmaster.com/discovery/v2/events.json'
const pageLimit = 20 ;
const eventListContainer = document.querySelector('.event-list');

async function getEvents() {
    try {
        let response = await fetch(`${baseURL}?apikey=${key}&classificationName=music&page=0&size=${pageLimit}&source=universe`);

          if (!response.ok) {
            throw new Error('HTTP error: ' + response.status);
        }
        
      let data = await response.json();
      console.log(data._embedded.events)
      return data;
    } catch (error){
        console.error(error)
    }
}

// '4_3';
// '3_2';

function getEventImg(event) {
  const img =
    event.images.find(img => img.ratio === '4_3') ||
    event.images.find(img => img.ratio === '3_2') ||
    event.images[0]

  return img.url;
}



function renderEvents(events) {
  const markup = events.map((event) => {
    const imgUrl = getEventImg(event);
     
    return `<li data-id="${event.id}" class="event-item">
    <img alt='' src="${imgUrl}"></img>
    <p class="event-name">${event.name}</p>
    <p class="event-time">${event.dates.start.localDate}</p>    
    <p class="event-location">${event._embedded.venues[0].name}  </p>    
    </li>`;
  }).join("")

  eventListContainer.innerHTML = markup;
  

}

// modal
// eventListContainer.addEventListener('click',async (e) => {
//   const card = e.target.closest('.event-item');
//   if (!card) return;
//   console.log(card.dataset.id);
//   const eventId = card.dataset.id;
//   try {
//     const response = await fetch(`${baseURL}?apikey=${key}&classificationName=music&page=0&size=${pageLimit}&source=universe`
//       if(!res)
//     );
//   } catch (error) {
    
//   }
// });


async function startApp() {
  try {

    const events = await getEvents(); 

    renderEvents(events._embedded.events); 

  } catch (error) {
    console.error(' Помилка запуску проєкту:', error);
  }
}



startApp()