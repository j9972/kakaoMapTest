import { useEffect } from "react";
import React from "react";

const KakaoMap = () => {
  const { kakao } = window;

  let container = document.querySelector("#map");
  let options = {
    center: new kakao.maps.LatLng(37.365264512305174, 127.10676860117488),
    level: 3,
  };

  useEffect(() => {
    let map = new kakao.maps.Map(container, options);
    let markerPosition = new kakao.maps.LatLng(
      37.365264512305174,
      127.10676860117488
    );
    let marker = new kakao.maps.Marker({
      position: markerPosition,
    });
    marker.setMap(map);
  }, []);

  return (
    <div>
      <div id="map" style={{ width: "500px", height: "400px" }}></div>
    </div>
  );
};

export default KakaoMap;

//
