import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import {Col, Row, Card, InputGroup, Button, Form} from 'react-bootstrap'
import AddressModal from '../common/AddressModal';
import PassModal from './PassModal';
const ReadPage = () => {
    const [user, setUser] = useState('');
    const uid = sessionStorage.getItem("uid");
    const callAPI =async()=>{
        const res = await axios.get(`/users/${uid}`);
        console.log(res.data);
        setImage({...image, fileName:res.data.photo && `/display?file=${res.data.photo}`});
        setUser(res.data);
    }

    const {uname, address1, address2, photo, phone} = user;

    useEffect(()=>{
        callAPI();
    },[])

    const refFile = useRef();

    const photoStyle={
        borderRadius:'10px',
        cursor:"pointer",
        border:'1px solid gray'
    }
    
    const [image, setImage] = useState({
        fileName:'',
        file:null
    })

    const onChangeFile=(e)=>{
        setImage({
            fileName:URL.createObjectURL(e.target.files[0]),
            file:e.target.files[0]
        })
    }

    const {fileName, file} = image;

    const onChangeForm =(e)=>{
       setUser({...user, [e.target.name]: e.target.value});
    }

    const onInsert = async ()=>{
        if(!window.confirm("변경된 내용을 수정하시겠습니까?")) return;
        await axios.post('/users/update', user);
        alert("정보수정완료!");
    }

    const onUploadImage = async() =>{
        if(file){
            if(!window.confirm("변경된 이미지를 저장하시겠습니까?")) return;
            //이미지업로드
            const formData = new FormData();
            formData.append("file", file);
            const config = {
                Headers : {'content-type' : 'multipart/form-data'}
            }
            await axios.post(`/users/photo/${uid}`, formData, config);
            alert("이미지 변경되었습니다!");
            setImage({file:null, fileName:''});
            callAPI();            
        }
    }

  return (
    <Row className='justify-content-center my-5'>
        <Col xs={12} md={10} lg={8}>
            <Card>
                <Card.Header>
                    <h1 className='text-center'>사용자정보</h1>
                </Card.Header>
                <Card.Body>
                    <Row className='mb-3 read'>
                        <Col md={3} className='align-items-center text-center'>
                            <img src={fileName || 'http://via.placeholder.com/50x50'} width='100%' 
                                style={photoStyle} onClick={()=>refFile.current.click()}/>
                            <input ref={refFile} type="file" onChange={onChangeFile} style={{display:'none'}}/>
                            <Button className='w-100 mt-1' variant='outline-dark' size="sm" onClick={onUploadImage}>이미지저장</Button>
                        </Col>
                       
                        <Col>
                           <InputGroup className='mb-2'>
                            <InputGroup.Text className='title'>이름</InputGroup.Text>
                            <Form.Control value={uname} name="uname" onChange={onChangeForm}/>
                            <PassModal/>
                           </InputGroup>
                           <InputGroup className='mb-2'>
                            <InputGroup.Text className='title'>전화</InputGroup.Text>
                            <Form.Control value={phone} name="phone" onChange={onChangeForm}/>
                           </InputGroup>
                           <InputGroup className='mb-1'>
                            <InputGroup.Text className='title'>주소</InputGroup.Text>
                            <Form.Control value={address1} name="address1" onChange={onChangeForm}/>
                            <AddressModal form={user} setForm={setUser}/>
                           </InputGroup>
                           <InputGroup className='mb-2'>
                            <InputGroup.Text className='title'>상세주소</InputGroup.Text>
                            <Form.Control value={address2} name="address2" onChange={onChangeForm}/>
                           </InputGroup>
                           <InputGroup className='mb-2'>
                            <InputGroup.Text className='title'>가입일</InputGroup.Text>
                            <Form.Control value={user.regDate} disabled={true}/>
                           </InputGroup>
                           <div className='text-center'>
                            <Button onClick={onInsert} variant='dark' className='me-2'>정보수정</Button>
                            <Button variant='secondary'>취소</Button>
                           </div>
                        </Col>
                    </Row>
                </Card.Body>
                <Card.Footer>
                <div className='text-muted'>
                    최근정보수정일 : {user.regDate}  
                </div>
                </Card.Footer>
            </Card>
        </Col>
    </Row>
  )
}

export default ReadPage