import React, { useContext, useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import RouterPage from '../RouterPage';
import { Badge } from 'react-bootstrap';
import { FaNode } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BsCart4 } from "react-icons/bs";
import { CountContext } from '../CountContext'; //중괄호로 import = default값이 없기 때문
import AdminRouter from './AdminRouter';


const AdminMenu = () => {
    const {count, setCount}=useContext(CountContext);
    const navi = useNavigate();
    const uid = sessionStorage.getItem("uid");
    const [user, setUser] = useState('');
  
    const callAPI = async()=>{
      const url =`/users/read/${uid}`;
      const res = await axios.get(url);
      setUser(res.data);
  
    }
  
    useEffect(()=>{
      if(uid) callAPI();
    },[uid])
  
  
  
    const onClickLogout =(e)=>{
      e.preventDefault();
      if(window.confirm("로그아웃 하시겠습니까?")){
        sessionStorage.clear();
        navi("/");
      }
    }
    return (
      <>
        <Navbar expand="lg" className="bg-light" variant="light">
          <Container fluid>
            <Navbar.Brand href="#" style={{ fontSize: '20px' }}><FaNode /></Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
            {uid==='admin' &&
             <>
              <Nav
                className="me-auto my-2 my-lg-0"
                style={{ maxHeight: '100px' }}
                navbarScroll
              >
               
               
                <Nav.Link href="/books/search">도서검색</Nav.Link>
                <Nav.Link href="/books/list">도서목록</Nav.Link>
                <Nav.Link href="/admin/orders">주문관리</Nav.Link>
              </Nav>
              </>
              }
              {uid && uid !=='admin' &&
              <Nav.Link href="/orders/list">주문목록</Nav.Link>
              }
  
              {uid=='admin' ?
                <>  
                  <Nav>
                    <Nav.Link href="/users/read">{uid} ({user.uname})님</Nav.Link>
                  </Nav>
                  <Nav>
                    <Nav.Link href="#" onClick={onClickLogout}>로그아웃</Nav.Link>
                  </Nav>
                </>
                :
                <>
               <Nav>
                 <Nav.Link href="/orders/cart" className='active'>
                  <>
                  <BsCart4 style={{fontSize:"25px", position:'absolute'}} /> 
                  <Badge bg="danger" style={{position:'relative', top:'-10px', left:'-10px'}}>{count}</Badge>
                  </>
                 </Nav.Link>
                </Nav>
                <Nav>
                  <Nav.Link href="/users/login">로그인</Nav.Link>
                </Nav>
                </> 
              }
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <RouterPage />
        <AdminRouter/>
      </>
    );
}

export default AdminMenu