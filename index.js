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
                stats: ".stats",
                description: ".description-block",
                notes: ".notes",
                lore: ".lore",
                builds_into: ".item-builds-into",
                builds_from: ""
            };

            frame = $('.embedded-tooltip').scrape(frame, { string: true });

            var buildsFrom = {};
            var re = new RegExp('(/assets/items/)');
            var i = -1;
            $('.embedded-tooltip img').each(function (index, elem) {
                var temp = $(this).attr('src');
                if(re.exec(temp) && i > -1) {
                    buildsFrom[i++] = re.exec(temp).input;
                } else if (i === -1 && re.exec(temp))
                    i++;
            });

            // TODO: appends buildsFrom to frame
            console.log(buildsFrom);
            console.log(frame);
        }
    });
});

app.listen('8081');
console.log('go to localhost:8081/scrape');
exports = module.exports = app;

