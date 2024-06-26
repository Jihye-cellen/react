import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import RouterPage from '../routers/RouterPage'
import HeaderPage from './HeaderPage'
import { BoxContext } from './BoxContext'
import { IoMdReturnLeft } from 'react-icons/io'


const MenuPage = () => {
  const {user, setUser} = useContext(BoxContext);
  
  const onClickLogout = (e) =>{
    e.preventDefault();
    if(!window.confirm("로그아웃하시겠습니까?")) return;
    setUser({uid:''});
    sessionStorage.clear();
  }

  return (
    <>
      <HeaderPage/>
      <div className='mt-5'>
        <Link to='/' className='me-3'>Home</Link>
        <Link to='/goods/search' className='me-3'>상품검색</Link>
        <Link to='/goods/list' className='me-3'>상품목록</Link>
        {sessionStorage.getItem("uid") ? 
          <>
            <Link to='#' className='me-3' style={{float:'right'}} onClick={onClickLogout}>로그아웃</Link>
            <Link to='/users/mypage' className='me-3' style={{float:'right'}}>{sessionStorage.getItem("uid")}</Link>
          </>
          :
          <Link to='/users/login' className='me-3' style={{float:'right'}}>로그인</Link>
        }
        
        <hr/>
      </div>
      <RouterPage/>
    </>
  )
}

export default MenuPage