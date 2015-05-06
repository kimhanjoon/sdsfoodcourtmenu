var request = require('request');
var cheerio = require('cheerio');

var mapperClassname2Cornername = {"DEPT001-group" : "KOREAN 1"
, "DEPT002-group" : "KOREAN 2"
, "DEPT003-group" : "탕맛기픈"
, "DEPT004-group" : "가츠엔"
, "DEPT005-group" : "WESTERN"
, "DEPT006-group" : "Snapsnack"
, "DEPT007-group" : "TAKEOUT"
, "DSDS011-group" : "KOREAN 1"
, "DSDS012-group" : "KOREAN 2"
, "DSDS013-group" : "napolipoli"
, "DSDS014-group" : ""
, "DSDS015-group" : ""
, "DSDS016-group" : ""
, "DSDS017-group" : ""
, "DSDS018-group" : ""};

request("http://www.sdsfoodmenu.co.kr:9106/foodcourt/menuplanner/list?zoneId=ZONE01", function(error, response, body) {
    var $ = cheerio.load(body);

    var foods = $("tr").slice(1).map(function(index, element) {
        var $e = $(element);
        var food = {};
        food.title_kor = $e.find("span:nth-child(1)").text();
        food.title_eng = $e.find("span:nth-child(3)").text();
        food.kcal = Number($e.find("span:nth-child(5)").text().replace(" kcal", ""));
        food.price = Number($e.find("span:nth-child(7)").text().replace("원", "").replace(",", "")) - 3000;
        food.img_src = $e.find("img").attr('src');
        food.corner = mapperClassname2Cornername[$e.closest("div[class$=group]").attr("class")];
        return food;
    });
    
    console.log(foods);
    
});
