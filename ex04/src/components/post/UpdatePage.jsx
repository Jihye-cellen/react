import React, { useEffect, useState } from 'react'
import { Row, Col, Button, Form } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { app } from '../../firebaseInit'
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore'
import { ClipLoader } from 'react-spinners'


const UpdatePage = () => {
  const navi = useNavigate();
  const [loading, setLoading] = useState(false);
  const db = getFirestore(app);
  const { id } = useParams();
  const [form, setForm] = useState('');
  const { title, body } = form;

  const callAPI = async () => {
    setLoading(true);
    const res = await getDoc(doc(db, `posts/${id}`));
    setForm(res.data());
    setLoading(false);
  }


  useEffect(() => {
    callAPI();
  }, [])


  const onChangeForm = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!window.confirm(`${id}번 게시글을 수정하시겠습니까?`)) return;
    //게시글 수정
    setLoading(true);
    await setDoc(doc(db, `/posts/${id}`), form);
    setLoading(false);
    navi(`/post/read/${id}`);
  }



  if (loading) return <h1 className='text-center my-5'><ClipLoader /></h1>
  return (
    <Row className='justify-content-center my-5'>
      <Col xs={12} md={10} lg={8}>
        <h1 className='text-center mb-5'>게시글수정</h1>
        <form onSubmit={onSubmit}>
          <Form.Control onChange={onChangeForm} name="title" className='mb-2' value={title} />
          <Form.Control onChange={onChangeForm} name="body" as="textarea" value={body} rows={10} className='mb-3' />
          <div className='text-center'>
            <Button className='px-5' variant='btn btn-outline-dark' type='submit'>수정</Button>
            <Button onClick={() => callAPI()} className='px-5' variant='secondary ms-2'>취소</Button>
          </div>
        </form>
      </Col>
    </Row>
  )
}

export default UpdatePage