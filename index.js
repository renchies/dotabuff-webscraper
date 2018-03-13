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
            var id = 0;

            // Build info only contains images, so get item names from image urls
            $('.embedded-tooltip img').each(function (index, elem) {
                var pattern = new RegExp('(/assets/items/)');
                var itemUrl = pattern.exec($(this).attr('src')); //only choose urls that are items
                
                if (itemUrl && id++) // skips first valid url
                    builds_from.push(itemUrl.input);
            });

            frame = $('.embedded-tooltip').scrape(frame, { string: true });
            builds_from = _.extend({}, builds_from);
            frame["builds_from"] = _.extend({}, { builds_from });

            console.log(builds_from);
            console.log(frame); // TODO: not displaying builds_from attribute
        }
    });
});

app.listen('8081');
console.log('go to localhost:8081/scrape');
exports = module.exports = app;