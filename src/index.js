key ='JHFGnXEDch2MFGcn1xSI30ZApMODKhwX'
baseURL = 'https://app.ticketmaster.com/discovery/v2/events.json?size=21&apikey='

const eventListContainer = document.querySelector('.event-list');

async function getEvents() {
    try {
        let response = await fetch(baseURL + key);

          if (!response.ok) {
            throw new Error('HTTP error: ' + response.status);
        }
        
      let data = await response.json();
      console.log(data)
      return data;
    } catch (error){
        console.error(error)
    }
}

function renderEvents(events) {
  const markup = events.map((event) => {
    return `<li class="event-item">
    
    <p class="event-name">${event.name}</p>
<p class="event-time">${event.dates.start.localDate}</p>    
<p class="event-location">${event._embedded.venues[0].name}  </p>    
    </li>`;
  }).join("")

  eventListContainer.innerHTML = markup;
  

}


async function startApp() {
  try {

    const events = await getEvents(); 

    renderEvents(events._embedded.events); 

  } catch (error) {
    console.error(' Помилка запуску проєкту:', error);
  }
}



startApp()