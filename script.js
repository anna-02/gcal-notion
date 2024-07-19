// Import the config
import config from './config.js';

function start() {
  gapi.client.init({
    apiKey: config.apiKey,
    clientId: config.clientId,
    discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
    scope: "https://www.googleapis.com/auth/calendar.readonly",
  }).then(function () {
    return gapi.client.calendar.events.list({
      'calendarId': 'primary',
      'timeMin': (new Date()).toISOString(),
      'showDeleted': false,
      'singleEvents': true,
      'maxResults': 10,
      'orderBy': 'startTime'
    });
  }).then(function(response) {
    var events = response.result.items;
    var calendarDiv = document.getElementById('calendar');
    if (events.length > 0) {
      for (var i = 0; i < events.length; i++) {
        var event = events[i];
        var eventDiv = document.createElement('div');
        eventDiv.className = 'event';
        var eventTitle = document.createElement('div');
        eventTitle.className = 'event-title';
        eventTitle.textContent = event.summary;
        var eventTime = document.createElement('div');
        eventTime.className = 'event-time';
        var start = event.start.dateTime || event.start.date;
        eventTime.textContent = start;
        eventDiv.appendChild(eventTitle);
        eventDiv.appendChild(eventTime);
        calendarDiv.appendChild(eventDiv);
      }
    } else {
      calendarDiv.textContent = 'No upcoming events found.';
    }
  }).catch(function(error) {
    console.error("Error fetching events: " + error.message);
  });
}

gapi.load('client:auth2', start);
