# REST API Session Deferrer
This recipe shows how to record requests to a remote REST API while offline and defer them until regaining connectivity.

## Difficulty
Advanced

## Use case
As a web app developer, I want to provide functionality during offline, synchronizing with the server once the network is available again.

## Solution
Use a Service Worker to intercept requests. While offline, record the succesive requests in a queue to preserve the order and answer with fake responses. If online, flush the queue to replay the session and sync with the server.

This advanced technique is intended to integrate with REST APIs and it requires the client to deal with asynchronous create (`POST`) operations (HTTP answering with status code 202, Accepted). 

## Category
More than offline
