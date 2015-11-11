// TODO: Pressing the button on the page should update localstorage
// info about which CSS file to consider 'up-to-date' and initiate
// a countdown timer that will refresh the page with a description
// of why and what to expect on the refreshed page.
//
// TODO: Message handler to respond to service worker when it asks us
// what CSS file is 'up-to-date'
//
// TODO: Upon loading the page, the sw will ask the server for an updated
// CSS file (in reality we will respond with localstorage data). If the sw
// finds an udpated CSS file, it will inform us through a postmessage call.
// We need to have a message handler that informs the user of the situation
// and optionally refreshes the page.

window.navigator.serviceWorker.register('sw.js');
