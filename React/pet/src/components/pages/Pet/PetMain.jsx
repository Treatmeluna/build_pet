import React,{useState} from 'react';
import '../../styles/Community.css';
import PetList from './PetList.jsx';

export default function PetMain() {

    return(
        <div className='community'>
            <PetList />
        </div>
    )
}