import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import '../../styles/Pet.css';
import Kakao from "./Kakao.jsx";
import { FormGroup, Modal, Container } from "react-bootstrap";


const CallButton = ({ phoneNumber }) => {
    const handleCall = () => {
        // const phoneNumberWithoutDash = phoneNumber.replace(/-/g, '');
        // console.log("전화번호 : ",phoneNumberWithoutDash)
      window.location.href = `tel:${phoneNumber}`;

    };
  
    return (
        <div>
      <button onClick={handleCall} className="callbtn">
        <img src="../../img/call.png" style={{width:'30px', height:'30px'}}/>
      </button>
      </div>
    );
  };
  
const PetDetail = () => {
    const location = useLocation();
    const goAnimal = location.state;

    // console.log("loaction", location);
    // console.log("goanimal", goAnimal);

    
    const [adoptionShow, setAdoptionShow] = useState(false);
    const adoptionClose = () => setAdoptionShow(false);
    const adoptionOpen =() =>{
        setAdoptionShow(true);
    }

    // const handleCall = () => {
    //     window.location.href = `tel:${goAnimal.careTel}`;
    //   };
  
    return (
        <Container>
        <div>
            <div className="flex-detail-container">
                <div className="flex-detail-img">
                <img src={goAnimal.popfile} alt="animal_img"></img>
                </div>
                <div className="flex-detail-item">
                <h3>1.동물정보</h3>
                <p>공고번호 : {goAnimal.noticeNo}</p>
                <p>품종 : {goAnimal.kindCd}</p>
                <p>털색 : {goAnimal.colorCd}</p>
                <p>성별 : {goAnimal.sexCd === 'F' ? '여아' : '남아'}</p>
                <p>중성화 여부 : {goAnimal.neuterYn === 'Y' ? '중성화 완료' : '중성화 미완료'}</p>
                <p>특징 : {goAnimal.specialMark}</p>
                <br />
                <h3>2. 구조정보</h3>
                <p>구조일 : {goAnimal.happenDt}</p>
                <p>구조장소 : {goAnimal.happenPlace}</p>
                <p>공고기간 : {goAnimal.noticeSdt} ~ {goAnimal.noticeEdt}</p>
                <br />
                <h3>3. 동물보호센터 안내</h3>
                <p>관할보호센터명 : {goAnimal.careNm}</p>
                <button type="button" className="detailbtn" variant="secondary"  onClick={() => adoptionOpen()}>관할센터 문의하기</button>
                </div>

            </div>
            {/* <Kakao /> */}
            <br/>
        </div>
        <div >
        <Modal className='custom-modal' show={adoptionShow} onHide={adoptionClose} >
                        <Modal.Header closeButton>
                            <Modal.Title>관할센터 문의하기</Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{ display: 'flex', alignItems:'center', width:'80%' }}>
                            <FormGroup className="mb-3">
                                <h6>🌟관할보호센터 : {goAnimal.careNm} </h6>
                                <h6>🌟위치  </h6>
                                <h6>: {goAnimal.careAddr}</h6>
                            <div style={{ display: 'flex', alignItems:'center'  }}>
                             <Kakao />
                            </div>
                            
                            <h6>🌟센터 연락처 : {goAnimal.careTel} </h6>
                            <CallButton phoneNumber={goAnimal.careTel} />
                           
                            </FormGroup>
                        </Modal.Body>
                        <Modal.Footer>
                        </Modal.Footer>
                    </Modal>
        </div>
        </Container>
       
    )
}

export default PetDetail;