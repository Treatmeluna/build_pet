import React, { useEffect, useState } from "react";
import { useParams  } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../../styles/Community.css';

const PetDetail = () => {
    const { desertionNo } = useParams();
    const [loading, setLoading] = useState(true);
    


    return (
        <div>
            <span>공고번호</span>
            <span>접수일자</span>
            <span>품종</span>
            <span>성별</span>
            <span>발견장소</span>
            <span>특징</span>
            <span>상태</span>
            <span>공고기간</span>

        </div>
    )
}

export default PetDetail;