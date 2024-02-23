import React, { useState, useEffect } from 'react';
import { Button, Container, Form, Row, Col, Modal  } from 'react-bootstrap';
import axios from 'axios';
import DaumPostcode from 'react-daum-postcode';
import '../../styles/Join.css';
import { useNavigate } from 'react-router-dom';

const JoinForm = ({ join }) => {
  const [joinContent, setJoinContent] = useState({
    name: '',
    userid: '',
    password: '',
    address: '',
    tel: '',
    email: '',
    passwordCheck:'',
  
  });
  const navigate = useNavigate();


  //==============우편번호찾기//아이디 중복확인=======================
    // 모달 상태
    const [showModal, setShowModal] = useState(false);
    // 중복확인 결과 상태
    const [isIdDuplicated, setIsIdDuplicated] = useState(false);
    const [idCheckMessage, setIdCheckMessage] = useState('아이디 중복 확인을 해주세요.'); // 새로운 상태 추가
    //중복확인 버튼 t/f
    const [isIdChecked, setIsIdChecked] = useState(false);
    const [isAddrChecked, setIsAddrChecked] = useState(false);
    const [isNicknameChecked, setIsNicknameChecked] = useState(false);
    //비밀번호 양식
    const [passwordForm, setPasswordForm] = useState('비밀번호는 최소 8자 이상이어야 하며, 영문 및 숫자,특수문자를 포함해야 합니다.');
    //닉네임
    const [isNickDuplicated, setIsNickDuplicated] = useState(false);
    const [nickCheckMessage, setNickCheckMessage] = useState('닉네임 중복 확인을 해주세요.'); // 새로운 상태 추가


    // handler
    const handle = {
      clickButtonaddr: () => {
        setShowModal(true);
      },
      clickButton: async () => {
        // 서버로 중복확인 요청 보내기
        try {
          const response = await axios.post('/member/checkId', {
            userid: joinContent.userid,
          });
  
          // 중복되지 않으면 메시지 표시
          if (response.data === 'success') {
            setIsIdDuplicated(false);
            setIdCheckMessage('사용 가능한 아이디입니다.');
            setIsIdChecked(true); // 중복확인 수행 상태로 설정
          } 
          else if (response.data === 'fail') {
            setIsIdDuplicated(true);
            setIdCheckMessage('이미 사용 중인 아이디입니다.');
            setIsIdChecked(false); // 중복확인 미수행 상태로 설정
          } else {
            console.error('잘못된 응답:', response.data);
          }
        } catch (error) {
          console.error('중복확인 오류:', error);
        }
      },

      clickButtonNickname: async () => {
        // 서버로 중복확인 요청 보내기
        try {
          const response = await axios.post('/member/checkNickname', {
            nickname: joinContent.nickname,
          });
  
          // 중복되지 않으면 메시지 표시
          if (response.data === 'success') {
            setIsNickDuplicated(false);
            setNickCheckMessage('사용 가능한 닉네임입니다.');
            setIsNicknameChecked(true); // 중복확인 수행 상태로 설정
          } else if (response.data === 'fail') {
            setIsNickDuplicated(true);
            setNickCheckMessage('이미 사용 중인 닉네임입니다.');
            setIsNicknameChecked(false); // 중복확인 미수행 상태로 설정
          } else {
            console.error('잘못된 응답:', response.data);
          }
        } catch (error) {
          console.error('중복확인 오류:', error);
        }
      },
      
  
      // 주소 선택 이벤트
      selectAddress: (data) => {
        console.log(`
          주소: ${data.address},
          우편번호: ${data.zonecode}
        `);
        setJoinContent({
          ...joinContent,
          address: data.address,
        });
        setShowModal(false);
        setIsAddrChecked(true);
      },
  
      // 모달 닫기
      closeModal: () => {
        setShowModal(false);
       
      },
    };
//====================================================
  const getValue = (e) => {
    setJoinContent({
      ...joinContent,
      [e.target.name]: e.target.value,
    });
  };
//=====================================================



const pwdCheck =/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;

const emailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const telCheck = /^\d{3}-\d{3,4}-\d{4}$/;



//=====================================================
  const memberInsert = () => {
    //유효성검사
    if(!joinContent.name){
      alert("이름을 입력하세요")
      return;
    }else if(!joinContent.userid){
      alert("아이디를 입력하세요")
      return;
    }
    else if(joinContent.userid=="fail"){
      alert("사용 할 수 없는 아이디입니다.")
      return;
    }
    else if(!isIdChecked){
      alert('아이디 중복확인을 먼저 수행하세요.');
      return;
    } else if(!joinContent.nickname){
      alert('닉네임을 입력하세요.');
      return;
    }else if(!isNicknameChecked){
      alert('닉네임 중복확인을 먼저 수행하세요.');
      return;
    }
    else if(!joinContent.password){
      alert("비밀번호를 입력하세요")
      return;
    }
    else if(!pwdCheck.test(joinContent.password)){
      alert("비밀번호는 영문자,특수문자,숫자를 포함한 8~25자 사이로 설정해주세요 ")
      return;
    }
    // else if(!joinContent.address){
    //   alert("주소를 입력하세요")
    //   return;
    // }
    else if(!joinContent.tel){
      alert("전화번호를 입력하세요")
      return;
    }else if(!joinContent.email){
      alert("이메일을 입력하세요")
      return;
    }
    // else if(!isAddrChecked){
    //   alert("우편번호 찾기를 먼저 수행하세요")
    //   return;
    // }
    else if(joinContent.password!==joinContent.passwordCheck){
      alert("비밀번호가 일치하지 않습니다.")
      return;
    }
    else if(!emailCheck.test(joinContent.email)){
      alert("이메일 양식이 맞지 않습니다.")
      return;
    }
    else if(!telCheck.test(joinContent.tel)){
      alert("전화번호 양식이 맞지 않습니다.")
      return;
    }
    join(joinContent);
    setJoinContent({
      name: '',
      userid: '',
      nickname: '',
      password: '',
      address: '',
      tel: '',
      email: '',
      passwordCheck:''
    });
    setIsIdChecked(false);
    setIsAddrChecked(false);
  //  navigate("/member/login");

  };

  useEffect(() => {
    if (joinContent.tel.length === 11) {
      setJoinContent({
        ...joinContent,
        tel: joinContent.tel.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3'),
      });
    } else if (joinContent.tel.length === 13) {
      setJoinContent({
        ...joinContent,
        tel: joinContent.tel
          .replace(/-/g, '')
          .replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3'),
      });
    }
  }, [joinContent.tel]);
  
  return (
    <Container className='container'>
      <div className='wel'>
        <p>Welcome~ </p>
      
      <img src='../img/dog.png' style={{width:'13%', height:'13%', marginLeft:'40px'}}/>
      </div>
      <Form  >
      <Form.Group as={Col} controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              name="name"
              onChange={getValue}
              value={joinContent.name}
              placeholder="Enter Name"
            />
          </Form.Group>
          <br/>
        <Row className="mb-3">
        <Form.Group as={Col} controlId="userid">
            <Form.Label>Id</Form.Label>
            <Form.Control
              name="userid"
              onChange={getValue}
              value={joinContent.userid}
              placeholder="Enter Id"
            />
                  <Form.Text className={isIdDuplicated ? 'text-danger' : 'text-muted'}>
            {idCheckMessage}
          </Form.Text>
          </Form.Group>
          <Form.Group as={Col} controlId="btn" style={{ marginTop: '6px' }}>
            <br />
            <button className="w-btn w-btn-indigo" variant="primary" type="button" onClick={handle.clickButton}>
              중복확인
            </button>
          </Form.Group>

          <Form.Group as={Col} controlId="userid">
            <Form.Label>NickName</Form.Label>
            <Form.Control
              name="nickname"
              onChange={getValue}
              value={joinContent.nickname}
              placeholder="Enter Nickname"
            />
                  <Form.Text className={isNickDuplicated ? 'text-danger' : 'text-muted'}>
            {nickCheckMessage}
          </Form.Text>
          </Form.Group>

          <Form.Group as={Col} controlId="btn" style={{ marginTop: '6px' }}>
            <br />
            <button className="w-btn w-btn-indigo" variant="primary" type="button" onClick={handle.clickButtonNickname}>
              중복확인
            </button>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              onChange={(e) => {
                getValue(e);
              }}
              value={joinContent.password}
              placeholder="Enter Password"
            />
            <Form.Text>
            {passwordForm}
          </Form.Text>
          </Form.Group>

          <Form.Group as={Col} controlId="passwordcheck">
            <Form.Label>Password Check</Form.Label>
            <Form.Control type="password" placeholder="Enter Password Check" name="passwordCheck"  onChange={getValue}
              value={joinContent.passwordCheck}/>
          </Form.Group>
        </Row>
        {/* <Row>
        <Form.Group as={Col} className="mb-3" controlId="address">
          <Form.Label>Address</Form.Label>
          <Form.Control
            placeholder="Enter Address"
            name="address"
            onChange={getValue}
            value={joinContent.address}
          />
        </Form.Group>
        <Form.Group as={Col} controlId="btn" style={{ marginTop: '6px' }}>
            <br />
            <Button variant="primary"  onClick={handle.clickButtonaddr}>
            우편번호 찾기
            </Button>
          </Form.Group>
        </Row> */}
       

        <Form.Group className="mb-3" controlId="tel">
          <Form.Label>Phone</Form.Label>
          <Form.Control
            placeholder="Enter Phone"
            name="tel"
            onChange={getValue}
            value={joinContent.tel}
          />
        </Form.Group>

        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            name="email"
            onChange={getValue}
            value={joinContent.email}
          />
        </Form.Group>
<br/>
        <button type='button' className='w-btn w-btn-skin' variant="primary" onClick={memberInsert}>
          회원가입
        </button>
      </Form>
      {/* 우편번호 찾기 모달 */}
      <Modal show={showModal} onHide={handle.closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>우편번호 찾기</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DaumPostcode onComplete={handle.selectAddress} autoClose={false} />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default JoinForm;
