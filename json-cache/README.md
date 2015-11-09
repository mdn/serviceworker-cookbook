# Recipe: JSON Cache

This recipe illustrates fetching a JSON file during service worker installation and adding all resources to cache.  This recipe also immediately claims the service worker for faster activation.


## Features and usage

Features are:

- Register a service worker
- Service worker retrieves a JSON file listing important resources to be cached
- Service worker parses response and fetches required files

The only action required is loading the page initially.  After initial load, the service worker has installed and the assets have been cached.

## Compatibility

Tests has been run on:

- Firefox Nightly 44.0a1 (2015-10-12)
- Chrome Canary 48.0.2533.0
- Opera 32.0
