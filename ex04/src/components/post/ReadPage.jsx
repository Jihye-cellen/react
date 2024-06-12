import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, Row, Col, Button } from 'react-bootstrap'
import { app } from '../../firebaseInit'
import { getFirestore, doc, getDoc, deleteDoc } from 'firebase/firestore'
import { ClipLoader } from 'react-spinners'
import ListPage from '../comments/ListPage'


const ReadPage = () => {
    const navi = useNavigate();
    const [post, setPost] = useState('');
    const db = getFirestore(app);
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const { email, title, body, date } = post;

    const callAPI = async () => {
        setLoading(true);
        const res = await getDoc(doc(db, 'posts', id));
        setPost(res.data());
        setLoading(false);
    }

    useEffect(() => {
        callAPI();
    }, [])

    const onClickDelete = async () => {
        if (!window.confirm(`${id}번 게시글을 삭제하시겠습니까?`)) return;
        //게시글 삭제
        setLoading(true);
        await deleteDoc(doc(db, `posts/${id}`));
        setLoading(false);
        navi('/post/list');
    }

    if (loading) return <h1 className='text-center my-5'><ClipLoader /></h1>
    return (
        <>
            <Row className='justify-content-center'>
                <h1 className='text-center my-5'>게시글정보</h1>
                <Col xs={10} md={8} lg={7}>

                    {email === sessionStorage.getItem("email") &&
                        <div className='text-end mb-2'>
                            <Button onClick={() => navi(`/post/update/${id}`)} variant='btn btn-outline-dark' size='sm' className='me-2'>수정</Button>
                            <Button onClick={onClickDelete} variant='btn btn-outline-secondary' size='sm' >삭제</Button>
                        </div>}

                    <Card>
                        <Card.Body>
                            <h5>{title}</h5>
                            <hr />
                            <div style={{ whiteSpace: "pre-wrap" }}> {body} </div>
                        </Card.Body>
                        <Card.Footer className='text-muted'>
                            Posted {date} by {email}
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>

            {/*******댓글목록*******/}
            <ListPage id={id} />

        </>
    )
}

export default ReadPage