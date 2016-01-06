# Dependency Injection
This recipe shows how a Service Worker can act as a dependency injector, avoiding _hard wiring_ dependencies for high level components.

## Difficulty
Advanced

## Use Case
As a framework developer, I want to provide production and testing environments, configuring two different injectors to provide the proper mock ups for the components without altering client code.

## Solution
A service worker can act as the injector. Provide two different injectors one for production and another for testing and let your framework bootstrap code decide which one register, then serve different contents for the same resource according to the mappings inside the injectors.

Start by looking at `bootstrap.js` to see how a framework could detect which injector should use. The file `default-mapping.js` contains the specification about how abstract resources are mapped to concrete ones. The `production-sw.js` and `testing-sw.js` are the Service Workers acting as injectors. The first simply use `default-mapping.js` spec without modifications while the latter override `utils/dialogs` to serve a mockup instead.

Compare the actual and mocked implementation of the `dialogs` interface in `actual-dialogs.js` and `mock-dialogs.js`.

## Category
Beyond Offline
