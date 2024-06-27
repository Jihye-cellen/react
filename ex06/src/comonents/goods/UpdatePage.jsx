import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import {Row, Col, InputGroup, Form, Button, Card} from 'react-bootstrap'
import Detail from './Detail';
import { IoMdReturnLeft } from 'react-icons/io';

const UpdatePage = () => {
    const [loading, setLoading] =useState(false);
    const refFile = useRef(null);
    const [file, setFile] =useState({
        name:'',
        byte:null
    });

    const {gid} = useParams();
    const [good, setGood] = useState('');
    const [form, setForm]=useState({
        title:'',
        price:0,
        image:'',
        maker:'',
        brand:''
    });

    const {title, price, image, maker, brand} =form;
    const callAPI = async()=>{
        setLoading(true);
        const res = await axios.get(`/goods/read/${gid}`);
        const data = {...res.data, 
                        price:res.data.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        contents:res.data.contents || ''
                    }
        setForm(data);
        setGood(data);
        setFile({name:res.data.image, byte:null});
        setLoading(false);
    }

    const onChangeForm = (e) => {
        if(e.target.name==='price'){
          let price=e.target.value.replace(/[^0-9]/g,''); //숫자만입력
          price=price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); //세자리 컴마
          setForm({...form, price});
        }else{
          setForm({...form, [e.target.name]:e.target.value});
        }
      }

    const onChangeFile = (e)=>{
        setFile({
            name: URL.createObjectURL(e.target.files[0]),
            byte: e.target.files[0]
        })
    }

  
    const onClickReset = ()=>{
        if(JSON.stringify(form)===JSON.stringify(good)) return;
        if(!window.confirm('변경된 정보를 취소하시겠습니까?')) return;
        callAPI();
    }

    const onClickUpdate= async()=>{
        if(JSON.stringify(form)===JSON.stringify(good)) return;
        if(!window.confirm('수정한 정보를 저장하시겠습니까?')) return;
        await axios.post('/goods/update', form);
        callAPI();
    }

    const onClickImageSave = async()=>{
        if(file.byte===null) return;
        if(!window.confirm(`변경된 이미지를 저장하시겠습니까?`)) return;
        //이미지업로드
        const formData =new FormData();
        formData.append("byte", file.byte);
        await axios.post(`/goods/update/image/${gid}`, formData);
        alert("이미지변경완료!");
    }
    
    useEffect(()=>{
        callAPI();
    },[]);

   

    if(loading) return <h1 className='text-center'>로딩중</h1>
  return (
    <div>
        <h1 className='text-center my-5'>상품정보수정</h1>
        <Card>
            <Card.Body>
                 <Row className='justify-content-center'>
                 <Col md={3}>
                    <img src={file.name || "http://via.placeholder.com/150x170"} width="100%" 
                    style={{cursor:"pointer"}} onClick={()=>refFile.current.click()}/>
                    <input type="file" onChange={onChangeFile} style={{display:"none"}} ref={refFile}/>
                    <Button className='mt-2 w-100' size="sm" variant='dark' onClick={onClickImageSave}>이미지저장</Button>
                 </Col>
                 <Col>
                    <InputGroup className='mb-2'>
                        <InputGroup.Text>상품코드</InputGroup.Text>
                        <Form.Control value={gid} readOnly/>
                    </InputGroup>
                    <InputGroup className='mb-2'>
                        <InputGroup.Text>상품이름</InputGroup.Text>
                        <Form.Control value={title} name="title" onChange={onChangeForm}/>
                    </InputGroup>
                    <InputGroup className='mb-2'>
                        <InputGroup.Text>상품가격</InputGroup.Text>
                        <Form.Control value={price} name="price" onChange={onChangeForm}/>
                    </InputGroup>
                    <InputGroup className='mb-2'>
                        <InputGroup.Text>제조사명</InputGroup.Text>
                        <Form.Control value={maker} name="maker" onChange={onChangeForm}/>
                    </InputGroup>
                    <InputGroup className='mb-2'>
                        <InputGroup.Text>브랜드명</InputGroup.Text>
                        <Form.Control value={brand} name="brand" onChange={onChangeForm}/>
                    </InputGroup> 
                    <div className='text-center mt-3'>
                        <Button className='me-3 px-5' variant='warning' onClick={onClickUpdate}>정보수정</Button>
                        <Button className='px-5' variant='secondary' onClick={onClickReset}>정보취소</Button>
                    </div>                              
                 </Col>
                 </Row>
            </Card.Body>     
        </Card>
        <div className='my-5'>
            <Detail form={form} setForm={setForm} callAPI={callAPI} good={good}/>
        </div>
    </div>
  )
}

export default UpdatePage