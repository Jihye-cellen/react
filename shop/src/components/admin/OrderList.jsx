import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Tab, Table, Form, InputGroup, Button, Row, Col, FormSelect } from 'react-bootstrap';
import '../Paging.css'
import Pagination from 'react-js-pagination'
import ModalOrder from '../orders/ModalOrder';

const OrderList = () => {
    const [orders, setOrders] =useState([]);
    const [key, setKey] =useState('uid');
    const [word, setWord]=useState('');
    const [page, setPage]=useState(1);
    const [size, setSize]=useState(5);
    const [status, setStatus]=useState(0);
    const [count, setCount]=useState(0);

    const onChangeStatus = (e, pid)=>{
        const data = orders.map(order=> order.pid===pid ? {...order, status:e.target.value} : order);
        setOrders(data);
    }

    const callAPI= async()=>{
        const res = await axios.get(`/orders/admin/list?key=${key}&word=${word}&page=${page}&size=${size}`);
        setOrders(res.data.documents);
        setCount(res.data.count)
    }

    useEffect(()=>{
        callAPI();
    }, [page, key, word])

    const onUpdateStatus =async(pid, status)=>{
        if(!window.confirm(`${pid}번 주문의 ${status}로 상태를 변경하시겠습니까?`)) return;

        const res = await axios.post('/orders/status', {status, pid})
        
        if(res.data.result===1){
            alert("상태변경완료!");
            callAPI();
        }
    }

    const onChangeKey =(e)=>{
        setKey(e.target.value);
        if(e.target.value=='status'){
            setWord(0);
        }else{
            setWord('');
        }
    }

    const onSubmit = (e)=>{
        e.preventDefault();
        setPage(1);
        callAPI();
    }

    

  return (
    <div className='my-5'>
        <h1 className='text-center mb-4'>주문관리</h1>
        <Row className='mb-2'>
            <Col xs={8} md={6} lg={5}>
                <form onSubmit={onSubmit}>
                    <InputGroup>
                        <FormSelect className='me-2' value={key} onChange={onChangeKey}>
                            <option value="status">주문상태</option>
                            <option value="uid">아이디</option>
                            <option value="uname">주문자명</option>
                            <option value="phone">전화번호</option>
                            <option value="address1">배송지</option>
                        </FormSelect>
                        {key==='status'?
                         <Form.Select value={word} onChange={(e)=>setWord(e.target.value)}>
                            <option value="0">결제대기</option>
                            <option value="1">결제확인</option>
                            <option value="2">배송준비</option>
                            <option value="3">배송완료</option>
                            <option value="4">주문완료</option>
                        </Form.Select>
                        :
                        <Form.Control value={word} onChange={(e)=>setWord(e.target.value)} placeholder="검색어"/>
                        }
                        <Button variant='outline-dark' type="submit">검색</Button>
                    </InputGroup>
                </form>   
            </Col>
            <Col className='pt-2'><span>검색수 : {count}</span></Col>
        </Row>
        <Table>
            <thead>
                <tr className='table-dark text-center'>
                    <td>주문번호</td>
                    <td>주문일자</td>
                    <td>주문자</td>
                    <td>전화번호</td>
                    <td>배송지</td>
                    <td>주문금액</td>
                    <td>주문목록</td>
                    <td>주문상태</td>
                </tr>
            </thead>
            <tbody>
                {orders.map(order=>
                    <tr key={order.pid}>
                        <td>{order.pid}</td>
                        <td>{order.fmtdate}</td>
                        <td>{order.uname} ({order.uid})</td>
                        <td>{order.phone}</td>
                        <td>{order.address1}{order.address2}</td>
                        <td>{order.fmtsum}원</td>
                        <td><ModalOrder pid={order.pid} order={order}/></td>
                        <td>
                            <InputGroup>
                                <Form.Select value={order.status} onChange={(e)=>onChangeStatus(e, order.pid)}>
                                    <option value="0">결제대기</option>
                                    <option value="1">결제확인</option>
                                    <option value="2">배송준비</option>
                                    <option value="3">배송완료</option>
                                    <option value="4">주문완료</option>
                                </Form.Select>
                                <Button size="sm" variant='dark' onClick={()=>onUpdateStatus(order.pid, order.status)}>변경</Button>
                            </InputGroup>
                        </td>
                        
                    </tr>
                )}
            </tbody>
        </Table>
        {count > size &&
        <Pagination
             activePage={page}
             itemsCountPerPage={size}
             totalItemsCount={count}
             pageRangeDisplayed={5}
             prevPageText={"‹"}
             nextPageText={"›"}
             onChange={(e)=>setPage(e)}
        />
    }
    </div>
  )
}

export default OrderList