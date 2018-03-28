var express = require('express');
var app = express();
var request = require('request');
var cheerio = require('cheerio');
var jsonframe = require('jsonframe-cheerio');
var fs = require('fs');
var _ = require('underscore');

app.set('view engine', 'ejs');

// get array of items for /scrape
app.get('/items', function (req, res) {
    request({
        url: 'https://raw.githubusercontent.com/joshuaduffy/dota2api/master/dota2api/ref/items.json',
        json: true
    }, function (error, response, data) {
        if (!error && response.statusCode === 200) {
            var items = data.items;
            items = _.pluck(items, 'localized_name');

            // remove items not necessary for item builds
            items = _.filter(items, function (item) { return !(new RegExp('[:\)\(]')).test(item); });

            // remove apostrophes
            items = _.map(items, function (item) {
                if ((new RegExp('(\')')).test(item)) { item = item.toString().replace('\'', ''); }
                return "'" + item + "'";
            });

            res.render('items', { 'data': items });
        }
    });
});

// get JSON data for all necessary items
app.get('/scrape', function (req, res) {

    items = [
        'Blink Dagger',
        'Blades of Attack',
        'Broadsword',
        'Chainmail',
        'Claymore',
        'Helm of Iron Will',
        'Javelin',
        'Mithril Hammer',
        'Platemail',
        'Quarterstaff',
        'Quelling Blade',
        'Faerie Fire',
        'Infused Raindrops',
        'Wind Lace',
        'Ring of Protection',
        'Stout Shield',
        'Moon Shard',
        'Gauntlets of Strength',
        'Slippers of Agility',
        'Mantle of Intelligence',
        'Iron Branch',
        'Belt of Strength',
        'Band of Elvenskin',
        'Robe of the Magi',
        'Circlet',
        'Ogre Axe',
        'Blade of Alacrity',
        'Staff of Wizardry',
        'Ultimate Orb',
        'Gloves of Haste',
        'Morbid Mask',
        'Ring of Regen',
        'Sages Mask',
        'Boots of Speed',
        'Gem of True Sight',
        'Cloak',
        'Talisman of Evasion',
        'Cheese',
        'Magic Stick',
        'Magic Wand',
        'Ghost Scepter',
        'Clarity',
        'Enchanted Mango',
        'Healing Salve',
        'Dust of Appearance',
        'Bottle',
        'Observer Ward',
        'Sentry Ward',
        'Observer and Sentry Wards',
        'Tango',
        'Animal Courier',
        'Town Portal Scroll',
        'Boots of Travel',
        'Boots of Travel Level 2',
        'Phase Boots',
        'Demon Edge',
        'Eaglesong',
        'Reaver',
        'Sacred Relic',
        'Hyperstone',
        'Ring of Health',
        'Void Stone',
        'Mystic Staff',
        'Energy Booster',
        'Point Booster',
        'Vitality Booster',
        'Power Treads',
        'Hand of Midas',
        'Oblivion Staff',
        'Perseverance',
        'Poor Mans Shield',
        'Bracer',
        'Wraith Band',
        'Null Talisman',
        'Mekansm',
        'Vladmirs Offering',
        'Buckler',
        'Ring of Basilius',
        'Pipe of Insight',
        'Urn of Shadows',
        'Headdress',
        'Scythe of Vyse',
        'Orchid Malevolence',
        'Bloodthorn',
        'Echo Sabre',
        'Euls Scepter of Divinity',
        'Aether Lens',
        'Force Staff',
        'Hurricane Pike',
        'Dagon',
        'Dagon Level 2',
        'Dagon Level 3',
        'Dagon Level 4',
        'Dagon Level 5',
        'Necronomicon',
        'Necronomicon Level 2',
        'Necronomicon Level 3',
        'Aghanims Scepter',
        'Refresher Orb',
        'Assault Cuirass',
        'Heart of Tarrasque',
        'Black King Bar',
        'Aegis of the Immortal',
        'Shivas Guard',
        'Bloodstone',
        'Linkens Sphere',
        'Lotus Orb',
        'Meteor Hammer',
        'Nullifier',
        'Aeon Disk',
        'Kaya',
        'Refresher Shard',
        'Spirit Vessel',
        'Vanguard',
        'Crimson Guard',
        'Blade Mail',
        'Soul Booster',
        'Hood of Defiance',
        'Divine Rapier',
        'Monkey King Bar',
        'Radiance',
        'Butterfly',
        'Daedalus',
        'Skull Basher',
        'Battle Fury',
        'Manta Style',
        'Crystalys',
        'Dragon Lance',
        'Armlet of Mordiggian',
        'Shadow Blade',
        'Silver Edge',
        'Sange and Yasha',
        'Satanic',
        'Mjollnir',
        'Eye of Skadi',
        'Sange',
        'Helm of the Dominator',
        'Maelstrom',
        'Desolator',
        'Yasha',
        'Mask of Madness',
        'Diffusal Blade',
        'Ethereal Blade',
        'Soul Ring',
        'Arcane Boots',
        'Octarine Core',
        'Orb of Venom',
        'Blight Stone',
        'Drum of Endurance',
        'Medallion of Courage',
        'Solar Crest',
        'Smoke of Deceit',
        'Tome of Knowledge',
        'Veil of Discord',
        'Guardian Greaves',
        'Rod of Atos',
        'Iron Talon Recipe',
        'Iron Talon',
        'Abyssal Blade',
        'Heavens Halberd',
        'Ring of Aquila',
        'Tranquil Boots',
        'Shadow Amulet',
        'Glimmer Cape'
    ];
    
    for (item in items) {
        var itemName = items[item];
        
        // converts item name to kebab case
        itemName = itemName.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/\s+/g, '-').toLowerCase();
        endpoint = 'http://www.dotabuff.com/items/' + itemName;

        request(endpoint, function (error, response, html) {
            if (!error) {
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

                "'" + item + "'";

                fs.appendFile('dotabuff.json', "\"" + frame.name + "\": " + JSON.stringify(frame, null, 4) + ',\r\n', function (err) {
                    if (err) throw err;
                });
            }
        });
    }
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