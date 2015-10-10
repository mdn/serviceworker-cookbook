console.log("\nsw.js");

this.addEventListener('install', (event) => {
	console.warn("\nsw.js: Service worker installed, oninstall fired");
	console.log(event);

	// event.waitUntil();

	console.warn("Use oninstall to install app dependencies");
});

this.addEventListener('activate', (event) => {
	console.warn("\nsw.js: Service worker activated, onactivate fired");
	console.log(event);

	console.warn("Use onactivate to cleanup old resources");
});

this.addEventListener('fetch', (event) => {
	console.log("\nsw.js: onfecth fired");
	console.log(event);

	// event.respondWith();

	console.warn("Modify requests, do whatever you want");
});
