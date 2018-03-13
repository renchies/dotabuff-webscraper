var express = require('express');
var app = express();
var request = require('request');
var cheerio = require('cheerio');
var jsonframe = require('jsonframe-cheerio');
var fs = require('fs');

app.get('/scrape', function (req, res) {
    // TODO: https://www.dotabuff.com/items/ + item
    // TODO: array of items
    url = 'http://www.dotabuff.com/items/power-treads';

    request(url, function (error, response, html ) {
        if(!error) {
            var $ = cheerio.load(html);
            jsonframe($);

            var frame = {
                name: ".name",
                price: ".number",
                stats: ".attribute",
                description: ".stats",
                notes: ".notes",
                lore: ".lore",
                builds_into: ".item-builds-into",
                builds_from: ".item-builds-from"
            };

            console.log($('body').scrape(frame, { string: true }));
        }
    });
});

app.listen('8081');
console.log('go to localhost:8081/scrape');
exports = module.exports = app;

