import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Table, Button, InputGroup, FormControl, Col, Form, Row  } from 'react-bootstrap';
import ModalMap from './ModalMap';

const LocalSearch = () => {
    const [count, setCount] =useState(0);
    const [isEnd, setIsEnd] = useState(false);
    const [locals, setLocals] =useState([]);
    const [query, setQuery] =useState('가산디지털단지');
    const [page, setPage] =useState(1);
    const [size, setSize] =useState(5);
    

    const callAPI = async() => {
        const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${query}&page=${page}&size=${size}`;
        const config={
            headers : {"Authorization":"KakaoAK 20d01e20f89a5de9ecf4fd2d01cc1e22"}
          };
        const res = await axios.get(url, config) ; 
        console.log(res.data);
        setLocals(res.data.documents);
        setIsEnd(res.data.meta.is_end);
        setCount(res.data.meta.pageable_count);
    }

    useEffect (()=>{
        callAPI();
    },[page, size]);

    const onSubmit =(e)=>{
        e.preventDefault();
        if(query==''){
            alert('검색어를 입력하세요!');
        }else{
            setPage(1);
            callAPI();
        }
    }

    const onChangeSize =(e)=>{
        setPage(1);
        setSize(e.target.value);
    }

  return (
    <div className='my-5'>
        <h1 className='text-center my-5'>지역검색</h1>
    <Row className='mb-2'>
        <Col xs={8} md={6} lg={4}>
            <Form onSubmit={onSubmit}>
                <InputGroup>
                    <FormControl value={query} onChange={(e)=>setQuery(e.target.value)}/>
                    <Button type='submit' className='btn btn-dark'>검색</Button>
                </InputGroup>
            </Form>
        </Col>
        <Col>
            <div className='mt-2'>검색수 : {count} 건 </div>
        </Col>
        <Col xs={2} className='text-end'>
            <Form.Select onChange={onChangeSize}>
                <option value={5} selected={size===5}>5행</option>
                <option value={10} selected={size===10}>10행</option>
                <option value={15} selected={size===15}>15행</option>
            </Form.Select>
        </Col>
        
    </Row>

    <Table bordered hover className='text-center' >
        <thead>
            <tr className='table-secondary'>
                <td>ID</td>
                <td>지역명</td>
                <td>전화번호</td>
                <td>주소</td>
                <td>지도보기</td>
            </tr>
        </thead>
        <tbody>
            {locals.map(local=>
                <tr key={local.id}>
                    <td>{local.id}</td>
                    <td><div className='ellipsis'>{local.place_name}</div></td>
                    <td><div className='ellipsis'>{local.phone || '-'}</div></td>
                    <td><div className='ellipsis'>{local.address_name}</div></td>
                    <td><ModalMap local={local}/></td>
                </tr>
            )}
        </tbody>
        
    </Table>
    <div className='text-center ms-2'>
        <Button className='btn btn-dark' onClick ={()=>setPage(page-1)} disabled={page===1}>이전</Button>
        <span className='mx-3'>{page}</span>
        <Button className='btn btn-dark'onClick ={()=>setPage(page+1)} disabled={isEnd===true}>다음</Button>
    </div>
    </div>
  )
}

export default LocalSearch