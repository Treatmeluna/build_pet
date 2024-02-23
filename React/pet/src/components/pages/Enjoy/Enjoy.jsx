import React from 'react';
import { Container } from 'react-bootstrap';
import '../../styles/Enjoy.css';

const Enjoy=()=>{
    
    return(

        <Container className='enjoyTap'>
          <div className='game'>
            <a href='/enjoy/shooting'>
            <img src='../../gameimg/shooting.png' style={{width:'100%', height:'100%'}}/>
            <span>SHOOTING 게임 하러가기</span>
            </a>
            <a href='/enjoy/merge'>
            <img src='../../merge/catcatmerge.png' style={{width:'100%', height:'100%', backgroundColor:'white'}}/>
            <span>CAT CAT MERGE 하러가기</span>
            </a>
          </div>
        </Container>

    )
}

export default Enjoy;