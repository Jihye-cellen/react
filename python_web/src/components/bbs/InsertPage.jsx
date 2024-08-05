import axios from 'axios';
import React, { useState } from 'react'
import {Form, Button} from 'react-bootstrap'

const InsertPage = () => {
    const [form, setForm]=useState({
        writer:'blue',
        contents:'',
        title:''
    })

    const {writer, contents, title}=form;

    const onChangeForm =(e)=>{
        setForm({...form, [e.target.name]:e.target.value})
    }

    const onSubmit = async(e)=>{
        e.preventDefault();
        if(title==""){
            alert("제목을 입력하세요!")
            return;
        }
        console.log(form);
        const result =await axios.post('/bbs/', form)
        if(result.data ==='success'){
            alert("글쓰기 등록이 성공했습니다.")
            window.location.href='/bbs/'
        }else{
            alert("글쓰기 등록이 실패했습니다.")
        }
    }

  return (
    <div className='my-5'>
        <h1 className='text-center mb-5'>글쓰기</h1>
        <form onSubmit={onSubmit} >
            <Form.Control className='mb-2' placeholder="제목을 입력하세요." name="title" value={title} onChange={onChangeForm}/>
            <Form.Control className='mb-2' as="textarea" placeholder="내용을 입력하세요." rows={10} name="contents" value={contents} onChange={onChangeForm}/>
        </form>
        <div className='text-center'>
            <Button className="me-3 px-5" variant="warning" type="submit">저장</Button>
            <Button className="px-5" variant="secondary">취소</Button>
        </div>
    </div>
  )
}

export default InsertPage