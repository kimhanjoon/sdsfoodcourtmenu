var imageConverter = require("./image.converter")('jamsil');

// class로만 어떤 코너인지 구분이 가능하여 미리 class명을 key로 하는 객체를 구성한다.
var mapperClassname2Cornername = {
	"DEPT001-group" : "KOREAN 1"
	, "DEPT002-group" : "KOREAN 2"
	, "DEPT003-group" : "湯탕맛기픈"
	, "DEPT004-group" : "가츠&엔"
	, "DEPT005-group" : "WESTERN"
	, "DEPT006-group" : "Snapsnack"		// class만 있고, 실제 데이터는 없음
	, "DEPT007-group" : "Take me Out"		// class만 있고, 실제 데이터는 없음
	, "DSDS011-group" : "KOREAN 1"
	, "DSDS012-group" : "KOREAN 2"
	, "DSDS013-group" : "Napolipoli"
	, "DSDS014-group" : "asian*picks"
	, "DSDS015-group" : "고슬고슬비빈"
	, "DSDS016-group" : "Chef's Counter"
	, "DSDS017-group" : "XingFu China"
	, "DSDS018-group" : "우리味각면"
};
var hex = require("./hex");

var cheerio = require('cheerio');
exports.parse = function (html) {
	var $ = cheerio.load(html);
	var floor = $("img[src*=b1_n]").length > 0 ? "b1" : "b2";
	var foods = $("tr")
	.slice(1)
	.filter(function(index, element) {
		return $(element).find("span").text().indexOf("운영시간") === -1;
	})

	// HTML 파싱
	.map(function(index, element) {
		var $e = $(element);
		var food = {};
		food.title_kor = $e.find("span:nth-child(1)").text();
		food.title_eng = $e.find("span:nth-child(3)").text();
		food.id = hex.to4Hex(food.title_kor);

		food.kcal = Number($e.find("span:nth-child(5)").text().replace(" kcal", ""));

		// 판매종료된 메뉴는 <del> 태그가 들어가고 가격이 표시되지 않는다.
		food.soldout = $e.find("del").length > 0 ? true : false;
		if( !food.soldout ) {
			food.price = Number($e.find("span:nth-child(7)").text().replace("원", "").replace(",", ""));
		}

		// <img>태그의 src에 도메인주소 추가하고 jsessionid는 제거
		food.img_src = "http://www.sdsfoodmenu.co.kr:9106/" + $e.find("img").attr('src').replace(/;.*\?/, "?");

		food.corner = mapperClassname2Cornername[$e.closest("div[class$=group]").attr("class")];
		food.floor = floor;

		return food;
	})

	// 추가정보 및 이미지주소 변경
	.each(function(index, food) {

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

		// 6000원 미만은 3000원 공제, 이상은 2500원 공제
		if( food.price ) {
			if( food.price < 6000 ) {
				food.payments = food.price - 3000;
			}
			else {
				food.payments = food.price - 2500;
			}
		}
		
		// 캐쉬체크 없이 항상 foodId로 접근하도록 한다. (항상 이미지를 준비해놓도록 할 것이므로)
		// 그리고 사용자가 업로드한 사진도 이미지에 붙여놓을 것이므로 따로 주소를 전달하지 않는다.

		// 그러나 이미지 파일이 없는 경우 No Image 사용
		if( food.img_src.indexOf("food_sold_out_01_01.png") > -1 ) {
			food.img_src = "/no_image_available.jpg";
		}
		else {
			// 이미지 처리
			imageConverter.put(food.id, food.img_src);

			food.img_src = "/image/food/jamsil/" + food.id + ".jpg";
		}
	})
	.get();

	return foods;
};
