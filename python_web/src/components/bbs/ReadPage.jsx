import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Card, Row, Col, Button } from 'react-bootstrap'
import axios from 'axios';

const ReadPage = () => {
    const { bid } = useParams();
    const [list, setList] = useState("")

    const callAPI = async () => {
        const res = await axios.get(`/bbs/${bid}`)
        console.log(res.data);
        setList(res.data);
    }

    useEffect(() => {
        callAPI();
    }, [])


    const onDelete =async()=>{
        if(!window.confirm(`${bid}번 게시글을 삭제하시겠습니꺄?`)) return;
        
        const res =await axios.delete(`/bbs/${bid}`)
        if(res.data === 'success'){
            alert("삭제되었습니다.");
            window.location.href="/bbs" 
        }else{
            alert("삭제실패")
        }
    }

    return (
        <div className='my-5'>
            <h1 className='text-center mb-5'>[{bid}] 게시글 정보</h1>
            <div className='text-end'>
                <Link to={`/bbs/update/${bid}`}><Button className='me-2 px-3'>수정</Button></Link>
                <Button className='px-3' variant='danger' onClick={onDelete}>삭제</Button>
            </div>
            <Row className='justify-content-center'>
                <Col lg={8}>
                    <Card>
                        <Card.Header>
                            <h4>{list.title}</h4>
                        </Card.Header>
                        <Card.Body style={{whiteSpace:'pre-wrap'}}>
                            {list.contents}
                        </Card.Body>
                        <Card.Footer>
                            <Row>
                                <Col>{list.fmtdate}</Col>
                                <Col className='text-end'>{list.writer}</Col>
                            </Row>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default ReadPage