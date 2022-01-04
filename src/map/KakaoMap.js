import { useEffect } from "react";
import React from "react";

const KakaoMap = () => {
  const { kakao } = window;

  useEffect(() => {
    const MARKER_WIDTH = 33, // 기본, 클릭 마커의 너비
      MARKER_HEIGHT = 36, // 기본, 클릭 마커의 높이
      OFFSET_X = 12, // 기본, 클릭 마커의 기준 X좌표
      OFFSET_Y = MARKER_HEIGHT, // 기본, 클릭 마커의 기준 Y좌표
      OVER_MARKER_WIDTH = 40, // 오버 마커의 너비
      OVER_MARKER_HEIGHT = 42, // 오버 마커의 높이
      OVER_OFFSET_X = 13, // 오버 마커의 기준 X좌표
      OVER_OFFSET_Y = OVER_MARKER_HEIGHT, // 오버 마커의 기준 Y좌표
      SPRITE_MARKER_URL =
        "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markers_sprites2.png", // 스프라이트 마커 이미지 URL
      SPRITE_WIDTH = 126, // 스프라이트 이미지 너비
      SPRITE_HEIGHT = 146, // 스프라이트 이미지 높이
      SPRITE_GAP = 10; // 스프라이트 이미지에서 마커간 간격

    const markerSize = new kakao.maps.Size(MARKER_WIDTH, MARKER_HEIGHT), // 기본, 클릭 마커의 크기
      markerOffset = new kakao.maps.Point(OFFSET_X, OFFSET_Y), // 기본, 클릭 마커의 기준좌표
      overMarkerSize = new kakao.maps.Size(
        OVER_MARKER_WIDTH,
        OVER_MARKER_HEIGHT
      ), // 오버 마커의 크기
      overMarkerOffset = new kakao.maps.Point(OVER_OFFSET_X, OVER_OFFSET_Y), // 오버 마커의 기준 좌표
      spriteImageSize = new kakao.maps.Size(SPRITE_WIDTH, SPRITE_HEIGHT); // 스프라이트 이미지의 크기

    var positions = [
        // 마커의 위치
        new kakao.maps.LatLng(33.44975, 126.56967),
        new kakao.maps.LatLng(33.450579, 126.56956),
        new kakao.maps.LatLng(33.4506468, 126.5707),
      ],
      selectedMarker = null; // 클릭한 마커를 담을 변수

    let container = document.querySelector("#map");
    let options = {
      center: new kakao.maps.LatLng(33.44975, 126.56967),
      level: 3,
      // level: 9~10 정도가 우리가 설정할 값
    };

    let map = new kakao.maps.Map(container, options);

    for (var i = 0, len = positions.length; i < len; i++) {
      const gapX = MARKER_WIDTH + SPRITE_GAP, // 스프라이트 이미지에서 마커로 사용할 이미지 X좌표 간격 값
        originY = (MARKER_HEIGHT + SPRITE_GAP) * i, // 스프라이트 이미지에서 기본, 클릭 마커로 사용할 Y좌표 값
        overOriginY = (OVER_MARKER_HEIGHT + SPRITE_GAP) * i, // 스프라이트 이미지에서 오버 마커로 사용할 Y좌표 값
        normalOrigin = new kakao.maps.Point(0, originY), // 스프라이트 이미지에서 기본 마커로 사용할 영역의 좌상단 좌표
        clickOrigin = new kakao.maps.Point(gapX, originY), // 스프라이트 이미지에서 마우스오버 마커로 사용할 영역의 좌상단 좌표
        overOrigin = new kakao.maps.Point(gapX * 2, overOriginY); // 스프라이트 이미지에서 클릭 마커로 사용할 영역의 좌상단 좌표

      // 마커를 생성하고 지도위에 표시합니다
      addMarker(positions[i], normalOrigin, overOrigin, clickOrigin);
    }

    // 마커를 생성하고 지도 위에 표시하고, 마커에 mouseover, mouseout, click 이벤트를 등록하는 함수입니다
    const addMarker = (position, normalOrigin, overOrigin, clickOrigin) => {
      // 기본 마커이미지, 오버 마커이미지, 클릭 마커이미지를 생성합니다
      const normalImage = createMarkerImage(
          markerSize,
          markerOffset,
          normalOrigin
        ),
        overImage = createMarkerImage(
          overMarkerSize,
          overMarkerOffset,
          overOrigin
        ),
        clickImage = createMarkerImage(markerSize, markerOffset, clickOrigin);

      // 마커를 생성하고 이미지는 기본 마커 이미지를 사용합니다
      let marker = new kakao.maps.Marker({
        map: map,
        position: position,
        image: normalImage,
        clickable: true,
      });

      marker.setMap(map);
      marker.setDraggable(true);

      // 마커 객체에 마커아이디와 마커의 기본 이미지를 추가합니다
      marker.normalImage = normalImage;

      // 마커에 mouseover 이벤트를 등록합니다
      kakao.maps.event.addListener(marker, "mouseover", function () {
        // 클릭된 마커가 없고, mouseover된 마커가 클릭된 마커가 아니면
        // 마커의 이미지를 오버 이미지로 변경합니다
        if (!selectedMarker || selectedMarker !== marker) {
          marker.setImage(overImage);
        }
      });

      // 마커에 mouseout 이벤트를 등록합니다
      kakao.maps.event.addListener(marker, "mouseout", function () {
        // 클릭된 마커가 없고, mouseout된 마커가 클릭된 마커가 아니면
        // 마커의 이미지를 기본 이미지로 변경합니다
        if (!selectedMarker || selectedMarker !== marker) {
          marker.setImage(normalImage);
        }
      });

      let iwContent =
          '<div style="padding:5px;">info of hotel or restaurant</div>',
        iwRemoveable = true; // removeable 속성을 ture 로 설정하면 인포윈도우를 닫을 수 있는 x버튼이 표시됩니다

      // 인포윈도우를 생성합니다
      let infowindow = new kakao.maps.InfoWindow({
        map: map, // 인포윈도우가 표시될 지도
        content: iwContent,
        removable: iwRemoveable,
        // x표시가 아니라 다른 마커 선택시 자동으로 없어지게끔 하기
      });

      // 마커에 클릭이벤트를 등록합니다
      kakao.maps.event.addListener(marker, "click", () => {
        // 마커 위에 인포윈도우를 표시합니다
        infowindow.open(map, marker);
        // 클릭된 마커가 없고, click 마커가 클릭된 마커가 아니면
        // 마커의 이미지를 클릭 이미지로 변경합니다
        if (!selectedMarker || selectedMarker !== marker) {
          // 클릭된 마커 객체가 null이 아니면
          // 클릭된 마커의 이미지를 기본 이미지로 변경하고
          !!selectedMarker &&
            selectedMarker.setImage(selectedMarker.normalImage);

          // 현재 클릭된 마커의 이미지는 클릭 이미지로 변경합니다
          marker.setImage(clickImage);
        }

        // 클릭된 마커를 현재 클릭된 마커 객체로 설정합니다
        selectedMarker = marker;
      });
    };

    // MakrerImage 객체를 생성하여 반환하는 함수입니다
    const createMarkerImage = (markerSize, offset, spriteOrigin) => {
      const markerImage = new kakao.maps.MarkerImage(
        SPRITE_MARKER_URL, // 스프라이트 마커 이미지 URL
        markerSize, // 마커의 크기
        {
          offset: offset, // 마커 이미지에서의 기준 좌표
          spriteOrigin: spriteOrigin, // 스트라이프 이미지 중 사용할 영역의 좌상단 좌표
          spriteSize: spriteImageSize, // 스프라이트 이미지의 크기
        }
      );

      return markerImage;
    };
  }, []);

  return (
    <div>
      <div id="map" style={{ width: "1000px", height: "500px" }}></div>
    </div>
  );
};

