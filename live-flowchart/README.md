# Live Flowchart

This recipe provides a way to learn how to use service workers (SW) through showing [the flow diagram of SW workflow explained on the Mozilla Developer Network](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers), and logging on screen the steps taken by a real Web App running service workers.

## Difficulty
Advanced

## Screenshots

Register + Unregister

![Screenshot](https://cdn.rawgit.com/mozilla/serviceworker-cookbook/master/live-flowchart/register-unregister.png)

Active service worker on page load + unregister

![Screenshot](https://cdn.rawgit.com/mozilla/serviceworker-cookbook/master/live-flowchart/active-service-worker-unregister.png)

Wrong service worker scriptURL

![Screenshot](https://cdn.rawgit.com/mozilla/serviceworker-cookbook/master/live-flowchart/wrong-scriptURL.png)

Security error

![Screenshot](https://cdn.rawgit.com/mozilla/serviceworker-cookbook/master/live-flowchart/security-error.png)

## Features and Usage

Features are:

- Register a service worker
- Reload document
- Unregister the service worker

The features coincide to the buttons at the top of the page, which can be pressed in a whatever order. You can also specify the SW scriptURL and scope to simulate different test cases.

Usage:

- press buttons
- read the logs
- take actions in case (e.g. open about://serviceworkers)
- hack the code and see what happens

## How to Read the Logs

There are two logs to read:

- the HTML log
- the browser log

In the HTML log colors mean different log levels:

- red => error
- yellow => warn
- green => info
- white => log
- gray => debug

The browser log prints:

- the same messages printed on the HTML log, using the same log level
- the service worker log (since service workers can't access the DOM)

## Compatibility

Tests have been run in:

- Firefox Nightly 44.0a1 (2015-10-12)
- Chrome Canary 48.0.2533.0
- Opera 32.0

on a machine running Mac OS X 10.8.5

Notes:

- the browser has to support ES6

## What's Next / Contributions

- responsive to work on mobile
- have the flowchart build in SVG and visualize the service worker states
- add specs / automatic tests for existing features
- add specs / automatic tests for new features in a BDD/TDD fashion
- do something oninstall
- do something onactivate
- do something onfetch
- provide a button to simulate the offline network status
- provide a button to simulate the lie-fi network status (very low connectivity but not completely offline)

## Category
General Usage
