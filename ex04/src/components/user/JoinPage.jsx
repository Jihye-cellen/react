
import React, { useState } from 'react'
import {Row, Col, InputGroup, Form, Button, Card} from 'react-bootstrap'
import { app } from '../../firebaseInit'
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'


const JoinPage = () => {
    const navi = useNavigate();
    const auth = getAuth(app);

    const [form, setForm] = useState({
        email:'black@test.com',
        pass:'12341234'
    });
    const {email, pass} =form;

    const onSubmit =(e)=> {
        e.preventDefault();
        if(email==="" || pass===""){
            alert("이메일과 비밀번호를 입력하세요!");
        }else{
            createUserWithEmailAndPassword(auth, email, pass)
            .then(success=>{
                alert("회원가입이 완료되었습니다!")
               navi("/user/login");
            })
            .catch(error=>{
                alert("회원가입오류:" + error)
            })
        }
    }


    const onChangeForm =(e)=>{
        setForm({
            ...form, [e.target.name]:e.target.value
        })
    }
  return (
    <Row className='justify-content-center my-5 userLogin'>
        <Col xs={8} md={6} lg={5}>
            <Card>
                <Card.Header>
                    <h3 className='text-center'>회원가입</h3>
                </Card.Header>
                <Card.Body>
                    <form onSubmit={onSubmit}>
                        <InputGroup className='mb-2'>
                            <InputGroup.Text className="title justify-content-center">아이디</InputGroup.Text>
                            <Form.Control name="email" value={email} placeholder='이메일을 입력하세요!' onChange={onChangeForm}/>
                        </InputGroup>
                        <InputGroup className='mb-3'>
                            <InputGroup.Text className="title justify-content-center">비밀번호</InputGroup.Text>
                            <Form.Control name="pass" value={pass} placeholder='비밀번호는 8-16자 입력하세요!' onChange={onChangeForm}/>
                        </InputGroup>
                        <Button className='w-100 btn btn-dark' type="submit">회원가입</Button>
                    </form>
                </Card.Body>
            </Card>
        </Col>
    </Row>
  )
}

export default JoinPage