# dotabuff-webscraper

Scrapes [Dotabuff](https://www.dotabuff.com) for item information necessary for [shopkeeper](https://github.com/renchies/shopkeeper) in the form of a JSON file.

## Used

- Node.js
- cheerio
- jsonframe-cheerio

## TODO

- Dynamic endpoints
- Promises in endpoint handlers
- error-handling middleware function (app.use())

## Installation

~~~
npm install
~~~

## Running

~~~
node index.js
Go to localhost:8081/scrape
~~~