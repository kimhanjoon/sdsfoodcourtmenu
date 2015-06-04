
// class로만 어떤 코너인지 구분이 가능하여 미리 class명을 key로 하는 객체를 구성한다.
var mapperClassname2Cornername = {
		"DEPT001-group" : "KOREAN 1"
		, "DEPT002-group" : "KOREAN 2"
		, "DEPT003-group" : "탕맛기픈"
		, "DEPT004-group" : "가츠엔"
		, "DEPT005-group" : "WESTERN"
		, "DEPT006-group" : "Snapsnack"		// class만 있고, 실제 데이터는 없음
		, "DEPT007-group" : "TAKEOUT"		// class만 있고, 실제 데이터는 없음
		, "DSDS011-group" : "KOREAN 1"
		, "DSDS012-group" : "KOREAN 2"
		, "DSDS013-group" : "Napolipoli"
		, "DSDS014-group" : "asian*picks"
		, "DSDS015-group" : "고슬고슬비빈"
		, "DSDS016-group" : "Chef's Counter"
		, "DSDS017-group" : "XingFu China"
		, "DSDS018-group" : "우리미각면"
	};

var img_cache_map = {};

var cheerio = require('cheerio');
exports.parse = function (html) {
    var $ = cheerio.load(html);
    var floor = $("img[src*=b1_n]").length > 0 ? "b1" : "b2";
    var foods = $("tr")
    	.slice(1)
    	.filter(function(index, element) {
    		return $(element).find("span").text().indexOf("운영시간") === -1;
    	})
    	.map(function(index, element) {
	        var $e = $(element);
	        var food = {};
	        food.title_kor = $e.find("span:nth-child(1)").text();
	        food.title_eng = $e.find("span:nth-child(3)").text();
	        
	        food.kcal = Number($e.find("span:nth-child(5)").text().replace(" kcal", ""));
	        
	        // 초저열량 - 저열량 - 고열량 - 초고열량 구분
	        if( food.kcal <= 680 ) {
	        	food.very_low_cal = true;
	        }
	        else if( food.kcal <= 730 ) {
	        	food.low_cal = true;
	        }
	        if( food.kcal >= 930 ) {
	        	food.very_high_cal = true;
	        }
	        else if( food.kcal >= 880 ) {
	        	food.high_cal = true;
	        }
	        
	        // 판매종료된 메뉴는 <del> 태그가 들어가고 가격이 표시되지 않는다.
	        food.soldout = $e.find("del").length > 0 ? true : false;
	        if( !food.soldout ) {
	        	
	            food.price = Number($e.find("span:nth-child(7)").text().replace("원", "").replace(",", ""));

	            // 6000원 미만은 3000원 공제, 이상은 2500원 공제
	            if( food.price < 6000 ) {
	            	food.payments = food.price - 3000; 
	            }
	            else {
	            	food.payments = food.price - 2500; 
	            }
	        }
	        
	        food.img_src = $e.find("img").attr('src');
	        if( food.img_src ) {
	        	
	        	// 이미지 파일이 없는 경우 No Image로 변경
	        	if( food.img_src.indexOf("food_sold_out_01_01.png") > -1 ) {
	        		food.img_src_data = true;
	        		food.img_src = "data:image/png;base64,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";
	        	}
	        	else {
	        		
	        		// <img>태그의 src에서 jsessionid 제거
	        		food.img_src = food.img_src.replace(/;.*\?/, "?");

	        		var re = /menuId=.*$/; 
	        		var m = re.exec(food.img_src);
	        		
	        		if ( m !== null ) {
	        			food.img_src_menuId = m.input.substr(m.index + 7);
	        			if( img_cache_map[food.img_src_menuId] ) {
	        				console.log('hit');
	        				food.img_src_data = true;
	        				food.img_src = img_cache_map[food.img_src_menuId]; 
	        			}
	        			else {
	        				console.log('miss');
	        				loadBase64Image('http://www.sdsfoodmenu.co.kr:9106/' + food.img_src, function (image, prefix) {
	        					img_cache_map[food.img_src_menuId] = "data:image/png;base64," + image;
	        				});
	        			}
	        		}
	        		
	        	}

	        	
	        }
	        
	        food.corner = mapperClassname2Cornername[$e.closest("div[class$=group]").attr("class")];
	        food.floor = floor;
	        return food;
	    });
    return foods.get();
};

var swig  = require('swig');
var template = swig.compileFile('./template.html');
exports.render = function (foods) {
    return template({foods: foods});
};

var loadBase64Image = function (url, callback) {
    // Required 'request' module
    var request = require('request');

    // Make request to our image url
    request({url: url, encoding: null}, function (err, res, body) {
        if (!err && res.statusCode == 200) {
            // So as encoding set to null then request body became Buffer object
            var base64prefix = 'data:' + res.headers['content-type'] + ';base64,'
                , image = body.toString('base64');
            if (typeof callback == 'function') {
                callback(image, base64prefix);
            }
        } else {
            throw new Error('Can not download image');
        }
    });
};