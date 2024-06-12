import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Form, InputGroup, Table, Row, Col } from 'react-bootstrap';
import { BeatLoader } from 'react-spinners';

const SearchPage = () => {
    const [chk, setChk] =useState(0);
    const [page, setPage] =useState(1);
    const [size, setSize] =useState(5);
    const [query, setQuery] =useState('리액트');
    const [loading, setLoading]=useState(false);
    const [books, setBooks]=useState([]);
    const [total, setTotal] =useState(0);
    const [isEnd, setIsEnd] =useState([]);

    const onSubmit =(e)=>{
        e.preventDefault();
        if(query===""){
            alert("검색어를 입력하세요!");
            return;
        }else if(total==0){
            alert("검색결과가 없습니다.");
        }
        else{
            setPage(1);
            callAPI();
        }
    }

    const callAPI =async()=>{
        const url=`https://dapi.kakao.com/v3/search/book?target=title&query=${query}&size=${size}&page=${page}`;
        const config={
            "headers" : {"Authorization":"KakaoAK 20d01e20f89a5de9ecf4fd2d01cc1e22"}
        }
        setLoading(true);
        const res= await axios.get(url, config);
        const documents= res.data.documents;
        setBooks(documents.map(book=> book && {...book, checked:true}));
        setIsEnd(res.data.meta.is_end);
        setTotal(res.data.meta.pageable_count);
        setLoading(false);
    }

useEffect (()=>{
    callAPI();
},[page])


const onInsert = async(book) =>{
    if(!window.confirm(`${book.title}의 도서를 등록하시겠습니까?`)) return;
    console.log(book);
    //도서등록
    const res = await axios.post('/books/insert', book);
    const data ={...book, authors:book.authors.join(',')} //배열(object)에서 string으로 바꿔주는 함수 join
    if(res.data.result===1){
        alert("도서등록완료!");
    }else{
        alert("이미 등록된 도서입니다.");
    }
}


const onChangeAll =(e)=>{
    setBooks(books.map(book=>book && {...book, checked:e.target.checked}))
}

const onChangeSingle =(e, isbn)=>{
    setBooks(books.map(book=>book.isbn===isbn ? {...book, checked:e.target.checked} : book));
}


useEffect(()=>{
    let count = 0;
    books.forEach(book=>book.checked && count++);
    setChk(count);
},[books])



const onInsertChecked = () =>{
    if(chk===0){
        alert("저장할 도서를 선택하세요!");
        return;
    }
    if(!window.confirm(`${chk}개 도서를 저장하시겠습니까?`)) return;
    //선택도서 저장
    let count =0;
    let inserted=0;
    books.forEach(async book=>{
        if(book.checked){
            const data={...book, authors:book.authors.join(',')}
            const res = await axios.post('/books/insert', data);
            count++;

            if(res.data.result===1) inserted++;
            if(count===chk){
                alert(`${inserted}개 도서가 저장되었습니다.`);
                setBooks(books.map(book => book && {...book, checked:false}));
            }
            
        }
    })

}

if(loading) return <h1 className='text-center my-5'><BeatLoader/></h1>
  return (
    <div className='my-5'>
      <h1 className='text-center'>도서검색</h1>
      <Row>
        <Col xs={6} md={5} lg={4} className='mb-3'>
            <form onSubmit={onSubmit}>
                <InputGroup>
                    <Form.Control value={query} onChange={(e)=>setQuery(e.target.value)}/>
                    <Button variant='danger'>검색</Button>
                </InputGroup>
            </form>
        </Col>
        <Col className='mt-2'>
            검색수: {total}건
        </Col>
        <Col className='text-end'>
            <Button onClick={onInsertChecked} variant='outline-danger'>도서저장</Button>
        </Col>
      </Row>
      <Table striped bordered hover className='align-middle'>
        <thead>
           <tr className='text-center'>
                <td><input onChange={onChangeAll} checked={chk===books.length} type="checkbox"/></td>
                <td>isbn</td>
                <td>Title</td>
                <td>Price</td>
                <td>Authors</td>
                <td>등록</td>
            </tr>     
        </thead>
        <tbody>
            {books.map(book=>
                <tr key={book.isbn}>
                    <td className='text-center'><input onChange={(e)=>onChangeSingle(e, book.isbn)}  checked={book.checked} type="checkbox"/></td>
                    <td>{book.isbn}</td>
                    <td><img src={book.thumbnail || 'http://via.placeholder.com/120x170'} width="10%" className='me-4'/>{book.title}</td>
                    <td>{book.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원</td>
                    <td>{book.authors}</td>
                    <td><Button onClick={()=>onInsert(book)} variant='danger' size="sm">등록</Button></td>
                </tr>
            )}
        </tbody>
        </Table>
        <div className='text-center'>
            <Button variant='danger' onClick={()=>setPage(page-1)} disabled={page===1}>이전</Button>
            <span className='mx-3'>{page}</span>
            <Button variant='danger' onClick={()=>setPage(page+1)} disabled={isEnd}>다음</Button>
      </div>     
    </div>
  )
}

export default SearchPage