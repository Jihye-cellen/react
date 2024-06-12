import React, { useId } from 'react'
import { useState } from 'react'
import { Row, Col, Card, Form, InputGroup, Button, CardBody } from 'react-bootstrap'
import {app} from '../../firebaseInit'
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth' 
import { useNavigate } from 'react-router-dom'

const LoginPage = () => {
    const navi = useNavigate();
    const auth = getAuth(app);
    const [form, setForm] =useState({
        email:'red@test.com',
        pass: '12341234'
    });

    const {email, pass} = form;
    const onChangeForm = (e) => {
        setForm({
            ...form,
            [e.target.name]:e.target.value
        });
    }

const onSubmit =(e)=>{
    e.preventDefault();
    if(email===''|| pass===''){
        alert("이메일과 패스워드를 입력하세요!");
        return;
    }else{
       signInWithEmailAndPassword(auth, email, pass)
       .then(success=>{
        sessionStorage.setItem('email', email);
        sessionStorage.setItem('uid', success.user.uid);
        navi('/')
       })
       .catch(error=>{
        alert('이메일과 비밀번호가 일치하지 않습니다');
       })
    }
}

  return (
    <div className='my-5 userLogin'>
        <Row className='justify-content-center'>
            <Col xs={8} md={6} lg={4}>
                <Card>
                    <Card.Header><h3 className='text-center'>로그인</h3></Card.Header>
                    <CardBody>
                        <Form onSubmit={onSubmit}>
                            <InputGroup className='mb-2'>
                            <InputGroup.Text className='title'>ID</InputGroup.Text>
                            <Form.Control name="email" value={email}  onChange={onChangeForm} placeholder='이메일을 입력하세요'/>
                            </InputGroup>
                            <InputGroup className='mb-2'>
                            <InputGroup.Text>PASSWORD</InputGroup.Text>
                            <Form.Control name="pass" value={pass} type="password"  onChange={onChangeForm} placeholder='비밀번호를 입력하세요'/>
                            </InputGroup>
                            <Button type="submit" className='w-100  btn btn-dark'>로그인</Button>
                        </Form>
                    </CardBody>
                </Card>
            </Col>

        </Row>
    </div>
  )
}

export default LoginPage