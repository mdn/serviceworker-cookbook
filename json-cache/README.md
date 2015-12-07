# JSON Cache

This recipe illustrates fetching a JSON file during service worker installation and adding all resources to cache.  This recipe also immediately claims the service worker for faster activation.

## Difficulty
Beginner

## Use Case
You may not always want to keep the array of files to cache in the service worker's `.js` file itself -- you may want to hold that information in another place, possibly for versioning purposes.

## Features and Usage

- Register a service worker
- Service worker retrieves a JSON file listing important resources to be cached
- Service worker parses response and fetches required files

The only action required is loading the page initially.  After initial load, the service worker has installed and the assets have been cached.

## Compatibility

Tests have been run in:

- Firefox Nightly 44.0a1
- Chrome Canary 48.0.2533.0
- Opera 32.0

## Category
Offline
