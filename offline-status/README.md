# Offline Status

This basic recipe illustrates caching critical resources for offline use and then notifying the user that they may go offline and enjoy the same experience.

## Difficulty
Beginner

## Use Case
The most basic of service worker use cases:  caching a set of files so that the user may go offline.  The added value in this demo is showing a notification to the user that they can safely go offline.

## Features and Usage

- Register a service worker
- Monitor the cached status of required resources
- Notification to user when resources have been cached

The only action required is loading the page initially.  After initial load, the service worker has installed and the assets have been cached.

## Compatibility

Tests have been run in:

- Firefox Nightly 44.0a1
- Chrome Canary 48.0.2533.0
- Opera 32.0

## Category
Offline
