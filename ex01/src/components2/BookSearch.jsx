import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Card, Row, Col, CardFooter, InputGroup, Form, Button, Spinner } from 'react-bootstrap';
import ModalBook from './ModalBook';


const BookSearch = () => {
    const [loading, setLoading] =useState(false);
    const [total, setTotal] =useState(0);
    const [last, setLast] =useState(false);
    const [page, setPage] =useState(1);
    const [query, setQuery] = useState('파이썬');
    const [books, setBooks] = useState([]);

    const callAPI = async()=> {
        setLoading(true);
        const url=`https://dapi.kakao.com/v3/search/book?target=title&query=${query}&size=12&page=${page}`;
        const config={
            headers:{"Authorization":"KakaoAK 20d01e20f89a5de9ecf4fd2d01cc1e22"}
        }
        const res = await axios.get(url, config);
        console.log(res.data);
        setBooks(res.data.documents); 
        setLast(res.data.meta.is_end); 
        setTotal(res.data.meta.pageable_count);
        setTimeout(()=>{setLoading(false);}, 1000); 
        
    };

    useEffect(()=>{
        callAPI();
    }, [page]);

    const onSubmit =(e)=> {
        e.preventDefault();
        if(query==""){
            alert("검색어를 입력하세요!");
        }else{
            setPage(1);
            callAPI();
        }
    }
    if(loading) return <div className='text-center my-5'><Spinner/></div>
  return (
    <div className='my-5 bookSearch'>
        <h1 className='text-center'>도서검색</h1>
        <Row className='mb-2'>
            <Col xs={8} md={6} lg={4}>
                <Form onSubmit={onSubmit}>
                    <InputGroup>
                        <Form.Control onChange={(e)=>setQuery(e.target.value)}
                         value={query} placeholder="검색어"/>
                        <Button type ="submit">검색</Button>
                    </InputGroup>
                </Form>
            </Col>
            <Col>
                    <div className='mt-2'> 
                        <span className='mb-2 ms-3'>검색수 : {total}권 </span>
                    </div>
                </Col>
        </Row>
       
        <Row>
            {books.map(book=>
                <Col className='mb-3' xs={6} md={4} lg={2}>
                    <Card>
                        <Card.Body>
                            <ModalBook book1={book}/>
                        </Card.Body>
                        <CardFooter>
                            <div className='ellipsis title'>{book.title}</div>
                        </CardFooter>
                    </Card>
                </Col>
            )}
        </Row>
        {total > 12 && 
        <div className="text-center">
            <Button onClick={()=>setPage(page-1)} disabled={page===1}>이전</Button>
            <span className='mx-3'>{page}</span>
            <Button onClick={()=>setPage(page+1)} disabled={last===true}>다음</Button>
        </div>
        }
    </div>
  )
}

export default BookSearch