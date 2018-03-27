# Local Download

Allow a user to "download" a file that's been generated on the client side. 

## Difficulty
Beginner

## Use Case
Often it will be necessary to include a download feature in a single page application - for example, a drawing program might want the ability to export as SVG, or a bitmap format generated client side.

## Solution
Using the serviceworker to intercept a form POST operation, pull the data from the body of the request. The data can then be put in a request that behaves as a downloadable attachment, which is fed back to the client as a file. The file will appear to have been downloaded, without any round trips to the server necessary.

## Category
Beyond Offline
