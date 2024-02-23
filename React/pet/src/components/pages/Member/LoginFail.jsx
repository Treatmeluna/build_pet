import React, { useEffect, useState } from "react";
import LoginForm from "./LoginForm.jsx";

const LoginFail = () => {
    useEffect(() => {
        alert("로그인에 실패하였습니다.");
    }, [])
  return (
    <>
   <LoginForm/>
    </>
  );
};

export default LoginFail;
