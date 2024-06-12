import React, { useState } from 'react'
import {Row, Col, InputGroup, Form, Button, Card} from 'react-bootstrap'
import { app } from '../../firebaseInit'
import { getAuth , signInWithEmailAndPassword} from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { ClipLoader} from 'react-spinners'

const LoginPage = () => {
    const navi = useNavigate();
    const auth = getAuth(app);
    const [loading, setLoading] =useState(false);

    const [form, setForm] = useState({
        email:'red@test.com',
        pass:"12341234"
    });

    const {email, pass} = form;

    const onChangeForm = (e) =>{
       setForm( {...form, [e.target.name]:e.target.value})
    }

    const onSubmit = (e) =>{
        e.preventDefault();
        if(email===""|| pass===""){
            alert("이메일과 비밀번호를 입력하세요!")
        }else{
            //로그인체크
            setLoading(true);
            signInWithEmailAndPassword(auth, email, pass)
            .then(success=>{
                sessionStorage.setItem('email', email);
                sessionStorage.setItem('uid', success.user.uid);
               // alert("로그인성공!" + success.user.uid);
               setLoading(false);
               if(sessionStorage.getItem("target")){
                    navi(sessionStorage.getItem("target"));
                }else{
                    navi("/");
                 }
            })
            .catch(error=>{
                alert('이메일 또는 비밀번호가 일치하지 않습니다');
                setLoading(false);
                    
            });
        }
    }
  if(loading) return 
    <div className='text-center'>
      <ClipLoader/>
    </div>
  return (
    <Row className='justify-content-center my-5 userLogin'>
        <Col xs={8} md={6} lg={5}>
            <Card>
                <Card.Header>
                    <h3 className='text-center'>로그인</h3>
                </Card.Header>
                <Card.Body>
                    <form onSubmit={onSubmit}>
                        <InputGroup className='mb-2'>
                            <InputGroup.Text className="title justify-content-center">아이디</InputGroup.Text>
                            <Form.Control name="email" value={email} onChange={onChangeForm} placeholder='이메일을 입력하세요!'/>
                        </InputGroup>
                        <InputGroup className='mb-3'>
                            <InputGroup.Text className="title justify-content-center">비밀번호</InputGroup.Text>
                            <Form.Control onChange={(e)=>onChangeForm(e)} name="pass" value={pass} type="password" placeholder='비밀번호를 입력하세요!'/>
                        </InputGroup>
                        <Button className='w-100 btn btn-dark' type="submit">로그인</Button>
                        <div className='text-end my-2'><a href="/user/join">회원가입</a></div>
                    </form>
                </Card.Body>
            </Card>
        </Col>
    </Row>
  )
}

export default LoginPage