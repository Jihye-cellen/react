import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import {Card, Form, InputGroup, Button, Row, Col, CardBody} from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { BoxContext } from '../../context/BoxContext';

const UpdatePage = () => {
    const navi = useNavigate();
    const {setBox}=useContext(BoxContext);
    const [loading, setLoading] = useState(false);
    const [list, setList]=useState([]);
    const {lcode} = useParams();
    const [form, setForm] =useState('');
    const [course, setCourse]=useState('');
    const {lname, room, instructor, pname, persons, capacity, hours, dept } = form;

    const callAPI=async()=>{
        setLoading(true);
        const res= await axios.get(`/cou/read/${lcode}`);
        console.log(res.data);
        setCourse(res.data);
        setForm(res.data);

        const res1 = await axios.get(`/pro?page=1&size=100&word=${res.data.dept}`);
        setList(res1.data.list);
        setLoading(false);
    }

    useEffect(()=>{
        callAPI();
    },[]);

    const onChangeForm =(e)=>{
        setForm({...form, [e.target.name]:e.target.value})
    }

    const onClickCancel = ()=>{
        if(JSON.stringify(course)===JSON.stringify(form)) return; //변경된 것이 없을 때
        setBox({
            show:true,
            message:'수정한 정보를 취소하시겠습니까?',
            action: ()=> setForm(course)
        })
    }

    const onClickUpdate = ()=>{
        if(JSON.stringify(course)===JSON.stringify(form)) return;
        setBox({
            show:true,
            message:'수정한 정보를 저장하시겠습니까?',
            action: async()=>{
                await axios.post('/cou/update', form);
                navi(`/cou/read/${lcode}`);
            }
        })
    }

  return (
    <Row className='justify-content-center my-5'>
        <h1>강좌정보수정</h1>
        <Col xs={12} md={10} lg={8}>
            <Card className='mt-3'>
                <CardBody>
                    <InputGroup className='mb-3'>
                        <InputGroup.Text>강좌번호</InputGroup.Text>
                        <Form.Control value={lcode} readOnly/>
                    </InputGroup>
                    <InputGroup className='mb-3'>
                        <InputGroup.Text>강좌이름</InputGroup.Text>
                        <Form.Control value={lname} name="lname" onChange={onChangeForm}/>
                    </InputGroup>
                    <InputGroup className='mb-3'>
                        <InputGroup.Text>수강시간</InputGroup.Text>
                        <Form.Control value={hours} name="hours" onChange={onChangeForm}/>
                    </InputGroup>
                    <InputGroup className='mb-3'>
                        <InputGroup.Text>강 의 실</InputGroup.Text>
                        <Form.Control value={room} name="room" onChange={onChangeForm}/>
                    </InputGroup>
                    <InputGroup className='mb-3'>
                        <InputGroup.Text>수용인원</InputGroup.Text>
                        <Form.Control value={capacity} name="capacity" onChange={onChangeForm} />
                    </InputGroup>
                    <InputGroup className='mb-3'>
                        <InputGroup.Text>개설학과</InputGroup.Text>
                        <Form.Control value={dept} name="dept" readOnly />
                    </InputGroup>
                    <InputGroup className='mb-3'>
                        <InputGroup.Text>지도교수</InputGroup.Text>
                        <Form.Select value={instructor} name="instructor" onChange={onChangeForm}>
                         {list.map(pro=>
                            <option key={pro.pcode} value={pro.pcode}>{pro.pname} : {pro.dept} </option>
                         )}   
                        </Form.Select>
                    </InputGroup>
                </CardBody>
            </Card>
            <div className='text-center mt-3'>
                    <Button variant='dark' className='me-2' onClick={onClickUpdate}>정보수정</Button>
                    <Button variant='secondary' onClick={onClickCancel}>수정취소</Button>
            </div>
        </Col>
    </Row>    
  )
}

export default UpdatePage