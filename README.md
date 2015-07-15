# delacourt at a glance

[![Build Status](https://travis-ci.org/kimhanjoon/sdsfoodcourtmenu.svg?branch=master)](https://travis-ci.org/kimhanjoon/sdsfoodcourtmenu)

삼성SDS 지하식당의 [델라코드(delacourt)](http://www.sdsfoodmenu.co.kr:9106/foodcourt/menuplanner/list)의 메뉴를 페이지전환없이 한눈에 보기 편하게 만든 [사이트](http://daag.kr.pe).

## delacourt 메뉴 페이지

[지하1층 메뉴](http://www.sdsfoodmenu.co.kr:9106/foodcourt/menuplanner/list?zoneId=ZONE01)와 [지하2층 메뉴](http://www.sdsfoodmenu.co.kr:9106/foodcourt/menuplanner/list?zoneId=ZONE02)가 별도의 접속주소를 가지고 있고, 오른쪽 위에 위치한 B1,B2 버튼으로 서로를 링크하고 있다.

메뉴마다의 한글이름, 영문이름, 칼로리, 가격, 이미지주소를 표시하고 있고, html tag만으로는 구분할 수 었어서 span tag의 순서로 각각을 구분해야 한다.

판매종료가 되는 경우, 가격 대신 "판매종료"라는 문구가 표시되고, 나머지 항목에는 취소선이 그어진다.

식사시간이 아닌 경우에는 다음 식사시간의 메뉴가 표시되거나 아예 표시되지 않고 운영시간이 표시된다.

## 개선점

지하1층과 지하2층의 메뉴를 페이지 전환 없이 확인

메뉴가격을 회사보조금을 공제한 금액으로 표시

적은 스크롤로 더 많은 메뉴를 확인할 수 있도록, 하나의 메뉴를 표시하는 높이를 줄임, 판매종료된 메뉴는 짧게 표시

영어권 사용자는 한글이름보다 영문이름을 더 쉽게 볼 수 있도록 표시, Request Header의 Accept-Language로 판단함

음식사진 이미지를 jpg로 압축하여 1/10 수준의 크기로 줄이고, 캐쉬되도록 변경, imageMagick 사용

## delacourt at a glance 파일 구조

jamsilmenu/ : 식사시간이 아니어도 테스트할 수 있도록 특정일자의 html을 보관

jamsilmenu/fetch-html.js : 실제 서버에 실시간 접속하여 지하1층,2층 html 저장

example.js : jamsilmenu/의 html으로 테스트해서 public의 jamsilmenu.html과 .json 파일 생성

express-server.js : web server 실행, --port 포트번호 --proxy 프록시주소

parse.js : html 파일을 파싱해서 메뉴정보를 자바스크립트 객체로 만들고 서비스할 결과 html까지 구성

template.html : 서비스 대상 html의 템플릿 파일
