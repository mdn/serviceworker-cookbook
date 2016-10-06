# Cache and update
The recipe provides a service worker responding from cache to deliver fast
responses and also updating the cache entry from the network.

## Difficulty
Beginner

## Use Case
You want to instantly show content and you don't mind to be temporarily out of
sync with the server.

## Solution
Serve the content from the cache and also perform a network request to get fresh
data to update the cache entry ensuring next time the user visits the page they
will see up to date content.

See
[cache, update and refresh](/strategy-cache-update-and-refresh.html) for a
variation in which the UI is notified when the fresh data is available.

## Category
Caching strategies
