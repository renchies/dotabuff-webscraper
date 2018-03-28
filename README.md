# dotabuff-webscraper

Scrapes [Dotabuff](https://www.dotabuff.com) for item information necessary for [shopkeeper](https://github.com/renchies/shopkeeper) in the form of a JSON file.

## Used

- Node.js
- cheerio
- jsonframe-cheerio
- Underscorejs

## TODO

~~-Multiple endpoints~~
- Filter out undefined items from json
- Handle items with multiple levels (repeats)
- Handle multiple endpoints asynchronously
- Promises in endpoint handlers
- Error-handling middleware function (app.use())

## Installation

~~~
npm install
~~~

## Running

~~~
$ node index.js
Update item list by going to localhost:8081/items
Replace items array in /scrape function with updated items
Restart localhost
Go to localhost:8081/scrape
~~~