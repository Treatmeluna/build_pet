import { NavLink, useNavigate } from 'react-router-dom';
import '../../styles/Navigation.css';
import logo from '../../assets/logo.png';
import { Link } from 'react-router-dom';

const Navigation = ({isLogin,setIsLogin}) => {
   
const navigate = useNavigate();

const handleLogout = async () => {
  try {
    console.log("로그아웃")
    const response = await fetch('/logout', {
      method: 'POST',
    });

    if (response.ok) {
      console.log('로그아웃 성공');

      //로컬 스토리지에서 토큰 제거
     sessionStorage.clear();
     setIsLogin(false);

       navigate("/");
      //window.location.href("/")
    } else {
      console.error('로그아웃 실패');
    }
  } catch (error) {
    console.error('로그아웃 중 오류 발생', error);
  }
};
      

    return(
      <div className='nav'>
        <div className='nav-left'>
        <NavLink className='navmenu' to="/">MAIN</NavLink>
        <NavLink className='navmenu' to="/pet">PET</NavLink>
        <NavLink className='navmenu' to="/community">COMMUNITY</NavLink>
        <NavLink className='navmenu' to="/enjoy">ENJOY</NavLink>
        </div>
        <Link className='logo' to="/">
          <img alt='logo' src={logo}></img>
        </Link>
      <div className="nav-right">
        {!isLogin ? (
          <>
            <NavLink className='navmenu' to="/member/join">SIGN-UP</NavLink>
            <NavLink className='navmenu' to="/member/login">SIGN-IN</NavLink>
          </>

        ) : (
          <>
            {sessionStorage.getItem("role") === "ROLE_ADMIN" ? (
              <NavLink className='navmenu' to="/admin/adminpage/memberlist">ADMIN</NavLink>
            ) : (
              <NavLink className='navmenu' to="/member/mypage">MY-PAGE</NavLink>

            )}
            <NavLink className='navmenu' to="#" onClick={handleLogout}>LOGOUT</NavLink>
          </>
        )}
      </div>
    </div>

    );
};

export default Navigation;