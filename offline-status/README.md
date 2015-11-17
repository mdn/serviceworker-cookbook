# Offline Status

This basic recipe illustrates caching critical resources for offline use and then notifying the user that they may go offline and enjoy the same experience.


## Features and usage

Features are:

- Register a service worker
- Monitor the cached status of required resources
- Notification to user when resources have been cached

The only action required is loading the page initially.  After initial load, the service worker has installed and the assets have been cached.

## Compatibility

Tests has been run on:

- Firefox Nightly 44.0a1 (2015-10-12)
- Chrome Canary 48.0.2533.0
- Opera 32.0
