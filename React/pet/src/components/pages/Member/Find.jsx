import React, { useEffect, useState } from 'react';
import { Button } from "react-bootstrap";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


import '../../styles/Find.css';
import { getValue } from '@testing-library/user-event/dist/utils';

const Find = () =>{
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [findState,setFindState] = useState('idfind');
    const [idContent, setIdContent] = useState({
        name:'',
        tel:''
    })
    const [pwContent, setPwContent] = useState({
        userid:'',
        email:''
    })

    const getIdValue = (e) => {
        setIdContent({
          ...idContent,
          [e.target.name]: e.target.value,
        });
      };

      const getPwValue = (e) => {
        setPwContent({
          ...pwContent,
          [e.target.name]: e.target.value,
        });
      };
      const telCheck = /^\d{3}-\d{3,4}-\d{4}$/;
      const emailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const findId= async ()=>{
        try{
            const response = await axios.post(`/member/idfind`,{
                name: idContent.name,
                tel: idContent.tel
            })
            console.log("확인:" , response.data)
           
           if(!idContent.name){
            alert("이름을 입력하세요")
            return;
           }else if(!idContent.tel){
            alert("전화번호를 입력하세요")
            return;
           }else if(!telCheck.test(idContent.tel)){
            alert("전화번호 양식이 맞지 않습니다.")
            return;
           }
           if(response.data!="fail"){
            alert("회원님의 아이디는 '"+response.data+"' 입니다.");
        }
        else{
            alert("일치하는 회원정보가 없습니다.");
        }
            setIdContent({
                name:'',
                tel:''
            })
        }catch (error) {
            console.error('오류:', error);
          }
    }

    const findPw = async () => {
        setLoading(true);
        try{
            const response = await axios.post(`/member/pwfind`,{
                userid:pwContent.userid,
                email:pwContent.email
            })
            
            console.log("loading:",loading)
            if(!pwContent.userid){
                alert("아이디를 입력하세요")
                return;
            }else if(!pwContent.email){
                alert("이메일을 입력하세요")
                return;
            }else if(!emailCheck.test(pwContent.email)){
                alert("이메일 양식이 맞지 않습니다.")
                return;
            }
            if(response.data=="success"){
                setLoading(false);
                alert("메일로 발송된 임시비밀번호로 로그인후 마이페이지에서 변경해주세요");
                navigate("/member/login")
            }
            else{
                alert("일치하는 회원정보가 없습니다.");
            }
            setPwContent({
                userid:'',
                email:''
            })
        }catch (error) {
            console.error('pwfind오류:', error);
          }
    }

    useEffect(() => {
        if (idContent.tel.length === 11) {
          setIdContent({
            ...idContent,
            tel: idContent.tel.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3'),
          });
        } else if (idContent.tel.length === 13) {
            setIdContent({
            ...idContent,
            tel: idContent.tel
              .replace(/-/g, '')
              .replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3'),
          });
        }
      }, [idContent.tel]);

    

    return(
        <div className="findtap">
        <div className="fMenu">
          <button onClick={()=>setFindState('idfind')} style={findState === 'idfind'? {backgroundColor: '#FAED7D', color: 'brown', fontWeight:'500'} : {backgroundColor: 'transparent', color: 'black', border: '1px solid black'}}>아이디 찾기</button>
          <button onClick={()=>setFindState('pwfind')} style={findState === 'pwfind'? {backgroundColor: '#FAED7D', color: 'brown',fontWeight:'500'} : {backgroundColor: 'transparent', color: 'black', border: '1px solid black'}}>비밀번호 찾기</button>
        </div>
        <div className="fboard">
          {
            findState === 'idfind'
            ?
            <div className='stateform'>
            <div className='textform'>
                <input type='text' placeholder='이름을 입력하세요' name='name' onChange={getIdValue} value={idContent.name}/>
                <input type='text' placeholder='전화번호를 입력하세요'  name='tel' onChange={getIdValue} value={idContent.tel} />
            </div>
            
            <Button style={{width:'120px'}} onClick={findId}>ID 찾기</Button>
            
        </div>
        
           :
            <div>
                <div className='stateform'>
            <div className='textform'>
                <input type='text' placeholder='아이디를 입력하세요' name='userid' onChange={getPwValue} value={pwContent.userid}/>
                <input type='text' placeholder='이메일을 입력하세요'  name='email' onChange={getPwValue} value={pwContent.email} />
            </div>
            
            {loading ? (
            <div className="loading-container">
              <img className="loading-main" src="../img/loading.png" alt="Loading" />
            </div>
          ) : (
            <Button style={{width:'120px'}} onClick={findPw}>PW 찾기</Button>
          )}
                </div>
             <p className='notice'>메일 발송까지 몇초간 소요됩니다. 잠시만 기다려주세요</p>
             </div>
          }
        </div>
      </div>
    )
}
export default Find;