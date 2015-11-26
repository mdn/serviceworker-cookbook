# Message Relay

This recipe shows how to communicate between the service worker and a page and also using service worker to relay messages between pages.

**Warning:** this recipe doesn't work in Chrome yet: https://code.google.com/p/chromium/issues/detail?id=549346

## Difficulty
Beginner

## Use case
The `postMessage` API is brilliant for passing messages between windows and `iframe`s, and now we can use the service worker's `message` event to act as a messenger.

## Features and usage

- postMessage API
- Service worker registration

## Category
Misc
