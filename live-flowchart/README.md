# Recipe: Live Flowchart

This recipe provides a way to learn how to use service workers (SW) through showing [the flow diagram of SW workflow explained on the Mozilla Developer Network](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers), and logging on screen the steps taken by a real ES6 Web App.

## Features and usage

Features are:

- Register a service worker
- Reload document
- Unregister the service worker

The features coincide to the buttons at the top of the page, which can be pressed in a whatever order.

Usage:

- press buttons
- read the logs
- take actions in case (e.g. open about://serviceworkers)
- hack the code and see what happens

## How to read the logs

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

Tests has been run on:

- Firefox Nightly 44.0a1 (2015-10-11)
- Chrome Version 48.0.2533.0 canary (64-bit)

Note that, in order to support Chrome for ES6, I had to:

- enable strict mode, for classes
- disable imports

This causes some minor errors in lint, Service Workers work fine.

## What's next / contributions

- add specs / automatic tests for existing features
- add specs / automatic tests for new features in a BDD/TDD fashion
- do something oninstall
- do something onactivate
- do something onfetch
- provide a button to simulate the offline network status
- provide a button to simulate the lie-fi network status (very low connectivity but not completely offline)
