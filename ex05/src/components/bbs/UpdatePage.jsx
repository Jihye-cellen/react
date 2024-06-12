import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {Row, Col, Button, Form} from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'

const UpdatePage = () => {
    const navi =useNavigate();
    const {bid}=useParams();
    const [form, setForm] =useState({
        bid,
        title:'',
        contents:''
    });

    const{title, contents} = form

    const callAPI=async()=>{
        const res =await axios.get(`/bbs/${bid}?isCnt=false`);
        setForm(res.data);
        console.log(res.data);
    }

    const onChangeForm = (e)=>{
        setForm({...form, [e.target.name]:e.target.value});
    }

    const onReset =()=>{
        if(!window.confirm("변경내용을 취소하시겠습니까?")) return;
        callAPI();
    }

    const onSubmit= async(e)=>{
        e.preventDefault();
        if(!window.confirm("변경된 내용을 수정하시겠습니까?")) return;
        await axios.post('/bbs/update', form);
        navi("/bbs/list");

    }
    useEffect(()=>{
        callAPI();
    },[])
  return (
    <div className='my-5'>
        <h1 className='text-center mb-5'>게시글 수정</h1>
        <Row className='justify-content-center'>
            <Col xs={12} md={10} lg={8}>
                <form onSubmit={onSubmit}>
                    <Form.Control name="title" placeholder='제목을 입력하세요' className='mb-2' value={title} onChange={onChangeForm}/>
                    <Form.Control as="textarea" name="contents" rows={10} placeholder='내용을 입력하세요!' value={contents} onChange={onChangeForm}/>
                    <div className='mt-3 text-center'>
                        <Button className='px-5 me-3' variant='danger' type="submit">수정</Button>
                        <Button className='px-5' variant='secondary' type="reset" onClick={onReset}>취소</Button>
                    </div>
                </form>
            </Col>
        </Row>
    </div>
  )
}

export default UpdatePage