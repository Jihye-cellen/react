import { setSelectionRange } from '@testing-library/user-event/dist/utils';
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {Row, Col, Form, Button} from 'react-bootstrap'
import '../pagination.css';
import  Pagination from 'react-js-pagination'
import { useLocation } from 'react-router-dom';
import Stars from '../common/Stars';

const ReplyPage = ({bid}) => {
    const [list, setList] =useState([]);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(5);
    const [count, setCount] =useState(0);
    const {pathname} = useLocation();
    const [contents, setContents] =useState("");
    const uid=sessionStorage.getItem("uid");
    const [rating, setRating] = useState(0);
    

    const callAPI=async()=>{
        const res = await axios.get(`/reply/list.json?bid=${bid}&page=${page}&size=${size}`);
        console.log(res.data);
        const data=res.data.documents.map(doc=>doc && {...doc, isEllip:true, isEdit:false, text:doc.contents, num:doc.rating});
        setList(data);
        setCount(res.data.total);
    }

    useEffect(()=>{
        callAPI();
    },[page])

    const onClickInsert = ()=>{
        alert("로그인이 필요한 작업입니다!");
        sessionStorage.setItem("target", pathname);
        window.location.href='/users/login';
    }

    const onClickInsertReply = async()=>{
        if(contents===""){
            alert("댓글 내용을 입력하세요!");
            return;
        }
        await axios.post('/reply/insert', {bid, contents, uid, rating})
        setContents('');
        setRating(0);
        callAPI();
    }

    const onClickContents = (rid)=>{
        const data = list.map(reply=>reply.rid===rid ? {...reply, isEllip:!reply.isEllip} : reply);
        setList(data);
    }

    const onClickDelete =async(rid)=>{
        if(!window.confirm(`${rid}번 댓글을 삭제하시겠습니까?`)) return;
        await axios.post(`/reply/delete/${rid}`);
        callAPI();
    }

    const onClickUpdate = (rid) =>{
        const data =list.map(reply=>reply.rid==rid ? {...reply, isEdit:true} : reply);
        setList(data);
    }

    const onChangeContents =(e,rid)=>{
        const data = list.map(r=>r.rid===rid ? {...r, contents:e.target.value}: r);
        setList(data);
    }

    const onClickSave =async(reply)=>{
        if(reply.contents!==reply.text || reply.num !== reply.rating){
            if(!window.confirm("댓글을 수정하시겠습니까?")) return;
            await axios.post('/reply/update', {rid:reply.rid, contents:reply.contents, rating:reply.rating});
        }
        callAPI();
    }

    const onClickCancel =(reply)=>{
        if(reply.contents !== reply.text){
            if(!window.confirm(`${reply.rid}번 댓글의 수정을 취소하시겠습니까?`)) return;
        }
        callAPI();
    }


    const getRating=(rating)=>{
        console.log("....", rating);
        setRating(rating);
    } //댓글에 저장 시, 데이터에 저장할 수 있게끔 자식에서 데이터를 가져올 때의 기능

    const getUserRating = (rating, rid) =>{
        console.log(rating, '...........', rid);
        const data = list.map(reply=>reply.rid === rid ? {...reply, rating:rating} : reply);
        setList(data);
    } //유저별 댓글 수정 시 


  return (
    <div className='my-5'>
        <Row className='justify-content-center'>
            <Col xs={12} md={10} lg={8}>
            {sessionStorage.getItem("uid") ?
                <div className='mb-5'>
                    <div>
                        <Stars size={'30px'} number={rating} disabled={false} getRating={getRating}/>
                    </div>
                    <Form.Control as="textarea" rows={5} value={contents} onChange={(e)=>setContents(e.target.value)}/>
                    <div className='text-end mt-3'>
                        <Button variant='dark' className='px-3' size="sm" onClick={onClickInsertReply}>등록</Button>
                    </div>
                </div>
                :
                <div className='text-end mb-5'>
                    <Button variant='dark' className="px-3" size="sm" onClick={onClickInsert}>댓글등록</Button>
                </div>
             }
             <div className='mb-2'><span>댓글수: {count}</span></div>
                {list.map(reply=>
                <div key={reply.rid}>
                    <Row>
                        <Col className='mb-2' xs={6}>
                            <span style={{color:'black', fontSize:"16px"}} className='me-2'>{reply.rid}| {reply.uname}({reply.uid}) |</span>
                            <Stars getRating={(e)=>getUserRating(e, reply.rid)} 
                                size={'15px'} number={reply.rating} disabled={(reply.uid!==uid || !reply.isEdit) && true}/>
                            <div>
                                <span style={{color:'blue', fontSize:"12px"}}>{reply.fmtdate} </span>
                                {reply.fmtUpdate && <span style={{color:'red', fontSize:"12px"}}>({reply.fmtUpdate})</span>}
                            </div>
                        </Col>
                        {uid===reply.uid && !reply.isEdit &&
                            <Col className='text-end mb-2'>
                                <Button variant='outline-dark' size="sm" className='me-2'onClick={()=>onClickUpdate(reply.rid)}>수정</Button>
                                <Button variant='outline-secondary' size="sm" onClick={()=>onClickDelete(reply.rid)}>삭제</Button>
                            </Col>
                        }
                        {uid===reply.uid && reply.isEdit &&
                            <Col className='text-end mb-2'>
                                <Button variant='outline-dark' size="sm" className='me-2' onClick={()=>onClickSave(reply)}>저장</Button>
                                <Button variant='outline-secondary' size="sm" onClick={()=>onClickCancel(reply)}>취소</Button>
                            </Col>
                        }
                    </Row>
                    {reply.isEdit ?
                        <div>
                            <Form.Control as="textarea" rows={5} value={reply.contents} onChange={(e)=>onChangeContents(e,reply.rid)}/>
                        </div>
                        :
                        <div className={reply.isEllip ? 'ellipsis' : '' } onClick={()=>onClickContents(reply.rid)}
                            style={{whiteSpace:"pre-wrap", cursor:"pointer"}}>
                            {reply.contents}
                        </div>
                    }
                    <hr/>
                </div>    
                )}
            </Col>
        </Row>
        {count>size &&
          <Pagination
          activePage={page}
          itemsCountPerPage={size}
          totalItemsCount={count}
          pageRangeDisplayed={5}
          prevPageText={"‹"}
          nextPageText={"›"}
          onChange={ (e)=>setPage(e) }/>
        }
    </div>
  )
}

export default ReplyPage