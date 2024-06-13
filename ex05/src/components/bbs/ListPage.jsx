import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Row, Table, Col, InputGroup, Form, FormSelect, Button } from 'react-bootstrap';
import '../pagination.css';
import  Pagination from 'react-js-pagination'
import { Link } from 'react-router-dom';

const ListPage = () => {
    const [list, setList]=useState([]);
    const [page, setPage]=useState(1);
    const [size, setSize]=useState(5);
    const [key, setKey]=useState('title');
    const [word, setWord]=useState("");
    const [count, setCount]=useState(0);

    const onSubmit =(e)=>{
        e.preventDefault();
        callAPI();
    }

    const callAPI=async()=>{
        const res = await axios.get(`/bbs/list.json?key=${key}&word=${word}&page=${page}&size=${size}`);
        console.log(res.data);
        setList(res.data.documents);
        setCount(res.data.total);
    }

    useEffect (()=>{
        callAPI();
    },[page])

  return (
    <div className='my-5'>
        <h1 className='text-center'>게시판</h1>
        <Row className='mb-2'>
            <Col xs={8} md={5} lg={4}>
                <form onSubmit={onSubmit}>
                    <InputGroup>
                        <FormSelect className='me-2' value={key} onChange={(e)=>setKey(e.target.value)}>
                            <option value="title">제목</option>
                            <option value="contents">내용</option>
                            <option value="uid">작성자(아이디)</option>
                            <option value="uname">작성자(이름)</option>
                        </FormSelect>    
                            <Form.Control placeholder='검색어' value={word} onChange={(e)=>setWord(e.target.value)}/>
                            <Button type="submit" variant='dark'>검색</Button>
                    </InputGroup>
                </form>
            </Col>
            <Col className='mt-1'>
                검색수:{count}
            </Col>
            {sessionStorage.getItem("uid") &&
                <Col className='text-end'>
                    <Link to="/bbs/insert"><Button variant='outline-dark'>글쓰기</Button></Link>
                </Col>
            }
        </Row>
        <Table className='mt-2 table-hover'>
            <thead>
                <tr className='table-dark text-center'>
                    <td>NO.</td>
                    <td>제목</td>
                    <td>작성자</td>
                    <td>작성일</td>
                    <td>조회수</td>

                </tr>
            </thead>
            <tbody className='text-center'>
            {list.map(bbs=>
                <tr key={bbs.bid}>
                    <td>{bbs.bid}</td>
                    <td><a href={`/bbs/read/${bbs.bid}`}>{bbs.title} [{bbs.replyCnt}]</a></td>
                    <td>{bbs.uid}({bbs.uname})</td>
                    <td>{bbs.fmtdate}</td>
                    <td>{bbs.viewcnt}</td>
                </tr>
            )}

            </tbody>
        </Table>
        {count>size &&
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