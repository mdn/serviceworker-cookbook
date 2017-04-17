# Cache for Performance

Service workers can provide a major speed boost for frequently used assets.  This recipe shows how you can cache non-core assets asynchronously and at no risk to the offline assets.

## Difficulty
Beginner

## Use Case
As developers we strive to deliver assets as quickly as we can, using strategies to make assets smaller (image crushing, CSS and JavaScript minification...) and fewer (sprites, concatenation...).  Another way to make our sites faster is to cut down on server requests which is where service workers can help us.

## Features and Usage

- Register a service worker
- Use another `addAll()` call for non-essential assets

The only action required is loading the page initially.  After initial load, the service worker has installed and the assets have been cached.

## Compatibility

Tests have been run in:

- Firefox Nightly 44.0a1
- Chrome Canary 48.0.2533.0
- Opera 32.0

## Category
Performance
