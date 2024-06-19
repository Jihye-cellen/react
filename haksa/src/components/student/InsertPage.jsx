import React, { useContext, useState } from 'react'
import {Row, Col, Form, Button, InputGroup} from 'react-bootstrap'
import { BoxContext } from '../../context/BoxContext'

const InsertPage = () => {
    const {setBox} =useContext(BoxContext)
    const [sname, setSname] = useState('')
    const onSubmit=()=>{
        if(sname==""){
            setBox({
                show:true,
                message:"학생이름을 입력하세요!"
            })
        }
    }

  return (
    <Row className='justify-content-center'>
        <h1 className='mb-5'>학생등록</h1>
        <Col sm={6}>
            <InputGroup className='mb-2'>
                <InputGroup.Text>학생학과</InputGroup.Text>
                <Form.Select>
                    <option>전산</option>
                    <option>전기</option>
                    <option>건축</option>
                </Form.Select>
            </InputGroup>
            <InputGroup  className='mb-3'>
            <InputGroup.Text>학생학과</InputGroup.Text>
            <Form.Control value={sname} onChange={(e)=>setSname(e.targe.value)}/>
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