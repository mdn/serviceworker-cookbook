# Cache and update
The recipe provides a service worker answering from cache to deliver fast
responses but at the same time updating the cache entry from network.

## Difficulty
Beginner

## Use Case
You want to instantly show content and you don't mind to be temporary out of
sync with the server.

## Solution
Serve the content from the cache but at the same time, perform a network request
to update the cache entry ensuring next time the user visit the page she will
see up to date content.

See
[cache, update and warn](strategy-cache-update-and-warn.html) for an interesting
variation.

## Category
Caching strategies
