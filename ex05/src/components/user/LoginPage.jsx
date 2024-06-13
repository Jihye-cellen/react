import axios from 'axios';
import React, { useState } from 'react'
import {Row, Col, Card, InputGroup, Form, Button} from 'react-bootstrap' 

const LoginPage = () => {
    const [form, setForm] = useState({
      uid:'red',
      upass:'pass'
});
const {uid, upass} = form;

const onChangeForm = (e)=>{
  setForm({...form, [e.target.name]:e.target.value});
}

const onSubmit = async(e)=>{
  e.preventDefault();
  if(uid=="" || upass==""){
    alert("정보를 입력하세요!");
    return;
  }
  const res = await axios.get(`/users/${uid}`);
  console.log(res.data);
  if(!res.data){
    alert("아이디가 존재하지 않습니다!");
  }else if(upass===res.data.upass){
    alert("로그인 성공!");
    sessionStorage.setItem("uid", res.data.uid);
    sessionStorage.setItem("uname", res.data.uname);

      if(sessionStorage.getItem("target")){
        window.location.href=sessionStorage.getItem("target");
      }else{
        window.location.href="/";
      }
  }else{
    alert("비밀번호가 일치하지 않습니다!");
  }
}

  return (
    <div>
        <Row className='justify-content-center my-5'> 
          <Col xs={10} md={8} lg={6}>
            <Card>
              <Card.Header className='text-center'><h2>로그인</h2></Card.Header>
              <Card.Body>
                <Row>
                 <Col>
                 <img src="/image/loginPage.jpg" width="100%"/>
                </Col> 
                <Col className='align-self-center'>
                <form onSubmit={onSubmit}>
                  <InputGroup className='mb-2'>
                    <InputGroup.Text className='title'>아이디</InputGroup.Text>
                    <Form.Control name="uid" value={uid} onChange={onChangeForm}/>
                  </InputGroup>
                  <InputGroup className='mb-2'>
                    <InputGroup.Text className='title'>비밀번호</InputGroup.Text>
                    <Form.Control type="password" name="upass" value={upass} onChange={onChangeForm}/>
                  </InputGroup>
                  <Button type="submit" className='w-100'>로그인</Button>
                </form>
                </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
    </div>
  )
}

export default LoginPage