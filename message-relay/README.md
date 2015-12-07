# Message Relay

This recipe shows how to communicate between the service worker and a page and shows how to use a service worker to relay messages between pages.

**Warning:** this recipe doesn't fully work in Chrome yet (because of [this issue](https://code.google.com/p/chromium/issues/detail?id=549346)).  Read the source code of the recipe for more details.

## Difficulty
Beginner

## Use Case
The `postMessage` API is brilliant for passing messages between windows and `iframe`s, and now we can use the service worker's `message` event to act as a messenger.

## Features and Usage

- postMessage API
- Service worker registration

## Category
General Usage
