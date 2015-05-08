var request = require('request');
var parser = require('./parser.js');
var cheerio = require('cheerio');

request("http://www.sdsfoodmenu.co.kr:9106/foodcourt/menuplanner/list?zoneId=ZONE01", function(error, response, body) {
    console.log(parser.parse(body));
});
