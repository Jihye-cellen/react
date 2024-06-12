import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {Row, Col, Card, Button} from 'react-bootstrap'

const ReadPage = () => {
    const [form, setForm]=useState("");
    const {bid} =useParams();
    console.log(bid);

    const callAPI=async()=>{
        const res = await axios.get(`/bbs/${bid}?isCnt=true`);
        console.log(res.data);
        setForm(res.data);
    }

    const onDelete =async ()=>{
        if(!window.confirm(`${form.bid}번 게시글을 삭제하시겠습니까?`)) return;
        await axios.post(`/bbs/delete/${form.bid}`);
        alert("게시글삭제완료!");
        window.location.href="/bbs/list";
    }

    useEffect(()=>{
        callAPI();
    },[])

  return (
    <div className='my-5'>
        <h1 className='text-center'>게시글정보({form.bid})</h1>
        <Row className='justify-content-center mt-5'>
            <Col xs={12} md={10} lg={8}>
                <Card>
                    <Card.Header>
                        <Row>
                        <Col>
                         <h5>{form.title}</h5>
                        </Col>
                        <Col className='text-end'>
                         조회수: {form.viewcnt}
                        </Col>
                        </Row>
                    </Card.Header>
                    <Card.Body style={{whiteSpace:'pre-wrap'}}>
                        {form.contents}
                    </Card.Body>
                    <Card.Footer className="text-end text-muted">
                        Created by {form.uid}({form.uname}) on {form.regDate}
                    </Card.Footer>
                </Card>
                {sessionStorage.getItem('uid')===form.uid &&
                    <div className='text-center my-3'>
                        <Link to={`/bbs/update/${form.bid}`} ><Button className='px-5 me-3' variant='outline-dark'>수정</Button></Link>
                        <Button className='px-5' variant='secondary'onClick={onDelete}>삭제</Button>
                    </div>
                }
            </Col>
        </Row>
    </div>
  )
}

export default ReadPage