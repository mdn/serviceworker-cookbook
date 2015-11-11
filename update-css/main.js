// TODO: Pressing the button on the page should update localstorage
// info about which CSS file to consider 'up-to-date' and initiate
// a countdown timer that will refresh the page with a description
// of why and what to expect on the refreshed page.
//
// TODO: Message handler to respond to service worker when it asks us
// what CSS file is 'up-to-date'
//
// TODO: Upon loading the page, the browser will fetch the CSS file. The
// SW will intercept the call, ask us what CSS file it should respond with,
// and initiate a network fetch. When the fetch completes, the SW will tell
// us (if the file was different) that updated CSS is available. We need
// a message listener that handles the SW telling us about updated CSS.

window.navigator.serviceWorker.register('sw.js');
