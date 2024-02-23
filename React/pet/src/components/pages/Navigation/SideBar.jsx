import React from "react";
import { NavLink } from "react-router-dom";
import { Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';

import '../../styles/Sidebar.css';
import SidebarItem from "./SidebarItem.jsx";

const SideBar = () => {
    
  const menus = [
    { name: "회원 관리", path: "/admin/adminPage/memberlist" },
    { name: "신고 관리", path: "/admin/adminPage/report" }
   
  ];

  return (
    <div className="sidebar" >
      {menus.map((menu, index) => {
        return (
          <NavLink to={menu.path} key={index} className="sideLink">
            <p>{menu.name}</p>
          </NavLink>
        );
      })}
    </div>
  );
    };


export default SideBar;