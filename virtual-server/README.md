# Virtual Server
This recipe shows a service worker acting like a remote server.

## Difficulty
Intermediate

## Use Case
As an application developer, I want to to fully decouple UI from business logic.

## Solution
With REST APIs you can decouple client from business logic. The business logic is actually a separated component placed on a remote server. With Service Workers you can do the same. Simply move your business logic to a Service Worker responding on fetch events.

Instead of implementing your own logic to distinguish between routes and request methods, use [ServiceWorkerWare](https://github.com/gaia-components/serviceworkerware) or [sw-toolbox](https://github.com/GoogleChrome/sw-toolbox#defining-routes)' router feature to write your worker in a declarative way.

The client code is virtually identical to [that in the API analytics recipe](/api-analytics_index_doc.html) (the report link has been removed). On the contrary, the [remote _Express server_](/api-analytics_server_doc.html) has been completely replaced by the _[ServiceWorkerWare](https://github.com/gaia-components/serviceworkerware) worker_.

## Category
Beyond Offline
