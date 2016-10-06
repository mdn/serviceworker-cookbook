# Network or cache
The service worker in this recipe tries to retrieve the most up to date content
from the network but if the network is taking too much, it will serve cached
content instead.

## Difficulty
Beginner

## Use Case
You want to show the most up to date content but it's preferable to load fast.

## Solution
Serve content from network but include a timeout to fall back to cached data if
the answer from the network doesn't arrive on time.

## Category
Caching strategies
