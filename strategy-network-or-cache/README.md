# Network or cache
The recipe provides a service worker trying to retrieve the most updated content
but with no detriment of user experience.

## Difficulty
Beginner

## Use Case
You want to show the most updated content but not making the user to wait too
much.

## Solution
Try serving the content from network but include a timeout to fallback to
cache if network answer does not arrive on time.

## Category
Caching strategies
