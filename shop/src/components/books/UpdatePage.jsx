import React, { useEffect, useState } from 'react'
import { Row, Col, Button, InputGroup, Form, Card} from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import ModalPhoto from './ModalPhoto'

const UpdatePage = () => {
  const {bid} = useParams();
  const [form, setForm] =useState({
    bid:bid,
    title:'',
    contents:'',
    author:'',
    image:'',
    publisher:'',
    price:'',
    fmtudate:'',
    bigimage:''
  })

  const { title, contents, author, image, price, fmtudate, publisher, bigimage} = form 
  

  const callAPI=async()=>{
    const res = await axios.get(`/books/read/${bid}`);
    console.log(res.data);
    setForm(res.data);
  }

  useEffect (()=>{
    callAPI();
  },[])

  const onChangeForm =(e)=>{
    setForm({...form, [e.target.name]:e.target.value});
  }


  const onUpdate =async()=>{
    if(!window.confirm("수정된 정보를 저장하시겠습니까?")) return;

    //수정하기
    const res = await axios.post('/books/update', form);
    if(res.data.result===1){
      alert("도서정보 수정이 완료되었습니다!");
      callAPI();
    }else{
      alert("도서정보수정실패!");
    }
  }


  const onChagePrice = (e) => {
    const result=e.target.value.replace(/[^0-9]/g,''); //숫자유효성체크
    setForm({...form, price:result});
  }


  
  return (
    <Row className='update justify-content-center my-5'>
        <Col xs={12} md={10} lg={8}>
          <Card>
            <Card.Header>
            <h1 className='text-center'>[{bid}]  도서 정보 수정</h1>
            </Card.Header>
            <Card.Body>
              <Row>
              <Col md={2} className='mb-2 text-center pt-2'>
               <ModalPhoto bigimage={bigimage} callAPI={callAPI}/>
              </Col>
              <Col className='my-2'>
                  <InputGroup className='mb-2'>
                    <InputGroup.Text className='title'>도서제목</InputGroup.Text>
                    <Form.Control name="title" value={title} onChange={onChangeForm}/>
                  </InputGroup>
                  <InputGroup className='mb-2'>
                    <InputGroup.Text className='title'>도서가격</InputGroup.Text>
                    <Form.Control name="price" value={price} onChange={onChagePrice} />
                  </InputGroup>
                  <InputGroup className='mb-2'>
                    <InputGroup.Text className='title'>도서저자</InputGroup.Text>
                    <Form.Control name="author" value={author} onChange={onChangeForm}/>
                  </InputGroup>
                  <InputGroup className='mb-2'>
                    <InputGroup.Text className='title'>도서출판사</InputGroup.Text>
                    <Form.Control name="publisher" value={publisher} onChange={onChangeForm}/>
                  </InputGroup>
                </Col>
                <div className='p-2'>
                  <Form.Control name="contents" as="textarea" rows={10} value={contents} onChange={onChangeForm}/>
                  </div>
                 <div className='text-center mt-2'>
                    <Button className='me-2' variant='danger' onClick={onUpdate}>정보수정</Button>
                    <Button variant='secondary' onClick={callAPI}>수정취소</Button>
                 </div>
              </Row>
              
            </Card.Body>
            <Card.Footer>
              <div className='text-muted text-end' style={{fontSize:'15px'}}>
                <span>최근 수정일 : {fmtudate}</span>
              </div>
            </Card.Footer>
          </Card>
        </Col>
    </Row>
  )
}

export default UpdatePage