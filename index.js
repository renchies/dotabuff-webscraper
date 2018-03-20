var express = require('express');
var app = express();
var request = require('request');
var cheerio = require('cheerio');
var jsonframe = require('jsonframe-cheerio');
var fs = require('fs');
var _ = require('underscore');

app.get('/scrape', function (req, res) {

    endpoint = 'http://www.dotabuff.com/items/power-treads';

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

            var builds_from = [];

            // Build info only contains images, so get item names from image urls
            $('.embedded-tooltip img').each(function (index, elem) {
                var pattern = new RegExp('(/assets/items/)');
                var itemUrl = pattern.exec($(this).attr('src')); //only choose urls that are items
                if (itemUrl)
                    builds_from.push(itemUrl.input);
            });

            builds_from = JSON.parse(JSON.stringify(builds_from));
            frame = JSON.parse($('.embedded-tooltip').scrape(frame, { string: true }));
            frame.builds_from = builds_from;
            console.log(frame);
        }
    });
});

app.listen('8081');
console.log('go to localhost:8081/scrape');
exports = module.exports = app;