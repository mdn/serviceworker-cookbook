# Cache only
The recipe provides a service worker always answering from cache on `fetch` events.

## Difficulty
Beginner

## Use Case
For a given version of your site, you have static content that never changes
such as the shell around the content.

## Solution
Add static content during the installation of the service worker and use the
cache to retrieve it whether the network is available or not.

## Category
Caching strategies
