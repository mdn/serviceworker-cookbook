# Cache and update CSS

This recipe illustrates the ability to serve stale CSS files and notify the page if updated ones are available on the server (no polling, however).

## Difficulty

Advanced

## Use Case

As a web developer I want my pages to have CSS files available offline. I further want them to silently update in the background. Finally, I want my page to be notified if new CSS is available offline.

## Solution

Cache CSS files. Maintain a JSON file that can be queried from the service worker to determine if new CSS is available. Use the information in that JSON file to cache the new CSS files. When the new CSS files are cached, notify the page that a new set of CSS files is available.

## Category

Beyond Offline
