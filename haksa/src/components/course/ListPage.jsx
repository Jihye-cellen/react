import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Table, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import Pagination from 'react-js-pagination';
import '../../common/Page.css'
import { Link } from 'react-router-dom';
import { BoxContext } from '../../context/BoxContext';

const ListPage = () => {
  const {setBox}=useContext(BoxContext);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(5);
  const [count, setCount] =useState(0);
  const [list, setList] =useState([]);
  const [word, setWord] = useState("");
  
  const callAPI =async()=>{
    const res = await axios.get(`/cou?page=${page}&size=${size}`);
    console.log(res.data);
    setList(res.data.list);
    setCount(res.data.total);
    const last = Math.ceil(res.data.total/size);
    if(page>last) setPage(page-1);
  }

  const onClickDelete =(cou)=>{
    if(cou.persons>0){
      setBox({
        show:true,
        message:`${cou.persons}명이 수강신청한 강좌입니다.`
      });
      return;
    }
    setBox({
      show:true,
      message:`${cou.lname} 강좌를 삭제하시겠습니까?`,
      action: async()=> {await axios.post(`/cou/delete/${cou.lcode}`); 
                        callAPI();}
             
    })
  }
  useEffect(()=>{
    callAPI();
  },[page]);

  const onSubmit =(e)=>{
    e.preventDefault();
    if(word===""){
      alert("검색어를 입력하세요!")
    }else{
      setPage(1);
      callAPI();
    }
  }

  return (
    <div>
      <h1 className='mb-5'>강좌목록</h1>
      <Row>
        <Col xs={6} md={5} lg={4}>
          <form onSubmit={onSubmit}>
            <InputGroup>
            <Form.Control placeholder="검색어" name="word" value={word} onChange={(e)=>setWord(e.target.value)}/>
            <Button variant='outline-dark'>검색</Button>
            </InputGroup>
          </form>
        </Col>
        <Col>검색수: {count}명</Col>
        <Col className='text-end'><Link to="/cou/insert">강좌등록</Link></Col>
      </Row>
      <hr/>
    <Table bordered hover className='text-center'>
      <thead>
        <tr className='table-dark'>
          <td>강좌코드</td>
          <td>강좌이름</td>
          <td>수강시간</td>
          <td>강의실</td>
          <td>신청인원/수용인원</td>
          <td>지도자</td>
          <td>지도교수학과</td>
          <td>삭제</td>
        </tr>
      </thead>
      <tbody>
        {list.map(cou=>
          <tr key={cou.lcode}>
            <td>{cou.lcode}</td>
            <td><Link to={`/cou/read/${cou.lcode}`}>{cou.lname}</Link></td>
            <td>{cou.hours}시간</td>
            <td>{cou.room ? `${cou.room}호` : '배정중'}</td>
            <td>{cou.persons}명/{cou.capacity}명</td>
            <td>{cou.pname ? `${cou.pname}(${cou.instructor})` : '교수미지정' }</td>
            <td>{cou.dept}</td>
            <td><Button variant='outline-danger' size="sm" onClick={()=>onClickDelete(cou)}>삭제</Button></td>
          </tr>
        )}
      </tbody> 
    </Table>
    {count > size &&
    <Pagination
            activePage={page}
            itemsCountPerPage={size}
            totalItemsCount={count}
            pageRangeDisplayed={5}
            prevPageText={"‹"}
            nextPageText={"›"}
            onChange={ (e)=>setPage(e) }/>
    }        
    </div>
  )
}

export default ListPage