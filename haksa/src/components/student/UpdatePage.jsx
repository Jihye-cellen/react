import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import {Card, InputGroup, Button, Form, Row, Col} from 'react-bootstrap'
import { BounceLoader } from 'react-spinners';
import { BoxContext } from '../../context/BoxContext';

const UpdatePage = () => {
    const navi = useNavigate();
    const {setBox} =useContext(BoxContext);
    const [loading, setLoading] = useState(false);
    const [list, setList] =useState([]);
    const [student, setStudent]=useState('');
    const [form, setForm] = useState('');
    const {scode} = useParams();

    const callAPI = async ()=>{
        setLoading(true);
        const res = await axios.get(`/stu/${scode}`);
        console.log(res.data);
        setForm(res.data);
        setStudent(res.data);

        const res2 = await axios.get(`/pro?page=1&size=100&word=${res.data.dept}`);
        setList(res2.data.list);
        setLoading(false);
    }

    const onChangeForm = (e)=>{
        setForm({...form, [e.target.name]:e.target.value});
    }


    const {sname, birthday, advisor, pname, year, dept} = form;

    const onClickCancel = ()=>{
        if(JSON.stringify(student)===JSON.stringify(form)) return; //변경된 것이 없을 때
        setBox({
            show:true,
            message:'수정한 정보를 취소하시겠습니까?',
            action: ()=> setForm(student)
        })
    }

    const onClickUpdate = ()=>{
        if(JSON.stringify(student)===JSON.stringify(form)) return;
        setBox({
            show:true,
            message:'수정한 정보를 저장하시겠습니까?',
            action: async()=>{
                await axios.post('/stu/update', form);
                navi(`/stu/read/${scode}`);
            }
        })
    }


    useEffect(()=>{
        callAPI();
    },[]);

   if(loading) return <div className='my-5 text-center'><BounceLoader color="#36d7b7"/></div>
  return (
    <Row className='justify-content-center'>
        <Col xs={12} md={10} lg={8}>
            <h1 className='text-center my-5'>학생정보수정</h1>
            <Card>
                <Card.Body>
                    <InputGroup className='mb-2'>
                        <InputGroup.Text>학생학번</InputGroup.Text>
                        <Form.Control value={scode} readOnly/>
                    </InputGroup>
                    <InputGroup className='mb-2'>
                        <InputGroup.Text>학생이름</InputGroup.Text>
                        <Form.Control value={sname} name="sname" onChange={onChangeForm}/>
                    </InputGroup>
                    <InputGroup className='mb-2'>
                        <InputGroup.Text>학생학과</InputGroup.Text>
                        <Form.Select value={dept} readOnly>
                            <option value='전산'>컴퓨터공학과</option>
                            <option value='전자'>전자공학과</option>
                            <option value='건축'>건축학과</option>
                        </Form.Select>
                    </InputGroup>
                    <InputGroup className='mb-2'>
                        <InputGroup.Text>생년월일</InputGroup.Text>
                        <Form.Control value={birthday || '2005-01-01'} type="date" name="birthday" onChange={onChangeForm}/>
                    </InputGroup>
                    <InputGroup className='mb-2'>
                        <InputGroup.Text>학생학년</InputGroup.Text>
                        <Form.Control value={year} name="year" onChange={onChangeForm}/>
                    </InputGroup>
                    <InputGroup className='mb-2'>
                        <InputGroup.Text>지도교수</InputGroup.Text>
                        <Form.Select value={advisor} name="advisor" onChange={onChangeForm}>
                            {list.map(pro=>
                                <option value={pro.pcode} key={pro.pcode}>{pro.pname}({pro.pcode}:{pro.dept})</option>
                            )}
                        </Form.Select>
                    </InputGroup>
                    <div className='text-center mt-3'>
                        <Button variant='dark' className='me-3' onClick={onClickUpdate}>정보수정</Button>
                        <Button variant='secondary' onClick={onClickCancel}>수정취소</Button>
                    </div>
                </Card.Body>
            </Card>
        </Col>
    </Row>
  )
}

export default UpdatePage