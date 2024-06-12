import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Form, InputGroup, Button, FormControl } from 'react-bootstrap';
import Pagination from 'react-js-pagination';
import './Paging.css';
import { IoMdHeart } from "react-icons/io";
import { IoIosHeartEmpty } from "react-icons/io";
import { LiaComment } from "react-icons/lia";




const HomePage = () => {
  const uid=sessionStorage.getItem("uid");
  const [count, setCount] =useState(0);
  const [books, setBooks] =useState([]);
  const [page, setPage] =useState(1);
  const [size, setSize] =useState(6);
  const [key, setKey] =useState('title');
  const [word, setWord] =useState('');

  const callAPI =async()=>{
    const res= await axios.get( `/books/list?page=${page}&size=${size}&key=${key}&word=${word}&uid=${uid}`);
    console.log(res.data);
    setBooks(res.data.documents);
    setCount(res.data.count);
  }

  useEffect(()=>{
    callAPI();
  },[page])


 const onSubmit =(e)=>{
  e.preventDefault();
  setPage(1);
  callAPI();
 }


 const onClickLike =async(bid)=>{
  if(uid){
    //좋아요 저장
    const res = await axios.post('/books/likes/insert', {uid,bid});
    alert(res.data.result);
    callAPI();

  }else{
    alert("로그인이 필요한 작업입니다.");
    window.location.href="/users/login";
  }
 }

 const onClickCancel = async(bid) =>{
  const res = await axios.post("/books/likes/delete", {uid, bid});
  if(res.data.result===1){
    alert(res.data.result);
    callAPI();
  }
 }


  return (
    <div>
      <div>
        <h1 className="text-center my-5">Kosmo&Book</h1>
        </div>
    
        <Row className='mb-3 justify-content-center'>
          <Col xs={6} md={5} lg={4} className='text-end'> 
          <form onSubmit={onSubmit}>
            <InputGroup>
              <Form.Select className='me-2' value={key} onChange={(e)=>setKey(e.target.value)}>
                <option value="title">제목</option>
                <option value="author">저자</option>
                <option value="publisher">출판사</option>
              </Form.Select>
              <Form.Control placeholder="검색어를 입력하세요!" value={word} onChange={(e)=>setWord(e.target.value)}/>
              <Button variant='danger'type="submit">검색</Button>
            </InputGroup>
            </form>
          </Col>
        </Row>
        <Col className='text-center mb-2'>
          <span>검색결과 : {count}권 </span>
        </Col>
        <Row className="mb-5">
          {books.map(book=>
            <Col key={book.bid} xs={6} md={4} lg={2}>
              <Card>
                <Card.Body>
                 <a href={`/books/read/${book.bid}`}><img src={book.image} width="100%"/></a> 
                </Card.Body>
                <Card.Footer>
                  <Row>
                    <Col><div className='ellipsis' style={{fontSize:'14px'}}>{book.title}</div></Col>
                    
                    <Col className='text-end heart'>
                    <LiaComment style={{fontSize:'18px', color:'black'}} />
                    <span style={{fontSize:'12px', color:'black'}} className='me-2'>{book.rcnt}</span>
                      {book.ucnt===0 ?
                    <IoIosHeartEmpty onClick={()=>onClickLike(book.bid)}/>
                      :<IoMdHeart onClick={()=>onClickCancel(book.bid)}/> 
                      }
                      <span style={{fontSize:'12px'}}>{book.lcnt}</span>
                    </Col>
                    <div style={{fontSize:'14px'}}>{book.fmtPrice}원</div>
                  </Row>
                </Card.Footer>
              </Card>
            </Col>
          )}
        </Row>

        {count > size &&
        <Pagination
             activePage={page}
             itemsCountPerPage={size}
             totalItemsCount={count}
             pageRangeDisplayed={5}
             prevPageText={"‹"}
             nextPageText={"›"}
             onChange={(e)=>setPage(e)}/> 
        }
        </div>
  )
}

export default HomePage