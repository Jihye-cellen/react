import React from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import Home from './Home'
import BBSRouter from './router/BBSRouter'
import UserRouter from './router/UserRouter'

const MenuPage = () => {
  const photo = sessionStorage.getItem("photo") && `/display?file=${sessionStorage.getItem("photo")}`;
  const uid = sessionStorage.getItem("uid");
  const uname=sessionStorage.getItem("uname");

  const onLogout = (e)=>{
    e.preventDefault();
    if(!window.confirm("로그아웃 하시겠습니까?")) return;
    sessionStorage.clear();
    window.location.href="/";
  }

  return (
    <div>
        <Link to="/" className='me-5'>HOME</Link>
        <Link to="/bbs/list" className='me-5'>게시판</Link>
        {uid ?
          <>
          <Link to="/users/read" className='me-2'>
            <img src={photo || "http://via.placeholder.com/50x50"} width="40px" style={{border:'1px solid gray'}} className='me-2'/>
          {uname}님</Link>
          <Link to="#" className='me-5' onClick={onLogout}>로그아웃</Link>
          </>
          :
          <>
          <Link to="/users/login" className='me-5'>로그인</Link>
          </>   
        }
        
        <hr/>

        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/bbs/*" element={<BBSRouter/>}/>
            <Route path="/users/*" element={<UserRouter/>}/>
       </Routes>
    </div>
  )
}

export default MenuPage