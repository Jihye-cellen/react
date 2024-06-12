import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Row, Col, Card, Button, Tab, Tabs } from 'react-bootstrap'
import { useLocation, useParams } from 'react-router-dom'
import { IoMdHeart } from "react-icons/io";
import { IoIosHeartEmpty } from "react-icons/io";
import ReviewPage from './ReviewPage';
import { CountContext } from '../CountContext';

const BookReadPage = () => {
    const {count,setCount} =useContext(CountContext);
    const { pathname } = useLocation();
    //console.log(pathname)
    const uid = sessionStorage.getItem("uid");
    const [key, setKey] = useState('home');
    const { bid } = useParams();
    const [book, setBook] = useState({
        bid:'',
        author:'',
        title:'',
        bigimage:'',
        contents:'',
        isbn:'',
        fmtdate:'',
        fmtprice:'',
        publisher:'',
        lcnt:'',
        ucnt:''
      });

      const {author, title, bigimage, contents, isbn, fmtdate, lcnt, ucnt, fmtprice, publisher} = book;

   const callAPI = async() => {
    const res=await axios.get(`/books/read/${bid}?uid=${uid}`);
    console.log(res.data);
   setBook(res.data);
  }

    useEffect(() => {
        callAPI();
    }, []);

    const onLikeInsert = async (bid) => {
        if (uid) {
            //좋아요저장
            const res = await axios.post('/books/likes/insert', { bid, uid });
            if (res.data.result === 1) {
                alert("좋아요성공!");
                callAPI();
            }
        } else {
            alert("로그인이 필요한 작업입니다!");
            sessionStorage.setItem("target", pathname);
            window.location.href = "/users/login";
        }
    }


    const onClickCancel = async(bid)=> {
    const res=await axios.post('/books/likes/delete', {bid, uid});
    if(res.data.result===1){
      callAPI();
    }
  }

  const onClickCart = async() =>{
   if(!sessionStorage.getItem("uid")){
    alert("로그인이 필요한 작업입니다!");
    sessionStorage.setItem("target", pathname);
    window.location.href ="/users/login"
    
   }
    const res= await axios.post('/cart/insert', {uid:sessionStorage.getItem("uid"), bid});
    let message="";
    if(res.data.result===1){
        message="장바구니에 상품을 등록했습니다.";
        setCount(count+1);
    }else{
       message="장바구니에 이미 상품이 존재합니다. "
    }
    if(window.confirm(`${message} 쇼핑을 계속하시겠습니까?`)){
        window.location.href = "/";
    }else{
        window.location.href="/orders/cart";
    }
    
  } 

    return (
        <Row>
            <div className='my-5 text-center'>
                <h1>[{bid}] 도서정보</h1>
            </div>
            <Col>
                <Card>
                    <Card.Body>
                        <Row>
                            <Col md={6} lg={4} className="text-center mb-3">
                                <img src={bigimage || "http://via.placeholder.com/120x170"} width="80%" />
                            </Col>
                            <Col md={8} lg={6} className='my-5 align-self-center'>
                                <div> <h4 className='text-center'>[{bid}] {title} </h4></div>
                                <div className='text-end heart' style={{ fontSize: '19px' }}>
                                    {ucnt === 0 ?
                                        <IoIosHeartEmpty onClick={() => onLikeInsert(bid)} />
                                        : <IoMdHeart onClick={() => onClickCancel(bid)} />
                                    }
                                    <span style={{ fontSize: '12px' }}>{lcnt}</span>
                                </div>
                                <hr />
                                <div className='mb-2'> 저자: {author} </div>
                                <div className='mb-2'> 출판사: {publisher} </div>
                                <div className='mb-2'> isbn : {isbn} </div>
                                <div className='mb-2'> 가격: {fmtprice}원 </div>
                                <div className='mb-2'> 등록일: {fmtdate} </div>
                                <hr />
                            </Col>
                            <div className='text-center'>
                                <Button className='px-3 me-2' variant='danger'>바로구매</Button>
                                <Button className='px-3' variant='outline-warning' onClick={onClickCart}>장바구니</Button>
                            </div>
                        </Row>
                    </Card.Body>
                </Card>
            </Col>
            <Row className='my-5 justify-content-center'>
                <Col xs={12} md={12} lg={12}>
                    <Tabs
                       defaultActiveKey="home"
                        id="controlled-tab-example"
                        activeKey={key}
                        onSelect={(k) => setKey(k)}
                        className="mb-3"
                    >
                        <Tab eventKey="home" title="리뷰">
                           <ReviewPage bid={bid}/>
                        </Tab>
                        <Tab eventKey="profile" title="상세설명">
                           <div style={{whiteSpace:'pre-wrap'}}>{contents}</div> 
                        </Tab>
                    </Tabs>
                </Col>
            </Row>
        </Row>
    )
}

export default BookReadPage