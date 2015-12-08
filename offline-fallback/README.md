# Offline Fallback

This recipe shows how to serve content from the cache when the user is offline.

## Difficulty
Beginner

## Use Case
There's a problem with relying on the browser's default "you are offline" message:

- The screen isn't branded the same as your app
- The screen looks different in each browser
- The message may not be localized

A better solution would be to show the user a custom offline snippet served from the cache.

## Features and Usage

- Register a service worker
- Cache an `offline.html` file
- Serve the `offline.html` file content if the network cannot be reached

## Category
Offline
