# API Analytics

Perform API usage logging without interfering with the UI layer by adding a service worker to gather the usage and use the sync API to upload gathered data from time to time.

## Difficulty
Intermediate

## Use Case
As a web app developer, I want to add API tracking capabilities to my web application trying to not modify client code nor server code at all.

## Solution
With the use of a service worker, we intercept each request of a client and send some information to a log API.

## Category
Beyond Offline