export default KakaoMap;

/* 

// 4. 클릭 이벤트 & 마커 찍기 -> 우리가 할거는 클릭 이벤트 발생시 위도, 경도를 알려줄게 아니라 그 장소에 대한 정보를 불러올것
// 지도를 클릭한 위치에 표출할 마커입니다
let marker = new kakao.maps.Marker({ 
    // 지도 중심좌표에 마커를 생성합니다 
    position: map.getCenter() 
}); 
// 지도에 마커를 표시합니다
marker.setMap(map);

// 지도에 클릭 이벤트를 등록합니다
// 지도를 클릭하면 마지막 파라미터로 넘어온 함수를 호출합니다
kakao.maps.event.addListener(map, 'click', function(mouseEvent) {        
    
    // 클릭한 위도, 경도 정보를 가져옵니다 
    let latlng = mouseEvent.latLng; 
    
    // 마커 위치를 클릭한 위치로 옮깁니다
    marker.setPosition(latlng);
    
    let message = '클릭한 위치의 위도는 ' + latlng.getLat() + ' 이고, ';
    message += '경도는 ' + latlng.getLng() + ' 입니다';
    
    let resultDiv = document.getElementById('clickLatlng'); 
    resultDiv.innerHTML = message;
    
});


// 6. 마커마다 다른 이미지를 넣어서 호텔이나 가게등을 구별할 수 있다.
// 커피숍 마커가 표시될 좌표 배열입니다
var coffeePositions = [ 
    new kakao.maps.LatLng(37.499590490909185, 127.0263723554437),
    new kakao.maps.LatLng(37.499427948430814, 127.02794423197847),
    new kakao.maps.LatLng(37.498553760499505, 127.02882598822454),
    new kakao.maps.LatLng(37.497625593121384, 127.02935713582038),
    new kakao.maps.LatLng(37.49646391248451, 127.02675574250912),
    new kakao.maps.LatLng(37.49629291770947, 127.02587362608637),
    new kakao.maps.LatLng(37.49754540521486, 127.02546694890695)                
];

// 편의점 마커가 표시될 좌표 배열입니다
var storePositions = [
    new kakao.maps.LatLng(37.497535461505684, 127.02948149502778),
    new kakao.maps.LatLng(37.49671536281186, 127.03020491448352),
    new kakao.maps.LatLng(37.496201943633714, 127.02959405469642),
    new kakao.maps.LatLng(37.49640072567703, 127.02726459882308),
    new kakao.maps.LatLng(37.49640098874988, 127.02609983175294),
    new kakao.maps.LatLng(37.49932849491523, 127.02935780247945),
    new kakao.maps.LatLng(37.49996818951873, 127.02943721562295)
];

// 주차장 마커가 표시될 좌표 배열입니다
var carparkPositions = [
    new kakao.maps.LatLng(37.49966168796031, 127.03007039430118),
    new kakao.maps.LatLng(37.499463762912974, 127.0288828824399),
    new kakao.maps.LatLng(37.49896834100913, 127.02833986892401),
    new kakao.maps.LatLng(37.49893267508434, 127.02673400572665),
    new kakao.maps.LatLng(37.49872543597439, 127.02676785815386),
    new kakao.maps.LatLng(37.49813096097184, 127.02591949495914),
    new kakao.maps.LatLng(37.497680616783086, 127.02518427952202)                       
];    

var markerImageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/category.png';  // 마커이미지의 주소입니다. 스프라이트 이미지 입니다
    coffeeMarkers = [], // 커피숍 마커 객체를 가지고 있을 배열입니다
    storeMarkers = [], // 편의점 마커 객체를 가지고 있을 배열입니다
    carparkMarkers = []; // 주차장 마커 객체를 가지고 있을 배열입니다

    
createCoffeeMarkers(); // 커피숍 마커를 생성하고 커피숍 마커 배열에 추가합니다
createStoreMarkers(); // 편의점 마커를 생성하고 편의점 마커 배열에 추가합니다
createCarparkMarkers(); // 주차장 마커를 생성하고 주차장 마커 배열에 추가합니다

changeMarker('coffee'); // 지도에 커피숍 마커가 보이도록 설정합니다    


// 마커이미지의 주소와, 크기, 옵션으로 마커 이미지를 생성하여 리턴하는 함수입니다
function createMarkerImage(src, size, options) {
    var markerImage = new kakao.maps.MarkerImage(src, size, options);
    return markerImage;            
}

// 좌표와 마커이미지를 받아 마커를 생성하여 리턴하는 함수입니다
function createMarker(position, image) {
    var marker = new kakao.maps.Marker({
        position: position,
        image: image
    });
    
    return marker;  
}   
   
// 커피숍 마커를 생성하고 커피숍 마커 배열에 추가하는 함수입니다
function createCoffeeMarkers() {
    
    for (var i = 0; i < coffeePositions.length; i++) {  
        
        var imageSize = new kakao.maps.Size(22, 26),
            imageOptions = {  
                spriteOrigin: new kakao.maps.Point(10, 0),    
                spriteSize: new kakao.maps.Size(36, 98)  
            };     
        
        // 마커이미지와 마커를 생성합니다
        var markerImage = createMarkerImage(markerImageSrc, imageSize, imageOptions),    
            marker = createMarker(coffeePositions[i], markerImage);  
        
        // 생성된 마커를 커피숍 마커 배열에 추가합니다
        coffeeMarkers.push(marker);
    }     
}

// 커피숍 마커들의 지도 표시 여부를 설정하는 함수입니다
function setCoffeeMarkers(map) {        
    for (var i = 0; i < coffeeMarkers.length; i++) {  
        coffeeMarkers[i].setMap(map);
    }        
}

// 편의점 마커를 생성하고 편의점 마커 배열에 추가하는 함수입니다
function createStoreMarkers() {
    for (var i = 0; i < storePositions.length; i++) {
        
        var imageSize = new kakao.maps.Size(22, 26),
            imageOptions = {   
                spriteOrigin: new kakao.maps.Point(10, 36),    
                spriteSize: new kakao.maps.Size(36, 98)  
            };       
     
        // 마커이미지와 마커를 생성합니다
        var markerImage = createMarkerImage(markerImageSrc, imageSize, imageOptions),    
            marker = createMarker(storePositions[i], markerImage);  

        // 생성된 마커를 편의점 마커 배열에 추가합니다
        storeMarkers.push(marker);    
    }        
}

// 편의점 마커들의 지도 표시 여부를 설정하는 함수입니다
function setStoreMarkers(map) {        
    for (var i = 0; i < storeMarkers.length; i++) {  
        storeMarkers[i].setMap(map);
    }        
}

// 주차장 마커를 생성하고 주차장 마커 배열에 추가하는 함수입니다
function createCarparkMarkers() {
    for (var i = 0; i < carparkPositions.length; i++) {
        
        var imageSize = new kakao.maps.Size(22, 26),
            imageOptions = {   
                spriteOrigin: new kakao.maps.Point(10, 72),    
                spriteSize: new kakao.maps.Size(36, 98)  
            };       
     
        // 마커이미지와 마커를 생성합니다
        var markerImage = createMarkerImage(markerImageSrc, imageSize, imageOptions),    
            marker = createMarker(carparkPositions[i], markerImage);  

        // 생성된 마커를 주차장 마커 배열에 추가합니다
        carparkMarkers.push(marker);        
    }                
}

// 주차장 마커들의 지도 표시 여부를 설정하는 함수입니다
function setCarparkMarkers(map) {        
    for (var i = 0; i < carparkMarkers.length; i++) {  
        carparkMarkers[i].setMap(map);
    }        
}

// 카테고리를 클릭했을 때 type에 따라 카테고리의 스타일과 지도에 표시되는 마커를 변경합니다
function changeMarker(type){
    
    var coffeeMenu = document.getElementById('coffeeMenu');
    var storeMenu = document.getElementById('storeMenu');
    var carparkMenu = document.getElementById('carparkMenu');
    
    // 커피숍 카테고리가 클릭됐을 때
    if (type === 'coffee') {
    
        // 커피숍 카테고리를 선택된 스타일로 변경하고
        coffeeMenu.className = 'menu_selected';
        
        // 편의점과 주차장 카테고리는 선택되지 않은 스타일로 바꿉니다
        storeMenu.className = '';
        carparkMenu.className = '';
        
        // 커피숍 마커들만 지도에 표시하도록 설정합니다
        setCoffeeMarkers(map);
        setStoreMarkers(null);
        setCarparkMarkers(null);
        
    } else if (type === 'store') { // 편의점 카테고리가 클릭됐을 때
    
        // 편의점 카테고리를 선택된 스타일로 변경하고
        coffeeMenu.className = '';
        storeMenu.className = 'menu_selected';
        carparkMenu.className = '';
        
        // 편의점 마커들만 지도에 표시하도록 설정합니다
        setCoffeeMarkers(null);
        setStoreMarkers(map);
        setCarparkMarkers(null);
        
    } else if (type === 'carpark') { // 주차장 카테고리가 클릭됐을 때
     
        // 주차장 카테고리를 선택된 스타일로 변경하고
        coffeeMenu.className = '';
        storeMenu.className = '';
        carparkMenu.className = 'menu_selected';
        
        // 주차장 마커들만 지도에 표시하도록 설정합니다
        setCoffeeMarkers(null);
        setStoreMarkers(null);
        setCarparkMarkers(map);  
    }    
}

// 7. 가게나 호텔등의 마커에 커스텀 오버레이한걸 닫기 가능
// 커스텀 오버레이에 표시할 컨텐츠 입니다
// 커스텀 오버레이는 아래와 같이 사용자가 자유롭게 컨텐츠를 구성하고 이벤트를 제어할 수 있기 때문에
// 별도의 이벤트 메소드를 제공하지 않습니다 
var content = '<div class="wrap">' + 
            '    <div class="info">' + 
            '        <div class="title">' + 
            '            카카오 스페이스닷원' + 
            '            <div class="close" onclick="closeOverlay()" title="닫기"></div>' + 
            '        </div>' + 
            '        <div class="body">' + 
            '            <div class="img">' +
            '                <img src="https://cfile181.uf.daum.net/image/250649365602043421936D" width="73" height="70">' +
            '           </div>' + 
            '            <div class="desc">' + 
            '                <div class="ellipsis">제주특별자치도 제주시 첨단로 242</div>' + 
            '                <div class="jibun ellipsis">(우) 63309 (지번) 영평동 2181</div>' + 
            '                <div><a href="https://www.kakaocorp.com/main" target="_blank" class="link">홈페이지</a></div>' + 
            '            </div>' + 
            '        </div>' + 
            '    </div>' +    
            '</div>';

// 마커 위에 커스텀오버레이를 표시합니다
// 마커를 중심으로 커스텀 오버레이를 표시하기위해 CSS를 이용해 위치를 설정했습니다
var overlay = new kakao.maps.CustomOverlay({
    content: content,
    map: map,
    position: marker.getPosition()       
});

// 마커를 클릭했을 때 커스텀 오버레이를 표시합니다
kakao.maps.event.addListener(marker, 'click', function() {
    overlay.setMap(map);
});

// 커스텀 오버레이를 닫기 위해 호출되는 함수입니다 
function closeOverlay() {
    overlay.setMap(null);     
}

// 8. 주소로 장소 표시 
// 주소-좌표 변환 객체를 생성합니다
var geocoder = new kakao.maps.services.Geocoder();

// 주소로 좌표를 검색합니다
geocoder.addressSearch('제주특별자치도 제주시 첨단로 242', function(result, status) {

    // 정상적으로 검색이 완료됐으면 
     if (status === kakao.maps.services.Status.OK) {

        var coords = new kakao.maps.LatLng(result[0].y, result[0].x);

        // 결과값으로 받은 위치를 마커로 표시합니다
        var marker = new kakao.maps.Marker({
            map: map,
            position: coords
        });

        // 인포윈도우로 장소에 대한 설명을 표시합니다
        var infowindow = new kakao.maps.InfoWindow({
            content: '<div style="width:150px;text-align:center;padding:6px 0;">우리회사</div>'
        });
        infowindow.open(map, marker);

        // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
        map.setCenter(coords);
    } 
});  

// 9. 좌표로 주소 얻기
// 주소-좌표 변환 객체를 생성합니다
var geocoder = new kakao.maps.services.Geocoder();

var marker = new kakao.maps.Marker(), // 클릭한 위치를 표시할 마커입니다
    infowindow = new kakao.maps.InfoWindow({zindex:1}); // 클릭한 위치에 대한 주소를 표시할 인포윈도우입니다

// 현재 지도 중심좌표로 주소를 검색해서 지도 좌측 상단에 표시합니다
searchAddrFromCoords(map.getCenter(), displayCenterInfo);

// 지도를 클릭했을 때 클릭 위치 좌표에 대한 주소정보를 표시하도록 이벤트를 등록합니다
kakao.maps.event.addListener(map, 'click', function(mouseEvent) {
    searchDetailAddrFromCoords(mouseEvent.latLng, function(result, status) {
        if (status === kakao.maps.services.Status.OK) {
            var detailAddr = !!result[0].road_address ? '<div>도로명주소 : ' + result[0].road_address.address_name + '</div>' : '';
            detailAddr += '<div>지번 주소 : ' + result[0].address.address_name + '</div>';
            
            var content = '<div class="bAddr">' +
                            '<span class="title">법정동 주소정보</span>' + 
                            detailAddr + 
                        '</div>';

            // 마커를 클릭한 위치에 표시합니다 
            marker.setPosition(mouseEvent.latLng);
            marker.setMap(map);

            // 인포윈도우에 클릭한 위치에 대한 법정동 상세 주소정보를 표시합니다
            infowindow.setContent(content);
            infowindow.open(map, marker);
        }   
    });
});

// 중심 좌표나 확대 수준이 변경됐을 때 지도 중심 좌표에 대한 주소 정보를 표시하도록 이벤트를 등록합니다
kakao.maps.event.addListener(map, 'idle', function() {
    searchAddrFromCoords(map.getCenter(), displayCenterInfo);
});

function searchAddrFromCoords(coords, callback) {
    // 좌표로 행정동 주소 정보를 요청합니다
    geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);         
}

function searchDetailAddrFromCoords(coords, callback) {
    // 좌표로 법정동 상세 주소 정보를 요청합니다
    geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
}

// 지도 좌측상단에 지도 중심좌표에 대한 주소정보를 표출하는 함수입니다
function displayCenterInfo(result, status) {
    if (status === kakao.maps.services.Status.OK) {
        var infoDiv = document.getElementById('centerAddr');

        for(var i = 0; i < result.length; i++) {
            // 행정동의 region_type 값은 'H' 이므로
            if (result[i].region_type === 'H') {
                infoDiv.innerHTML = result[i].address_name;
                break;
            }
        }
    }    
}

//10. ~ 키워드로 장소 검색 || 카테고리로 장소검색 
*/
