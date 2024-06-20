import React, { useContext, useState } from 'react'
import {Row, Col, Form, Button, InputGroup} from 'react-bootstrap'
import { BoxContext } from '../../context/BoxContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const InsertPage = () => {
    const {setBox} =useContext(BoxContext);
    const navi = useNavigate();
    const [sname, setSname] = useState('');
    const [dept, setDept] = useState('전산');

    const onSubmit=async()=>{
        if(sname==""){
            setBox({
                show:true,
                message:"학생이름을 입력하세요!"
            });
            return;
        }
        await axios.post(`/stu/insert`, {dept, sname});
        setBox({
            show:true,
            message: `${sname} 학생이 등록되었습니다! 학생목록으로 이동하시겠습니까?`,
            action: ()=>  navi('/stu')
        });
      
    }

  return (
    <Row className='justify-content-center'>
        <h1 className='mb-5'>학생등록</h1>
        <Col sm={6}>
            <InputGroup className='mb-2'>
                <InputGroup.Text>학생학과</InputGroup.Text>
                <Form.Select value={dept} onChange={(e)=>setDept(e.target.value)}>
                    <option value='전산'>컴퓨터공학과</option>
                    <option value='전자'>전자공학과</option>
                    <option value='건축'>건축학과</option>
                </Form.Select>
            </InputGroup>
            <InputGroup  className='mb-3'>
            <InputGroup.Text>학생학과</InputGroup.Text>
            <Form.Control value={sname} onChange={(e)=>setSname(e.target.value)}/>
            </InputGroup>
            <div className='text-center'>
                <Button variant='outline-primary' onClick={onSubmit} className='me-2'>학생등록</Button>
                <Button variant='outline-secondary'>학생등록</Button>
            </div>
        </Col>
    </Row>
  )
}

export default InsertPage