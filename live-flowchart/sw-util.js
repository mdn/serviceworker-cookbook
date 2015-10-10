"use strict";

class SWUtil {
	constructor() {
		Logger.log("\nSWUtil()");

		this.swRegistration = null;
	}

	areServiceWorkersSupported() {
		Logger.log("\nSWUtil.areServiceWorkersSupported()");
		
		if (navigator.serviceWorker) {
			Logger.log("service workers supported");
			return true;
		}

    	Logger.log("NO");
		return false;
	}

	isServiceWorkerConfigured() {
		Logger.log("\nSWUtil.isServiceWorkerConfigured()");

		if (navigator.serviceWorker.current) { // @TODO: what is it?
        	Logger.log("a service worker is already configured");
        	Logger.log("Go to about:serviceworkers (Firefox) or chrome://serviceworker-internals/");

        	return true;
      	}

    	Logger.log("NO");
      	return false;
	}


	isServiceWorkerControllingThisApp() {
		Logger.log("\nSWUtil.isServiceWorkerControllingThisApp()");

		if (navigator.serviceWorker.controller) {
			Logger.highlight('SW is in control, once document is reloaded');
			Logger.log("the following service worker controls this app: " + navigator.serviceWorker.controller.scriptURL);
	    	Logger.log("More on about:serviceworkers (Firefox) or chrome://serviceworker-internals/");
	    	
			return true;
		}

    	Logger.log("NO");
		return false;
	}

	registerServiceWorker(serviceWorkerRegistered, serviceWorkerNotRegistered) {
		Logger.log("\nSWUtil.registerServiceWorker()");

		Logger.highlight("Register service worker with serviceWorker.register()");

		navigator.serviceWorker.register(
			'./sw.js', 
			{
				scope: './' 
			}
		).then(
			(swRegistration) => {
				Logger.highlight('Service worker registered');
				Logger.log(swRegistration);
	        	Logger.log("More on about:serviceworkers (Firefox) or chrome://serviceworker-internals/");
				this.swRegistration = swRegistration;					
				serviceWorkerRegistered();
			},
			(why) => {
				Logger.log(why);
				serviceWorkerNotRegistered();
			}
		);
	}

	unregisterServiceWorker(serviceWorkerUnregistered, serviceWorkerNotUnregistered) {
		Logger.log("\nSWUtil.unregisterServiceWorker()");

		Logger.log(this.swRegistration);
		if (this.swRegistration) {

			this.swRegistration.unregister()
				.then(
					() => {
						serviceWorkerUnregistered();
					},
					(why) => {
						Logger.log(why);
						serviceWorkerNotUnregistered();
					}
				);

		} else {
			console.warn("no active ServiceWorkerRegistration");
		}
	}

}
