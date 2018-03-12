var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

app.get('/scrape', function (req, res) {
    // TODO: https://www.dotabuff.com/items/ + item
    // TODO: array of items
    
    url = 'https://www.dotabuff.com/items/power-treads';

    request(url, function (error, response, html ) {
        if(!error) {
            var $ = cheerio.load(html);
            var name, price, description, lore;

            var json = {
                name : "",
                price : "",
                stats : {},
                description : "",
                lore : "",
                builds_into : [{}],
                builds_from : [{}]
            };

            $('.shop-icons').filter(function () {
                var data = $(this);

                name = data.next().text();
                json.name = name;
            });
        }

        fs.writeFile('output.json', JSON.stringify(json, null, 4), function (err) {
            console.log('File successfully written.');
        });

        res.send('Details in console.');
    });
});

app.listen('8081');
exports = module.exports = app;

