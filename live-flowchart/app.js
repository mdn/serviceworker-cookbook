"use strict";

class App {

	constructor() {
		Logger.log("App()");

		this.swUtil = new SWUtil();

		if (this.swUtil.areServiceWorkersSupported()) {

			var _self = this;

			document.querySelector('#swinstall').addEventListener('click', () => {
				_self.enableCoolFeatures();
			});

			document.querySelector('#reloadapp').addEventListener('click', () => {
				window.location.reload();
			});

			document.querySelector('#swuninstall').addEventListener('click', () => {
				_self.disableCoolFeatures();
			});

			if (this.swUtil.isServiceWorkerConfigured()) {
				Logger.log("service worker already configured");

				document.querySelector('#swinstall').disabled = true;
			} else {
				document.querySelector('#swuninstall').disabled = false;
			}

			if (this.swUtil.isServiceWorkerControllingThisApp()) {
				Logger.log("service worker controlling this app");

				document.querySelector('#swinstall').disabled = true;
			} else {
				document.querySelector('#swuninstall').disabled = false;
			}

		} else {

			Logger.log("Service workers are not supported by this browser");
			Logger.log(navigator.userAgent);

		}

	}

	enableCoolFeatures() {
		Logger.log("\nApp.enableCoolFeatures()");

		if (this.swUtil.isServiceWorkerControllingThisApp()) {

			Logger.log("a service worker is controlling this app");

		} else {
			Logger.log("configuring service worker");

			this.swUtil.registerServiceWorker(
				this.coolFeaturesAvailable, // success
				this.coolFeaturesNotAvailable // error
			);
		}
	}

	disableCoolFeatures() {
		Logger.log("\nApp.disableCoolFeatures()");

		this.swUtil.unregisterServiceWorker(
			this.coolFeaturesDisabled, // success
			this.coolFeaturesNotDisabled // error
		);
	}

	coolFeaturesAvailable() {
		Logger.log("\nApp.coolFeaturesAvailable()");

		document.querySelector('#swinstall').disabled = true;
		document.querySelector('#swuninstall').disabled = false;

		Logger.highlight("Service worker installed: check the browser logs for the oninstall, onactivate and onfetch events");
	}

	coolFeaturesNotAvailable() {
		Logger.log("\nApp.coolFeaturesNotAvailable()");
		
		document.querySelector('#swinstall').disabled = false;
		document.querySelector('#swuninstall').disabled = true;
	}

	coolFeaturesDisabled() {
		Logger.log("\nApp.coolFeaturesDisabled()");
		
		document.querySelector('#swinstall').disabled = false;
		document.querySelector('#swuninstall').disabled = true;
	}

	coolFeaturesNotDisabled() {
		Logger.log("\nApp.coolFeaturesNotDisabled()");
		
		document.querySelector('#swinstall').disabled = true;
		document.querySelector('#swuninstall').disabled = false;
	}
}
