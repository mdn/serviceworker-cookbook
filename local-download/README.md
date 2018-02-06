# Local Download

Allow a user to "download" a file that's been generated on the client side. 

## Difficulty
Beginner

## Use Case
Often it will be necessary to include a download feature in a single page application - for example, a draw program might want the ability to export as SVG, or a map 

Because serviceworkers can respond to POST events, this allows us to attach the data to a POST operation. The service worker then pulls the data off of the request and returns it to the user as a file.

## Category
Beyond Offline
