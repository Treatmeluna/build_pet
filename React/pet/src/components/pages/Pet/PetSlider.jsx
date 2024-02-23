import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";
import '../../styles/PetSlider.css';
import { Card, Col, ListGroup } from 'react-bootstrap';
import { shuffle } from "lodash";

export default function PetSlider() {

    const [ data, setData ] = useState([]);
    const navigate = useNavigate();
    const [URL, setURL] = useState("");
    const [randomItems, setRandomItems] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const URL = `http://apis.data.go.kr/1543061/abandonmentPublicSrvc/abandonmentPublic?numOfRows=500&_type=json&serviceKey=${process.env.REACT_APP_API_KEY}`;
                setURL(URL);

                const response = await axios.get(URL);
                const items = response.data.response.body.items.item;

                const shuffledItems = shuffle(items);
                console.log("shuffle 확인:", shuffledItems);
                const randomItems = shuffledItems.slice(0, 10);

                setData(items);
                setRandomItems(randomItems);

            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };

        fetchData();
    }, []);

    console.log('url 확인: ', URL);
    console.log('random 확인: ', randomItems);

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

    const settings = {
        dots:false,
        infinite:true,
        slidesToShow:4,
        slideToScroll:1,
        speed:1000,
        arrows:true,
        nextArrow:(
            <img className="Div" src={process.env.PUBLIC_URL + '/img/arrow_40_r.png'} alt="right" />
        ),
        prevArrow:(
            <img className="DivPre" src={process.env.PUBLIC_URL + '/img/arrow_40_l.png'} alt="left" />
        ),
        autoplay:true,
        autoplaySpeed:4000,
        cssEase:"linear"
    };

    return (
        <div className='StyledContainer'>
            <h2>아이들이 여러분을 기다리고 있어요!</h2>
            <div>
                <Slider className="StyledSlider" {...settings}>
                    {
                        randomItems.map((animal) => (
                            <Col className="StyledCol " key={animal.desertionNo}>
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
                                            {animal.sexCd === 'F' ? '여아' : '남아'} · {animal.neuterYn === 'Y' ? '중성화 완료' : '중성화 미완료'}
                                        </Card.Text>
                                    </Card.Body>
                                    <ListGroup className="list-group-flush">
                                        <ListGroup.Item>보호센터 : {animal.careNm}</ListGroup.Item>
                                    </ListGroup>
                                </Card>
                            </Col>
                        ))
                    }
                </Slider>
            </div> 
        </div>
    );
};