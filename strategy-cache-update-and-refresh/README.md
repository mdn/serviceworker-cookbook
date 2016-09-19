# Cache, update and refresh
The recipe provides a service worker responding from cache to deliver fast
responses and also updating the cache entry from the network. When the network
response is ready, the UI updates automatically.

## Difficulty
Intermediate

## Use Case
You want to instantly show content while retrieving new content in background.
Once the new content is available you want to show it somehow.

## Solution
Serve the content from the cache but at the same time, perform a network request
to update the cache entry and inform the UI about new up to date content.

## Category
Caching strategies
