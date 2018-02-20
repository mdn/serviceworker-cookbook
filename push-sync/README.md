# XXX

Maintain a single connection between your application server and multiple clients and use the service worker as a notification dispatcher.
This solution is similar to having a single shared worker and multiple clients, but is more efficient (there's no need to keep a WebSocket connection between the worker and your server).

## Difficulty
Advanced

## Category
Web Push
