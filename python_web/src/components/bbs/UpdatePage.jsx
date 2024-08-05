import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {Form, Button} from 'react-bootstrap'
import axios from 'axios';

const UpdatePage = () => {
    const {bid}=useParams();
    const [form, setForm]=useState("");
    const {title, contents}= form
    const navi =useNavigate();
    const callAPI = async () => {
        const res = await axios.get(`/bbs/${bid}`)
        console.log(res.data);
        setForm(res.data);
    }


    useEffect(()=>{
        callAPI();
    },[])

    const onChangeForm = (e)=>{
        setForm({...form, [e.target.name]:e.target.value})
    }

    const onSubmit =async(e)=>{
        e.preventDefault();
        if(!window.confirm(`${bid}번 게시글을 수정하시겠습니까?`)) return;
        const res = await axios.put('/bbs/', form);
        if(res.data === 'success'){
            alert("수정이 완료되었습니다.")
            navi(`/bbs/${bid}`)
        }else{
            alert("수정실패!")
        }
    }


  return (
    <div className='my-5'>
        <h1 className='text-center'>[{bid}] 게시글 수정</h1>
        <form onSubmit={onSubmit}>
            <Form.Control className='mb-2' placeholder="제목을 입력하세요." name="title" value={title} onChange={onChangeForm}/>
            <Form.Control className='mb-2' as="textarea" placeholder="내용을 입력하세요." rows={10} name="contents" value={contents} onChange={onChangeForm}/>
        </form>
        <div className='text-center'>
            <Button className="me-3 px-5" variant="warning">저장</Button>
            <Button className="px-5" variant="secondary">취소</Button>
        </div>
    </div>
  )
}

export default UpdatePage