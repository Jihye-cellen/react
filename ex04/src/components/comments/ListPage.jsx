import { Row, Col, Button, Form, Stack, Card } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import moment from 'moment'
import {app} from '../../firebaseInit'
import { getFirestore, addDoc, collection, orderBy, where, onSnapshot, query, deleteDoc, doc, setDoc } from 'firebase/firestore'
import Pagination from 'react-js-pagination';
import '../Paging.css'


const ListPage = ({id}) => {
    const [page, setPage] =useState(1);
    const [size, setSize] =useState(5);
    const [total, setTotal] =useState(0);

    const db = getFirestore(app);
    const navi = useNavigate();
    const {pathname} = useLocation();
    const [content, setContent] = useState('');
    const [comments, setComments]=useState([100])
    
    const callAPI =()=>{
        const q = query(collection(db, 'comments'), where('id', '==', id), orderBy('date', 'desc'));
        onSnapshot(q, res=>{
        let rows =[];
        let count=0;
        res.forEach(row=>{
            count++;
            rows.push({no:count, 
                        cid:row.id, 
                        ...row.data(), 
                        isEllip:true, 
                        isEdit:false, 
                        text:row.data().content})
        });
       //console.log(rows)
        setTotal(count);
        const start = (page-1)*size +1;
        const end = (page * size);
        rows = rows. filter(row=>row.no>=start && row.no<=end);
         setComments(rows);
    })
}


useEffect (()=>{
    callAPI();
},[page])

    const onClickInsert =async()=>{
        if(sessionStorage.getItem('email')){
            if(content === ""){
            alert('댓글내용을 입력하세요!');
            return;
          }
          const email =sessionStorage.getItem('email');
          const date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
          const comment = {email, date, content, id};
          //console.log(comment);
          await addDoc(collection (db, `comments`), comment);
          alert("댓글 등록이 완료되었습니다.");
          setContent("");
          setPage(1);
        }else{
            //console.log(pathname);
            sessionStorage.setItem('target', pathname);
            alert("로그인이 필요한 작업입니다!")
            navi('/user/login');
        }
    }
    

    const onClickContent = (cid)=>{
        const rows=comments.map(c=>c.cid===cid ? {...c,isEllip:!c.isEllip} : c);
        setComments(rows);
        
    }

    const onClickDelete=async(cid)=>{
        if(!window.confirm(`${cid}번 댓글을 삭제하시겠습니까?`)) return;
        await deleteDoc(doc(db, `comments/${cid}`));

    }


    const onClickCancel = (cid, content, text) =>{
        if(content !== text){
            if(!window.confirm("수정을 취소하시겠습니까?")) return;
          }
          const rows=comments.map(c=>c.cid===cid ? {...c, isEdit:false, content:text} : c);
          setComments(rows);
    }


    const onClickUpdate = (cid) =>{
        const rows = comments.map (c=>c.cid == cid ? {...c, isEdit:true} : c);
        setComments(rows);
    }

    const onChangeContent =(e,cid)=>{
        const rows=comments.map(c=>c.cid===cid ? {...c, content:e.target.value}: c);
        setComments(rows);
    }

    const onClickSave =async(comment)=>{
        if(comment.content===comment.text) return;
    if(!window.confirm("댓글내용을 수정하시겠습니까?")) return;

    //저장하기
    console.log(comment);
    const rows=comments.map(c=>c.cid===comment.cid ? {...c, isEdit:false} : c);
    setComments(rows);
    const date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    await setDoc(doc(db, `comments/${comment.cid}`), {...comment, edit_date:date});
    }

  return (
    <Row className='justify-content-center my-5 comments'>
        <Col xs={12} md={10} lg={8}>
            {sessionStorage.getItem('email') &&
            <div>
                <Form.Control as="textarea" value={content} style={{width:"100%"}} className='me-5'
                onChange={(e)=>setContent(e.target.value)} rows={5} placeholder='댓글내용을 입력하세요!' />
            </div>
            }
            <div className='text-end my-2'>
                <Button onClick={onClickInsert} className='px-3 mb-5' variant='outline-dark' size='sm'>댓글등록</Button>
            </div>
            <div>
              
               
              <div className='text-center mb-5'>
                {["light"].map((variant) => (
                    <Card  bg={variant.toLowerCase()}
                            key={variant}
                            text={variant.toLowerCase() === 'light' ? 'dark' : 'white'}
                             border="dark" >
                        <Card.Body>Comments</Card.Body>
                    </Card>
            ))}
                </div>
                
            <div className='comments my-5'>
                {comments.map(c =>
                <>
               
                    <Row key={c.cid} className='mb-2'>
                        <Col className='text-muted'>
                            <span>{c.email}</span>
                            <span className='mx-2' style={{fontSize:'12px'}}>{c.date}</span>
                            {c.edit_date && <span style={{fontSize:'12px', color:'blue'}} >수정날짜: {c.edit_date}</span>}
                        </Col>
                        {(c.email===sessionStorage.getItem('email')) && !c.isEdit &&
                            <Col className='text-end'>
                                <Button onClick={()=>onClickUpdate(c.cid)} variant='outline-dark' size="sm">수정</Button>
                                <Button onClick={()=>onClickDelete(c.cid)} variant='outline-secondary' className='ms-2' size="sm">삭제</Button>
                            </Col>
                        }
                         {(c.email===sessionStorage.getItem('email')) && c.isEdit &&
                            <Col className='text-end'>
                                <Button variant='outline-dark' onClick={()=>onClickSave(c)} size="sm">저장</Button>
                                <Button variant='outline-secondary'  onClick={()=>onClickCancel(c.cid, c.content, c.text)}  className='ms-2' size="sm">취소</Button>
                            </Col>
                        }
                    </Row>
                    {c.isEdit ?
                        <div>
                            <Form.Control onChange={(e)=>onChangeContent(e, c.cid)}  value={c.content} as="textarea" rows={5}/>
                        </div>
                        :
                        <div  style={{ whiteSpace: "pre-wrap", cursor:'pointer' }} 
                        onClick={()=>onClickContent(c.cid)}
                        className={c.isEllip && 'ellipsis2'}>{c.content}</div>
                    }
                    <hr/>
                </>          
                )}    
            </div>
            </div>
        </Col>
        <Pagination
          activePage={page}
          itemsCountPerPage={size}
          totalItemsCount={total}
          pageRangeDisplayed={5}
          prevPageText={"‹"}
          nextPageText={"›"}
          onChange={ (e)=>setPage(e) }/>

    </Row>
  )

}
export default ListPage