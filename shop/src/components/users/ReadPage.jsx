import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Button, Card, InputGroup, Row, Col, Form } from 'react-bootstrap';
import ModalAddress from './ModalAddress';
import ModalPhoto from './ModalPhoto';

const ReadPage = () => {
  const uid = sessionStorage.getItem('uid');
  const [form, setForm] =useState({
    uid:uid,
    uname:'',
    phone:'',
    address1:'',
    address2: '',
    photo:''
  })

  const {uname, phone, address1, address2, photo} = form;

  const onChangeForm =(e)=>{
    setForm({...form, [e.target.name]:e.target.value});
  }

  const onSubmit = async(e) =>{
    e.preventDefault();
    if(uname===""){
      alert("이름을 입력하세요!");
      return;
    }
    if(!window.confirm("수정하신 정보를 저장하시겠습니까?")) return;
    
    //수정처리
    const url = "/users/update";
    const res = await axios.post(url, form);
    if(res.data.result===1){
      alert("정보수정완료!");
      callAPI();
    }

  }

    const callAPI = async()=>{
        const url =`/users/read/${uid}`;
        const res = await axios.get(url);
       setForm(res.data);
    }

    useEffect(()=> {
        callAPI();
    }, []);

  return (
    <Row className='justify-content-center my-5 myPage'>
      <Col xs={12} md={10} lg={8}>
        <Card>
          <Card.Header>
            <h3 className='text-center my-2'>마이페이지</h3>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={3} className='my-5'>
             <ModalPhoto uid={uid} photo={photo} callAPI={callAPI}/>
              </Col>
            <Col className='my-5'>
            <form onSubmit={onSubmit}>
              <InputGroup className='mb-2'>
                <InputGroup.Text className='justify-content-center title'>이름</InputGroup.Text>
                <Form.Control name="uname" value={uname} onChange={onChangeForm}/>
              </InputGroup>
              <InputGroup className='mb-2'>
                <InputGroup.Text className='justify-content-center title'>전화</InputGroup.Text>
                <Form.Control name="phone" value={phone} onChange={onChangeForm}/>
              </InputGroup>
              <InputGroup className='mb-2'>
                <InputGroup.Text className='justify-content-center title'>주소</InputGroup.Text>
                <Form.Control name="address1" value={address1} onChange={onChangeForm}/>
              <ModalAddress form={form} setForm={setForm}/>
              </InputGroup>
              <Form.Control className='' name="address2" value={address2} onChange={onChangeForm} placeholder="상세주소"/>
              <div className='text-center mt-3'>
                <Button variant="outline-danger me-2" type="submit">정보수정</Button>
                <Button onClick={callAPI} variant="outline-secondary">수정취소</Button>
              </div>
            </form>
            </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}

export default ReadPage