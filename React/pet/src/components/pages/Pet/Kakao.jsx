import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const { kakao } = window;

const Kakao = () => {
    const location = useLocation();
    const goAnimal = location.state;

    // console.log("gggggg", goAnimal);

    useEffect(() => {
        const mapContainer = document.getElementById('map'); // 지도를 표시할 div
        const mapOptions = {
            center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
            level: 3 // 지도의 확대 레벨
        };
        
        // 지도를 생성합니다.
        const map = new kakao.maps.Map(mapContainer, mapOptions);

        // 주소-좌표 변환 객체를 생성합니다.
        const geocoder = new kakao.maps.services.Geocoder();

        // 주소로 좌표를 검색합니다.
        geocoder.addressSearch(`${goAnimal.careAddr}`, function(result, status){

            // 정상적으로 검색이 완료되었으면
            if (status === kakao.maps.services.Status.OK){
                
                var coords = new kakao.maps.LatLng(result[0].y, result[0].x);

                // 결과 값으로 받은 위치를 마커로 표시한다.
                var marker = new kakao.maps.Marker({
                    map: map,
                    position: coords
                });

                // 인포윈도우로 장소에 대한 설명을 표시한다.
                var infowindow = new kakao.maps.InfoWindow({
                    content: `<div style="width:150px;text-align:center;padding:6px 0;">${goAnimal.careNm}</div>`
                });
                infowindow.open(map, marker);

                // 지도의 중심을 결과값으로 받은 위치로 이동시킨다.
                map.setCenter(coords);

            }
        })
    
    }, []);

  return (
      <div id="map" style={{ width: '480px', height: '400px', display: 'flex', alignItems:'center' }}></div>
  );
};

export default Kakao;