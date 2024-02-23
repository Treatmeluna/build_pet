import React, { useEffect, useState } from 'react';

import axios from "axios";
import { Button, Container, Form, Row, Col, Modal  } from 'react-bootstrap';
import Navigation from "../Navigation/Navigation.jsx";
import { useNavigate } from 'react-router-dom';
import '../../styles/MyPage.css';




const MyPage=()=>{
   
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
      name: sessionStorage.getItem("name") || "",
      tel: sessionStorage.getItem("tel") || "",
      nickname: sessionStorage.getItem("nickname") || "",
      userid: sessionStorage.getItem("userid") || "",
      email: sessionStorage.getItem("email") || "",
      //password : "",
     // passwordCheck:""
    });
    const [userid,setUserid]=useState(formData.userid);

    // 중복확인 결과 상태
    const [isIdDuplicated, setIsIdDuplicated] = useState(false);
    const [idCheckMessage, setIdCheckMessage] = useState('아이디 중복 확인을 해주세요.'); 
    //중복확인 버튼 t/f
    const [isIdChecked, setIsIdChecked] = useState(false);
    const [isNicknameChecked, setIsNicknameChecked] = useState(false);
    //닉네임
    const [isNickDuplicated, setIsNickDuplicated] = useState(false);
    const [nickCheckMessage, setNickCheckMessage] = useState('닉네임 중복 확인을 해주세요.');
    
    const handle = {
      checkId: async () => {
        // 서버로 중복확인 요청 보내기
        try {
          const response = await axios.post('/member/checkId', {
            userid: formData.userid,
          });
  
          // 중복되지 않으면 메시지 표시
          if (response.data === 'success') {
            setIsIdDuplicated(false);
            setIdCheckMessage('사용 가능한 아이디입니다.');
            setIsIdChecked(true); // 중복확인 수행 상태로 설정
          } else if (response.data === 'fail') {
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

      checkNickname: async () => {
        // 서버로 중복확인 요청 보내기
        try {
          const response = await axios.post('/member/checkNickname', {
            nickname: formData.nickname,
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
    }
    const pwdCheck =/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;

    const emailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const telCheck = /^\d{3}-\d{3,4}-\d{4}$/;

    // 입력 필드의 값이 변경될 때 상태를 업데이트
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

   // 폼을 제출
   const handleSubmit = (e) => {
    e.preventDefault();
    if(!formData.name){
      alert("이름을 입력하세요")
      return;
    }
    else if(!formData.userid){
      alert("아이디를 입력하세요")
      return;
    }
    if (formData.userid !== sessionStorage.getItem("userid")) {
      if (!isIdChecked) {
        alert("아이디 중복확인을 해주세요");
        return;
      }
    }
    else if(!formData.nickname){
      alert("닉네임을 입력하세요.")
      return;
    }
    if (formData.nickname !== sessionStorage.getItem("nickname")) {
      if (!isNicknameChecked) {
        alert("닉네임 중복확인을 해주세요");
        return;
      }
    }
    else if(!formData.password){
      alert("비밀번호를 입력하세요")
      return;
    }
    else if(!pwdCheck.test(formData.password)){
      alert("비밀번호는 영문자,특수문자,숫자를 포함한 8~25자 사이로 설정해주세요 ")
      return;
    }
    else if(formData.password!==formData.passwordCheck){
      alert("비밀번호가 일치하지 않습니다.")
      return;
    }
    else if(!formData.tel){
      alert("전화번호를 입력하세요.")
      return;
    }
    else if(!telCheck.test(formData.tel)){
      alert("전화번호 양식이 맞지않습니다.")
      return;
    }
    else if(!formData.email){
      alert("이메일을 입력하세요.")
      return;
    }
    else if(!emailCheck.test(formData.email)){
      alert("이메일 양식이 맞지않습니다.")
      return;
    }
    axios.post("/member/memberupdate", formData)
    .then((response)=>{
      if(response.data==="success"){
        alert("회원정보 수정 완료")
        sessionStorage.setItem("name", formData.name);
        sessionStorage.setItem("tel", formData.tel);
        sessionStorage.setItem("nickname", formData.nickname);
        sessionStorage.setItem("userid", formData.userid);
        sessionStorage.setItem("email", formData.email);

        // window.location.href = '/'
        navigate("/")
      }else{
        alert("회원정보 수정 실패")
      }
    })
    .catch((error) => {
      console.error('AxiosError:', error);
      alert("회원정보 수정 중 오류가 발생했습니다.");
    });
  };

  const withdrawbtn=()=>{

    fetch(`/member/withdraw/${userid}`, {
      method: 'DELETE',
  })
      .then(() => {
          
          alert("탈퇴 완료")
          sessionStorage.clear()
          navigate("/")
           
      })
  }

    return(
        <Container className="panel" style={{ marginTop: "50px", width: "700px"}}>
          <h4>회원정보 수정</h4>
        <Form style={{border:"3px solid #ccc", padding: "20px", borderRadius:"10px"}}  onSubmit={handleSubmit}>
          <Form.Group as={Form.Row} className="mb-3" >
            <Form.Label column sm="2">
              이름
            </Form.Label>
            <Form.Control
              type="text"
              value={formData.name}
              name="name"
              onChange={handleChange}
            />
          </Form.Group>
          <Row>
          <Form.Group as={Col} className="mb-3">
            <Form.Label column sm="3">
              아이디
            </Form.Label>
            <Form.Control
              type="text"
              value={formData.userid}
              name="userid"
              onChange={handleChange}
              style={{ width: '500px' }} 
            />
              <Form.Text className={isIdDuplicated ? 'text-danger' : 'text-muted'}>
            {idCheckMessage}
          </Form.Text>
          </Form.Group>
          <Form.Group as={Col} controlId="btn" style={{ marginTop: '10px' }}>
            <br />
            <Button variant="primary" type="button" onClick={handle.checkId}>
              중복확인
            </Button>
          </Form.Group>
          </Row>
          <Row>
          <Form.Group as={Col} className="mb-3">
            <Form.Label column sm="2">
              닉네임
            </Form.Label>
            <Form.Control
              type="text"
              value={formData.nickname}
              name="nickname"
              onChange={handleChange}
              style={{ width: '500px' }}
            />
             <Form.Text className={isNickDuplicated ? 'text-danger' : 'text-muted'}>
            {nickCheckMessage}
          </Form.Text>
          </Form.Group>
          <Form.Group as={Col} controlId="btn" style={{ marginTop: '10px' }}>
            <br />
            <Button variant="primary" type="button" onClick={handle.checkNickname}>
              중복확인
            </Button>
          </Form.Group>
          </Row>
          <Form.Group as={Col} controlId="password"  className="mb-3">
            <Form.Label>비밀번호</Form.Label>
            <Form.Control
              type="password"
              name="password"
              onChange={handleChange}
              value={formData.password}
              placeholder="Enter Password"
            />
          </Form.Group>
          <Form.Group as={Col} controlId="passwordcheck" className="mb-3">
            <Form.Label>비밀번호 확인</Form.Label>
            <Form.Control type="password" placeholder="Enter Password Check" name="passwordCheck"  onChange={handleChange}
              value={formData.passwordCheck}/>
          </Form.Group>

          <Form.Group as={Form.Row} className="mb-3" >
            <Form.Label column sm="2">
              전화번호
            </Form.Label>
            <Form.Control
              type="text"
              value={formData.tel}
              name="tel"
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group as={Form.Row} className="mb-3" >
            <Form.Label column sm="2">
              이메일
            </Form.Label>
            <Form.Control
              type="text"
              value={formData.email}
              name="email"
              onChange={handleChange}
            />
          </Form.Group>

         
          <Button variant="secondary"  type="submit" style={{marginRight:'10px'}}>
              수정
            </Button>
            <Button variant="danger"  type="button" onClick={withdrawbtn}>
              회원탈퇴하기
            </Button>
          </Form>

          </Container>
    )
}
export default MyPage;