# Request sync
This recipe illustrates how to use a service worker to impersonate a remote server when connection is not reliable. This false server delays any request to the network until the connection is restored, at that moment, the Service Worker synchronizes with the server.

## Difficulty
Intermediate

## Use case
As a web app developer, I want to provide functionality when network is not reachable, synchronizing with the server once the network is available again.

## Solution
If network is not available, let the Service Worker answer with a generic response then enqueue the request
until the network is reachable again.

## Category
More than offline
