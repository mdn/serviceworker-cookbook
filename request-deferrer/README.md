# Request Deferrer
This recipe shows how to enqueue requests while in offline in an _outbox-like_ buffer to perform the operations once the connection is regained.

## Difficulty
Advanced

## Use Case
As a modern framework developer, I want to provide an agnostic way of handling requests while offline.

## Solution
Use a Service Worker to intercept requests. While offline, record the successive requests in a queue to preserve the order and answer with fake responses. If online, flush the queue to replay the session and sync with the server.

This advanced technique is intended to integrate with REST APIs and it requires the client to deal with asynchronous create (`POST`) operations (HTTP answering with status code 202, Accepted).

The solution is a proof of concept and does not include error handling which is a real challenge in this implementation. Some of the problems are stated in the inlined documentation.

## Category
Beyond Offline
