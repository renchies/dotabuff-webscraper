var express = require('express');
var app = express();
var request = require('request');
var cheerio = require('cheerio');
var jsonframe = require('jsonframe-cheerio');
var fs = require('fs');
var _ = require('underscore');

app.get('/scrape', function (req, res) {

    endpoint = 'http://www.dotabuff.com/items/boots-of-travel';

    request(endpoint, function (error, response, html ) {
        if(!error) {
            var $ = cheerio.load(html);
            jsonframe($);

            var frame = {
                name: ".name",
                price: ".number",
                stats: ".stats",
                description: ".description-block",
                notes: ".notes",
                lore: ".lore"
            };

            var builds_from = [], builds_into = [];

            // Build info only contains images, so get item names from image urls
            $('.item-builds-into img').each(function (index, elem) { buildArr(builds_into, $(this).attr('src')); });
            $('.item-builds-from img').each(function (index, elem) { buildArr(builds_from, $(this).attr('src')); });

            // Format data and add to frame object
            builds_from = JSON.parse(JSON.stringify(builds_from));
            builds_into = JSON.parse(JSON.stringify(builds_into));
            frame = JSON.parse($('.embedded-tooltip').scrape(frame, { string: true }));
            frame.builds_from = builds_from;
            frame.builds_into = builds_into;
            console.log(frame);
        }
    });
});

var buildArr = function (arr, url) {
    var pattern = new RegExp('(/assets/items/)');
    var itemUrl = pattern.exec(url); //only choose urls that are items
    if (itemUrl)
        arr.push(itemUrl.input);
};

app.listen('8081');
console.log('go to localhost:8081/scrape');
exports = module.exports = app;