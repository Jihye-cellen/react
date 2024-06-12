import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Col, Row, Form } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import '../Paging.css';



const ReviewPage = ({ bid }) => {
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(3);
    const [count, setCount] = useState(0);
    const [contents, setContents] = useState('');
    const [review, setReview] = useState([]);
    const uid = sessionStorage.getItem('uid');
    const navi = useNavigate();
    const { pathname } = useLocation();


    const callAPI = async () => {
        const res = await axios.get(`/review/list/${bid}?page=${page}&size=${size}`);
        console.log(res.data);
        //리뷰가 하나도 없는 경우
        if (!res.data.documents) {
            setReview([]);
        } else {
            setCount(res.data.count);
            if (page > Math.ceil(res.data.count / size)) setPage(page - 1);
            const data = res.data.documents.map(doc => doc && { ...doc, ellip: true, isEdit: false, text: doc.contents });
            setReview(data);
            
        }
    }

    useEffect(() => {
        callAPI();
    }, [page]);


    const onClickRegister = () => {
        alert("로그인이 필요한 작업입니다.")
        sessionStorage.setItem('target', pathname);
        navi('/users/login');
    }


    const onClickInsert = async () => {
        if (contents === "") {
            alert("리뷰 내용을 적어주세요!")
        } else {
            const res = await axios.post('/review/insert', { uid, bid, contents });
            if (res.data.result === 1) {
                alert("리뷰등록완료!");
                setContents("");
                setPage(1);
                callAPI();


            } else {
                alert("리뷰등록취소!");
            }
        }
    }

    const onClickDelete = async (rid) => {
        if (!window.confirm(`${rid}번 댓글을 삭제하시겠습니까?`)) return;

        const res = await axios.post(`/review/delete/${rid}`)

        if (res.data.result === 1) {
            alert("삭제성공!");
            callAPI();
        } else {
            alert("삭제실패!");
        }
    }


    const onClickContents = (rid) => {
        const data = review.map(doc => doc.rid === rid ? { ...doc, ellip: !doc.ellip } : doc);
        setReview(data);
    }


    const onClickUpdate = (rid) => {
        const data = review.map(doc => doc.rid === rid ? { ...doc, isEdit: true } : doc);
        setReview(data);
    }


    const onChangeContents = (e, rid) => {
        const data = review.map(doc => doc.rid === rid ? { ...doc, contents: e.target.value } : doc);
        setReview(data)
    }


    const onClickCancel = (rid, contents, text) => {
        if(contents !== text) {
            if(!window.confirm("수정을 취소하시겠습니까?")) return;

        }
         const data = review.map(doc => doc.rid ===rid ? 
            {...doc, isEdit:false, contents:doc.text, ellip:true} :doc);
            setReview(data);
    }


    const onClickSave = async (rid, contents, text) => {
        if (contents === "") {
            alert("리뷰내용을 작성하세요!"); return;
        }
        
        if(contents === text){
            const data = review.map (doc=> doc.rid===rid ? {...doc, isEdit:false, ellip:true} : doc);
            setReview(data);
        }

        if (!window.confirm(`${rid}번 리뷰글을 수정하시겠습니까?`)) return;
        //리뷰수정
        const res = await axios.post('/review/update', { rid, contents });
        if (res.data.result === 1) {
            callAPI();
        }
    }


    return (
        <div className='my-5'>
            {!uid ?
                <div className='text-end mb-3'>

                    <Button className='px-5' onClick={onClickRegister}>리뷰등록</Button>
                </div>
                :
                <div>
                    <Form.Control value={contents} onChange={(e) => setContents(e.target.value)} as="textarea" rows={5} />
                    <div class="text-end mt-2">
                        <Button onClick={onClickInsert} className='mt-2 text-end' variant='outline-secondary'>등록</Button>
                    </div>
                </div>
            }
            <div>
                {review.map(r =>
                    <div key={r.rid}>
                        <Row>
                            <Col className='text-muted mb-3'>
                                <span className='me-3' style={{ color: 'black' }}>{r.rid}</span>
                                <img src={r.photo || "http://via.placeholder.com/30x30"} width="30px" style={{ borderRadius: '50%' }} />
                                <span className='mx-3'>{r.uname} ({r.uid})</span>
                                <span>{r.fmtDate}</span>
                            </Col>
                            {(uid === r.uid && !r.isEdit) &&
                                <Col className='text-end mt-4 mb-2'>
                                    <Button size="sm" variant='outline-danger' className='me-2' onClick={() => onClickUpdate(r.rid)}>수정</Button>
                                    <Button size="sm" variant='outline-secondary' onClick={() => onClickDelete(r.rid)}>삭제</Button>
                                </Col>
                            }
                            {(uid === r.uid && r.isEdit) &&
                                <Col className='text-end mt-4 mb-2'>
                                    <Button size="sm" variant='outline-danger' onClick={() => onClickSave(r.rid, r.contents, r.text)} className='me-2'>저장</Button>
                                    <Button size="sm" variant='outline-secondary' onClick={() => onClickCancel(r.rid, r.contents, r.text)}>취소</Button>
                                </Col>
                            }
                        </Row>
                        {r.isEdit ?
                            <div className='mb-2'> 
                                <Form.Control as="textarea" rows={10} value={r.contents} onChange={(e) => onChangeContents(e, r.rid)} />
                            </div>
                            :
                            <div className='mb-3' onClick={() => onClickContents(r.rid)}>
                                <div className={r.ellip && "ellipsis2"}
                                    style={{ whiteSpace: 'pre-wrap' , cursor:"pointer"}}>{r.contents}</div></div>
                        }

                        <hr />
                    </div>
                )}
            </div>
            {count > size &&
                <Pagination
                    activePage={page}
                    itemsCountPerPage={size}
                    totalItemsCount={count}
                    pageRangeDisplayed={5}
                    prevPageText={"‹"}
                    nextPageText={"›"}
                    onChange={(e) => setPage(e)}
                />

            }
        </div>
    )
}

export default ReviewPage