import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { Card, Col, Row, ListGroup } from 'react-bootstrap';
import '../../styles/Pet.css';
import loading from '../../assets/loading.png';
import notfound from '../../assets/notfound.png';

const PetList = () => {

    const [data, setData] = useState([]); // 요청의 결과
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(false); // 에러

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSido, setSelectedSido] = useState('');
    const [selectedCity, setSelectedCity] = useState('');

    const itemsPerPage = 12;

    const navigateToPage = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleSidoChange = (event) => {
        setSelectedSido(event.target.value);
        setSelectedCity('');  
    };
    
    const handleCityChange = (event) => {
        setSelectedCity(event.target.value);
    };

    const getCityOptions = (selectedSido) => {
        switch (selectedSido) {
            case '6110000':
                return (
                    <>
                        <option value='6119999'>가정보호</option>
                        <option value='3220000'>강남구</option>
                        <option value='3240000'>강동구</option>
                        <option value='3080000'>강북구</option>
                        <option value='3150000'>강서구</option>
                        <option value='3200000'>관악구</option>
                        <option value='3040000'>광진구</option>
                        <option value='3160000'>구로구</option>
                        <option value='3170000'>금천구</option>
                        <option value='3100000'>노원구</option>
                        <option value='3090000'>도봉구</option>
                        <option value='3050000'>동대문구</option>
                        <option value='3190000'>동작구</option>
                        <option value='3130000'>마포구</option>
                        <option value='3120000'>서대문구</option>
                        <option value='6119998'>서울특별시</option>
                        <option value='3210000'>서초구</option>
                        <option value='3030000'>성동구</option>
                        <option value='3070000'>성북구</option>
                        <option value='3230000'>송파구</option>
                        <option value='3140000'>양천구</option>
                        <option value='3180000'>영등포구</option>
                        <option value='3020000'>용산구</option>
                        <option value='3110000'>은평구</option>
                        <option value='3000000'>종로구</option>
                        <option value='3010000'>중구</option>
                        <option value='3060000'>중랑구</option>
                    </>
                )
            // 부산
            case '6260000':
                return (
                    <>
                        <option value='3360000'>강서구</option>
                        <option value='3350000'>금정구</option>
                        <option value='3400000'>기장군</option>
                        <option value='3310000'>남구</option>
                        <option value='3270000'>동구</option>
                        <option value='3300000'>동래구</option>
                        <option value='3290000'>부산진구</option>
                        <option value='3320000'>북구</option>
                        <option value='3390000'>사상구</option>
                        <option value='3340000'>사하구</option>
                        <option value='3260000'>서구</option>
                        <option value='3380000'>수영구</option>
                        <option value='3370000'>연제구</option>
                        <option value='3280000'>영도구</option>
                        <option value='3250000'>중구</option>
                        <option value='3330000'>해운대구</option>
                    </>
                )
            // 대구
            case '6270000':
                return (
                    <>
                        <option value='5141000'>군위군</option>
                        <option value='3440000'>남구</option>
                        <option value='3470000'>달서구</option>
                        <option value='3480000'>달성군</option>
                        <option value='3420000'>동구</option>
                        <option value='3450000'>북구</option>
                        <option value='3430000'>서구</option>
                        <option value='3460000'>수성구</option>
                        <option value='3410000'>중구</option>
                    </>
                )
            // 인천광역시
            case '6280000':
                return (
                    <>
                        <option value='3570000'>강화군</option>
                        <option value='3550000'>계양구</option>
                        <option value='3530000'>남동구</option>
                        <option value='3500000'>동구</option>
                        <option value='3150000'>미추홀구</option>
                        <option value='3540000'>부평구</option>
                        <option value='3560000'>서구</option>
                        <option value='3520000'>연수구</option>
                        <option value='3580000'>옹진군</option>
                        <option value='3490000'>중구</option>
                    </>
                )        
            // 광주광역시
            case '6290000':
                return (
                    <>
                        <option value='3630000'>광산구</option>
                        <option value='6299998'>광주광역시</option>
                        <option value='3610000'>남구</option>
                        <option value='3590000'>동구</option>
                        <option value='3620000'>북구</option>
                        <option value='3600000'>서구</option>
                    </>
                )
            // 세종특별자치시
            case '5690000':
                return (
                    <>
                        <option value=''>없음</option>
                    </>
                );
            // 대전광역시
            case '6300000':
                return (
                    <>
                        <option value='3680000'>대덕구</option>
                        <option value='3640000'>동구</option>
                        <option value='3660000'>서구</option>
                        <option value='3670000'>유성구</option>
                        <option value='3650000'>중구</option>
                    </>
                )
            // 울산광역시
            case '6310000':
                return (
                    <>
                        <option value='3700000'>남구</option>
                        <option value='3710000'>동구</option>
                        <option value='3720000'>북구</option>
                        <option value='3730000'>울주군</option>
                        <option value='3690000'>중구</option>
                    </>
                )
            // 경기도
            case '6410000':
                return (
                    <>
                        <option value='4160000'>가평군</option>
                        <option value='3940000'>고양시</option>
                        <option value='3970000'>과천시</option>
                        <option value='3900000'>광명시</option>
                        <option value='5540000'>광주시</option>
                        <option value='3980000'>구리시</option>
                        <option value='4020000'>군포시</option>
                        <option value='5630000'>기흥구</option>
                        <option value='4090000'>김포시</option>
                        <option value='3990000'>남양주시</option>
                        <option value='3920000'>동두천시</option>
                        <option value='3860000'>부천시</option>
                        <option value='3780000'>성남시</option>
                        <option value='3740000'>수원시</option>
                        <option value='4010000'>시흥시</option>
                        <option value='3930000'>안산시</option>
                        <option value='4080000'>안성시</option>
                        <option value='3830000'>안양시</option>
                        <option value='5590000'>양주시</option>
                        <option value='4170000'>양평군</option>
                        <option value='5700000'>여주시</option>
                        <option value='4140000'>연천군</option>
                        <option value='4000000'>오산시</option>
                        <option value='4050000'>용인시</option>
                        <option value='4030000'>의왕시</option>
                        <option value='3820000'>의정부시</option>
                        <option value='4070000'>이천시</option>
                        <option value='4060000'>파주시</option>
                        <option value='3910000'>평택시</option>
                        <option value='5600000'>포천시</option>
                        <option value='4040000'>하남시</option>
                        <option value='5530000'>화성시</option>
                    </>
                )
            // 강원특별자치도
            case '6530000':
                return (
                    <>
                        <option value='4201000'>강릉시</option>
                        <option value='4341000'>고성군</option>
                        <option value='4211000'>동해시</option>
                        <option value='4241000'>삼척시</option>
                        <option value='4231000'>속초시</option>
                        <option value='4321000'>양주군</option>
                        <option value='4351000'>양양군</option>
                        <option value='4271000'>영월군</option>
                        <option value='4191000'>원주시</option>
                        <option value='4331000'>인제군</option>
                        <option value='4291000'>정선군</option>
                        <option value='4301000'>철원군</option>
                        <option value='4181000'>춘천시</option>
                        <option value='4221000'>태백시</option>
                        <option value='4281000'>평창군</option>
                        <option value='4251000'>홍천군</option>
                        <option value='4311000'>화천군</option>
                        <option value='4261000'>횡성군</option>
                    </>
                )
            // 충청북도
            case '6430000':
                return (
                    <>
                        <option value='4460000'>괴산군</option>
                        <option value='4480000'>단양군</option>
                        <option value='4420000'>보은군</option>
                        <option value='4440000'>영동군</option>
                        <option value='4430000'>옥천군</option>
                        <option value='4470000'>음성군</option>
                        <option value='4400000'>제천시</option>
                        <option value='5570000'>증평군</option>
                        <option value='4450000'>진천군</option>
                        <option value='5710000'>청주시</option>
                        <option value='4390000'>충주시</option>
                    </>
                )
            // 충청남도
            case '6440000':
                return (
                    <>
                        <option value='5580000'>계룡시</option>
                        <option value='4500000'>공주시</option>
                        <option value='4550000'>금산군</option>
                        <option value='4540000'>논산시</option>
                        <option value='5680000'>당진시</option>
                        <option value='4510000'>보령시</option>
                        <option value='4570000'>부여군</option>
                        <option value='4530000'>서산시</option>
                        <option value='4580000'>서천군</option>
                        <option value='4520000'>아산시</option>
                        <option value='4560000'>연기군</option>
                        <option value='4610000'>예산군</option>
                        <option value='4490000'>천안시</option>
                        <option value='4590000'>청양군</option>
                        <option value='4620000'>태안군</option>
                        <option value='4600000'>홍성군</option>
                    </>
                )
            // 전북특별자치도
            case '6540000':
                return (
                    <>
                        <option value='4781000'>고창군</option>
                        <option value='4671000'>군산시</option>
                        <option value='4711000'>김제시</option>
                        <option value='4701000'>남원시</option>
                        <option value='4741000'>무주군</option>
                        <option value='4791000'>부안군</option>
                        <option value='4771000'>순창군</option>
                        <option value='4721000'>완주군</option>
                        <option value='4681000'>익산시</option>
                        <option value='4761000'>임실군</option>
                        <option value='4751000'>장수군</option>
                        <option value='4641000'>전주시</option>
                        <option value='4691000'>정읍시</option>
                        <option value='4731000'>진안군</option>
                    </>
                )
            // 전라남도
            case '6460000':
                return (
                    <>
                        <option value='4920000'>강진군</option>
                        <option value='4880000'>고흥군</option>
                        <option value='4860000'>곡성군</option>
                        <option value='4840000'>광양시</option>
                        <option value='4870000'>구례군</option>
                        <option value='4830000'>나주시</option>
                        <option value='4850000'>담양군</option>
                        <option value='4800000'>목포시</option>
                        <option value='4950000'>무안군</option>
                        <option value='4890000'>보성군</option>
                        <option value='4820000'>순천시</option>
                        <option value='5010000'>신안군</option>
                        <option value='4810000'>여수시</option>
                        <option value='4970000'>영광군</option>
                        <option value='4940000'>영암군</option>
                        <option value='4990000'>완도군</option>
                        <option value='4980000'>장성군</option>
                        <option value='4910000'>장흥군</option>
                        <option value='5000000'>진도군</option>
                        <option value='4960000'>함평군</option>
                        <option value='4930000'>해남군</option>
                        <option value='4900000'>화순군</option>
                    </>
                )
            // 경상북도
            case '6470000':
                return (
                    <>
                        <option value='5130000'>경산시</option>
                        <option value='6479998'>경상북도</option>
                        <option value='5050000'>경주시</option>
                        <option value='5200000'>고령군</option>
                        <option value='5080000'>구미시</option>
                        <option value='5060000'>김천시</option>
                        <option value='5120000'>문경시</option>
                        <option value='5240000'>봉화군</option>
                        <option value='5110000'>상주시</option>
                        <option value='5210000'>성주군</option>
                        <option value='5070000'>안동시</option>
                        <option value='5180000'>영덕군</option>
                        <option value='5170000'>영양군</option>
                        <option value='5090000'>영주시</option>
                        <option value='5100000'>영천시</option>
                        <option value='5230000'>예천군</option>
                        <option value='5260000'>울릉군</option>
                        <option value='5250000'>울진군</option>
                        <option value='5150000'>의성군</option>
                        <option value='5190000'>청도군</option>
                        <option value='5160000'>청송군</option>
                        <option value='5220000'>칠곡군</option>
                        <option value='5020000'>포항시</option>
                    </>
                )
            // 경상남도
            case '6480000':
                return (
                    <>
                        <option value='5370000'>거제시</option>
                        <option value='5470000'>거창군</option>
                        <option value='5420000'>고성군</option>
                        <option value='5350000'>김해시</option>
                        <option value='5430000'>남해군</option>
                        <option value='5360000'>밀양시</option>
                        <option value='5340000'>사천시</option>
                        <option value='5450000'>산청군</option>
                        <option value='5380000'>양산시</option>
                        <option value='5390000'>의령군</option>
                        <option value='5310000'>진주시</option>
                        <option value='5410000'>창녕군</option>
                        <option value='5320000'>창원시</option>
                        <option value='5280000'>창원시</option>
                        <option value='5670000'>창원시</option>
                        <option value='5330000'>통영시</option>
                        <option value='5440000'>하동군</option>
                        <option value='5400000'>함안군</option>
                        <option value='5460000'>함양군</option>
                        <option value='5460000'>합천군</option>

                    </>
                )
            // 제주특별자치도
            case '6500000':
                return (
                    <>
                        <option value='6520000'>서귀포시</option>
                        <option value='6510000'>제주시</option>
                        <option value='6500000'>제주특별자치도</option>
                    </>
                )
            default:
                return (
                    null
                )
        }   
    };

    const navigate = useNavigate();
    const goAnimal = (animal) => {
        navigate(`/pet/detail/${animal.desertionNo}`, {
            state: {
                noticeNo: animal.noticeNo,
                popfile: animal.popfile,
                kindCd: animal.kindCd,
                colorCd: animal.colorCd,
                sexCd: animal.sexCd,
                neuterYn: animal.neuterYn,
                specialMark: animal.specialMark,
                happenDt: animal.happenDt,
                happenPlace: animal.happenPlace,
                noticeSdt: animal.noticeSdt,
                noticeEdt: animal.noticeEdt,
                careNm: animal.careNm,
                careAddr: animal.careAddr,
                careTel: animal.careTel
            },
            key: animal.desertionNo
        });
    };

    const URL = "http://apis.data.go.kr/1543061/abandonmentPublicSrvc/abandonmentPublic";
    // const sidoURL = `http://apis.data.go.kr/1543061/abandonmentPublicSrvc/sido?&numOfRows=17&pageNo=1&serviceKey=${process.env.REACT_APP_API_KEY}`;
    // const sigunguURL = `http://apis.data.go.kr/1543061/abandonmentPublicSrvc/sigungu?upr_cd=6260000&numOfRows=100&pageNo=1&serviceKey=${process.env.REACT_APP_API_KEY}`;

    // console.log('시도 확인', sidoURL);
    // console.log('시군구 확인', sigunguURL);

    const filterDataByCategory = (category, regionCode, cityCode) => {
        const items = data?.response?.body?.items?.item || [];

        const sidoReplacements = {
            "서울특별시":"6110000",
            "부산광역시":"6260000",
            "대구광역시": "6270000",
            "인천광역시": "6280000",
            "광주광역시": "6290000",
            "세종특별자치시":"5690000",
            "대전광역시": "6300000",
            "울산광역시": "6310000",
            "경기도": "6410000",
            "강원특별자치도": "6530000",
            "충청북도": "6430000",
            "충청남도": "6440000",
            "전북특별자치도": "6540000",
            "전라남도": "6460000",
            "경상북도": "6470000",
            "경상남도": "6480000",
            "제주특별자치도": "6500000"
        }

        const siGunguReplacements = (sidoCode, siGungu) => {
            const replacements = {
                // 서울특별시
                "6110000" : {
                    "가정보호":"6119999",
                    "강남구":"3220000",
                    "강동구" :"3240000",
                    "강북구":"3080000",
                    "강서구":"3150000",
                    "관악구":"3200000",
                    "광진구":"3040000",
                    "구로구": "3160000",
                    "금천구":"3170000",
                    "노원구" : "3100000",
                    "도봉구" : "3090000",
                    "동대문구" : "3050000",
                    "동작구" : "3050000",
                    "마포구" : "3130000",
                    "서대문구": "3120000",
                    "서울특별시": "6119998",
                    "서초구": "3210000",
                    "성동구": "3030000",
                    "성북구": "3070000",
                    "송파구" : "3230000",
                    "양천구" : "3140000",
                    "영등포구" : "3180000",
                    "용산구" : "3020000",
                    "은평구" : "3110000",
                    "종로구" : "3000000",
                    "중구" : "3010000",
                    "중랑구" : "3060000",
                },
                // 부산광역시
                "6260000" :{
                    "강서구": "3360000",
                    "금정구": "3350000",
                    "기장군": "3400000",
                    "남구" : "3310000",
                    "동구" : "3270000",
                    "동래구" : "3300000",
                    "부산진구" : "3290000",
                    "북구" : "3320000",
                    "사상구" : "3390000",
                    "사하구" : "3340000",
                    "서구" : "3260000",
                    "수영구" : "3380000",
                    "연제구" : "3370000",
                    "영도구" : "3280000",
                    "중구" : "3250000",
                    "해운대구" : "3330000",
                },
                // 대구광역시
                "6270000" : {
                    "군위군" : "5141000",
                    "남구" : "3440000",
                    "달서구" : "3470000",
                    "달성군" : "3480000",
                    "동구" : "3420000",
                    "북구": "3450000",
                    "서구":"3430000",
                    "수성구" : "3460000",
                    "중구" : "3410000",
                },
                // 인천광역시
                "6280000" : {
                    "강화군" : "3570000",
                    "계양구" : "3550000",
                    "남동구" : "3530000",
                    "동구" : "3500000",
                    "미추홀구": "3150000",
                    "부평구": "3540000",
                    "서구" : "3560000",
                    "연수구" : "3520000",
                    "옹진군" : "3580000",
                    "중구" : "3490000",
                },
                // 광주광역시
                "6290000" : {
                    "광산구" : "3630000",
                    "광주광역시" : "6299998",
                    "남구" : "3610000",
                    "동구" : "3590000",
                    "북구" : "3620000",
                    "서구" : "3600000",
                },
                // 세종특별자치시
                "5690000" : {

                },
                // 대전광역시
                "6300000" : {
                    "대덕구" : "3680000",
                    "동구" : "3640000",
                    "서구" : "3660000",
                    "유성구" : "3670000",
                    "중구" : "3650000",
                },
                // 울산광역시
                "6310000" : {
                    "남구" : "3700000",
                    "동구" : "3710000",
                    "북구" : "3720000",
                    "울주군" : "3730000",
                    "중구" : "3690000",
                },
                // 경기도
                "6410000" : {
                    "가평군" : "4160000",
                    "고양시" : "3940000",
                    "과천시" : "3970000",
                    "광명시" : "3900000",
                    "광주시" : "5540000",
                    "구리시" : "3980000",
                    "군포시" : "4020000",
                    "기흥구" : "5630000",
                    "김포시" : "4090000",
                    "남양주시" : "3990000",
                    "동두천시" : "3920000",
                    "부천시" : "3860000",
                    "성남시" : "3780000",
                    "수원시" : "3740000",
                    "시흥시" : "4010000",
                    "안산시" : "3930000",
                    "안성시" : "4080000",
                    "안양시" : "3830000",
                    "양주시" : "5590000",
                    "양평군" : "4170000",
                    "여주시" : "5700000",
                    "연천군" : "4140000",
                    "오산시" : "4000000",
                    "용인시" : "4050000",
                    "의왕시" : "4030000",
                    "의정부시" : "3820000",
                    "이천시" : "4070000",
                    "파주시" : "4060000",
                    "평택시" : "3910000",
                    "포천시" : "5600000",
                    "하남시" : "4040000",
                    "화성시" : "5530000",
                },
                // 강원특별자치도
                "6530000": {
                    "강릉시" : "4201000",
                    "고성군" : "4341000",
                    "동해시" : "4211000",
                    "삼척시" : "4241000",
                    "속초시" : "4231000",
                    "양주군" : "4321000",
                    "양양군" : "4351000",
                    "영월군" : "4271000",
                    "원주시" : "4191000",
                    "인제군" : "4331000",
                    "정선군" : "4291000",
                    "철원군" : "4301000",
                    "춘천시" : "4181000",
                    "태백시" : "4221000",
                    "평창군" : "4281000",
                    "홍천군" : "4251000",
                    "화천군" : "4311000",
                    "횡성군" : "4261000",
                },
                // 충청북도
                "6430000" : {
                    "괴산군" : "4460000",
                    "단양군" : "4480000",
                    "보은군" : "4420000",
                    "영동군" : "4440000",
                    "옥천군" : "4430000",
                    "음성군" : "4470000",
                    "제천시" : "4400000",
                    "증평군" : "5570000",
                    "진천군" : "4450000",
                    "청주시" : "5710000",
                    "충주시" : "4390000",
                },
                // 충청남도
                "6440000" : {
                    "계룡시" : "5580000",
                    "공주시" : "4500000",
                    "금산군" : "4550000",
                    "논산시" : "4540000",
                    "당진시" : "5680000",
                    "보령시" : "4510000",
                    "부여군" : "4570000",
                    "서산시" : "4530000",
                    "서천군" : "4580000",
                    "아산시" : "4520000",
                    "연기군" : "4560000",
                    "예산군" : "4610000",
                    "천안시" : "4490000",
                    "청양군" : "4590000",
                    "태안군" : "4620000",
                    "홍성군" : "4600000",
                },
                // 전북특별자치도
                "6540000" : {
                    "고창군" : "4781000",
                    "군산시" : "4671000",
                    "김제시" : "4711000",
                    "남원시" : "4701000",
                    "무주군" : "4741000",
                    "부안군" : "4791000",
                    "순창군" : "4771000",
                    "완주군" : "4721000",
                    "익산시" : "4681000",
                    "임실군" : "4761000",
                    "장수군" : "4751000",
                    "전주시" : "4641000",
                    "정읍시" : "4691000",
                    "진안군" : "4731000",
                },
                // 전라남도
                "6460000" : {
                    "강진군" : "4920000",
                    "고흥군" : "4880000",
                    "곡성군" : "4860000",
                    "광양시" : "4840000",
                    "구례군" : "4870000",
                    "나주시" : "4830000",
                    "담양군" : "4850000",
                    "목포시" : "4800000",
                    "무안군" : "4950000",
                    "보성군" : "4890000",
                    "순천시" : "4820000",
                    "신안군" : "5010000",
                    "여수시" : "4810000",
                    "영광군" : "4970000",
                    "영암군" : "4940000",
                    "완도군" : "4990000",
                    "장성군" : "4980000",
                    "장흥군" : "4910000",
                    "진도군" : "5000000",
                    "함평군" : "4960000",
                    "해남군" : "4930000",
                    "화순군" : "4900000",
                },
                // 경상북도
                "6470000" : {
                    "경산시" : "5130000",
                    "경상북도" : "6479998",
                    "경주시" : "5050000",
                    "고령군" : "5200000",
                    "구미시" : "5080000",
                    "김천시" : "5060000",
                    "문경시" : "5120000",
                    "봉화군" : "5240000",
                    "상주시" : "5110000",
                    "성주시" : "5210000",
                    "안동군" : "5070000",
                    "영덕군" : "5180000",
                    "영양군" : "5170000",
                    "영주시" : "5090000",
                    "영천시" : "5100000",
                    "예천군" : "5230000",
                    "울릉군" : "5260000",
                    "울진군" : "5250000",
                    "의성군" : "5150000",
                    "청도군" : "5190000",
                    "청송군" : "5160000",
                    "칠곡군" : "5220000",
                    "포항시" : "5020000",
                },
                // 경상남도
                "6480000" : {
                    "거제시" : "5370000",
                    "거창군" : "5470000",
                    "고성군" : "5420000",
                    "김해시" : "5350000",
                    "남해군" : "5430000",
                    "밀양시" : "5360000",
                    "사천시" : "5340000",
                    "산청군" : "5450000",
                    "양산시" : "5380000",
                    "의령군" : "5390000",
                    "진주시" : "5310000",
                    "창녕군" : "5410000",
                    "창원시" : "5320000",
                    "창원시" : "5280000",
                    "창원시" : "5670000",
                    "통영시" : "5330000",
                    "하동군" : "5440000",
                    "함안군" : "5400000",
                    "함양군" : "5460000",
                    "합천군" : "5460000",
                },
                // 제주특별자치도
                "6500000" : {
                    "서귀포시" : "6520000",
                    "제주시" : "6510000",
                    "제주특별자치도" : "6500000",
                },
            };
            return replacements[sidoCode]?.[siGungu] || "";
        };
        return items.filter(item => {
            const categoryFilter = (category === '[기타축종]')
                ? !item.kindCd.includes('[개]') && !item.kindCd.includes('[고양이]')
                : !item.kindCd.includes(`[${category}]`);
    
            const sidoSplit = item.orgNm.split(' ')[0];
            const siGunguSplit = item.orgNm.split(' ')[1];
    
            const sidoCode = sidoReplacements[sidoSplit];
            const siGunguCode = siGunguReplacements(sidoCode, siGunguSplit);
    
            const regionFilter = !regionCode || sidoCode === regionCode;
            const cityFilter = !cityCode || siGunguCode === cityCode;
    
            const result = categoryFilter && regionFilter && cityFilter;
            console.log(
                `Item: ${item.desertionNo}, split_1: ${sidoSplit}, split_2: ${siGunguSplit},
                 split_result_1: ${sidoCode}, split_result_2: ${siGunguCode}, Category: ${categoryFilter},
                 Region: ${regionFilter}, City: ${cityFilter}, Result: ${result}`
            );
            return result;
        });
    };
        
    useEffect(() => {
        window.scrollTo(0,0);
        let isMounted = true;

        const allEncodedUrl = (category, regionCode, cityCode) => {
            // const currentPageCategory = 1; // 카테고리 로딩 시 항상 첫번째 page 로 가도록.

            const encoded = `${URL}?numOfRows=${itemsPerPage}&pageNo=${currentPage}&_type=json&serviceKey=${process.env.REACT_APP_API_KEY}`;
    
            let categoryFilter = '';
            if (category === '[개]'){
                categoryFilter =`&upkind=417000`; 
            } else if (category === '[고양이]'){
                categoryFilter = `&upkind=422400`;
            } else if (category === '[기타축종]'){
                categoryFilter = `&upkind=429900`;
            }
            // 시도
            let regionFilter = '';
            if (regionCode) {
                regionFilter=`&upr_cd=${regionCode}`;
                // console.log('rrrrrrrrrrr', regionFilter);
            }
            // 시군구
            let cityFilter = '';
            if (cityCode) {
                cityFilter = `&org_cd=${cityCode}`;
            }
            
            if(cityCode ===''){
                return `${encoded}${categoryFilter}${regionFilter}`;
            } else {
                return `${encoded}${categoryFilter}${regionFilter}${cityFilter}`;
            }
        };

        const fetchData = async (encodedUrl) => {
            try {
                setError(null);
                setData(null);
                setIsLoading(true);
    
                const response = await axios.get(encodedUrl);
    
                if (isMounted) {
                    if (response.data.response.body) {
                        setData(response.data);
                        setTotalPages(Math.ceil(response.data.response.body.totalCount / itemsPerPage));
                    } else {
                        throw new Error('Invalid response format');
                    }
                }
            } catch (e) {
                if (isMounted) {
                    setError(e);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };
        
        const encodedUrl = allEncodedUrl(selectedCategory, selectedSido, selectedCity);
        fetchData(encodedUrl);

        return () => {
            isMounted = false;
        };
    }, [currentPage, selectedCategory, selectedSido, selectedCity]);

    if (isLoading) return <div className='loading'><img src={loading} alt='Loading...'/></div>;
    if (error) return <div>Error: {error.message}</div> ;
    if (!data || !data.response || !data.response.body || !data.response.body.items) {
        return <div>No data available</div>;
    }

    // Log 추가
    console.log("Fetched Data:", data);

    return (
        <div className='card-list-container'>
            {/* 지역 선택 UI */}
            <div>
                <select value={selectedSido} onChange={handleSidoChange}>
                    <option value=''>시/도</option>
                    <option value='6110000'>서울특별시</option>
                    <option value='6260000'>부산광역시</option>
                    <option value='6270000'>대구광역시</option>
                    <option value='6280000'>인천광역시</option>
                    <option value='6290000'>광주광역시</option>
                    <option value='5690000'>세종특별자치시</option>
                    <option value='6300000'>대전광역시</option>
                    <option value='6310000'>울산광역시</option>
                    <option value='6410000'>경기도</option>
                    <option value='6530000'>강원특별자치도</option>
                    <option value='6430000'>충청북도</option>
                    <option value='6440000'>충청남도</option>
                    <option value='6540000'>전북특별자치도</option>
                    <option value='6460000'>전라남도</option>
                    <option value='6470000'>경상북도</option>
                    <option value='6480000'>경상남도</option>
                    <option value='6500000'>제주특별자치도</option>
                </select>
                <select value={selectedCity} onChange={handleCityChange}>
                    <option value=''>시/군/구</option>
                    {getCityOptions(selectedSido)}
                </select>
            </div>
            {/* 카테고리 선택 UI */}
            <div className='card-button-container'>
                <button onClick={() => setSelectedCategory(null)}><img alt='all' src={process.env.PUBLIC_URL + '/img/all_50.png'} /></button>
                <button onClick={() => setSelectedCategory('[개]')}><img alt='puppy' src={process.env.PUBLIC_URL + '/img/puppy_50.png'} /></button>
                <button onClick={() => setSelectedCategory('[고양이]')}><img alt='cat' src={process.env.PUBLIC_URL + '/img/cat_50.png'} /></button>
                <button onClick={() => setSelectedCategory('[기타축종]')}><img alt='etc' src={process.env.PUBLIC_URL + '/img/etc_64.png'} /></button>
            </div>
            <Row xs={1} md={3} className='g-4'>
                {
                    filterDataByCategory(selectedCategory, selectedSido, selectedCity) !== null &&
                        filterDataByCategory(selectedCategory, selectedSido, selectedCity).length > 0 ? (
                            filterDataByCategory(selectedCategory, selectedSido, selectedCity).map((animal) => (
                                <Col key={animal.desertionNo}>
                                    <Card border='warning'>
                                        <a href={`/pet/detail/${animal.desertionNo}`}>
                                        <Card.Img className='card-img' 
                                            src={animal.popfile} alt={`Pet ${animal.desertionNo}`} onClick={() => goAnimal(animal)}
                                            variant="top" />
                                        </a>
                                            <Card.Body>
                                                <Card.Title>{animal.processState}</Card.Title>
                                                <Card.Text>
                                                    {animal.kindCd }<br />
                                                    {animal.sexCd === 'F' ? '여아' : '남아'} · {animal.neuterYn === 'Y' ? '중성화 완료' : '중성화 미완료'}<br />
                                                </Card.Text>
                                            </Card.Body>
                                            <ListGroup className="list-group-flush">
                                                <ListGroup.Item>보호센터 : {animal.careNm}</ListGroup.Item>
                                            </ListGroup>
                                    </Card>
                                </Col>
                    ))
                ) : (
                    <div className='noSearch'>
                        <img src={notfound} alt='not found'/>
                        <p>해당 지역에는 아이들이 없습니다.</p>
                    </div>
                )}
            </Row>
            <div className='div'>
            <Stack direction='row' spacing={2} justifyContent='center' marginTop={5} marginBottom={5}>
                <Pagination 
                    count={totalPages}
                    page={currentPage}
                    onChange={(event, page) => navigateToPage(page)}
                />
            </Stack>
            </div>
        </div>
    );
}
export default PetList;