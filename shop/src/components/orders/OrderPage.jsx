import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Table,Alert, Card, Form, Button, InputGroup, CardBody } from 'react-bootstrap'
import ModalAddress from '../users/ModalAddress';
import { v4 } from 'uuid';

const OrderPage = ({books, setBooks}) => {
    const uuid=v4();
    const pid = uuid.substring(0, 13);
    const [total, setTotal] =useState(0);
    const [form, setForm]=useState({
        uid:'',
        uname:'',
        phone:'',
        address1:'',
        address2:''
    });

    const {uid, uname, phone, address1, address2} = form;

    const callAPI=async()=>{
        const res = await axios.get(`/users/read/${sessionStorage.getItem("uid")}`);
        setForm(res.data);
    }

    useEffect(()=>{
        callAPI();
    },[])

    useEffect(()=>{
       const data = books.filter(book=>book.checked);
       let totalSum=0;
       data.forEach(book=>{
        if(book.checked) totalSum+=book.price*book.qnt;
       });
       setTotal(totalSum);
       setBooks(data);
    },[]);

    const onChangeForm =(e)=>{
        setForm({...form, [e.target.name]:e.target.value})
    }

    const onClickOrder =async()=>{
        if(!window.confirm(`${books.length}권의 도서를 주문하시겠습니까?`)) return;
        //주문자정보
        const res = await axios.post('/orders/purchase', {...form, sum:total, pid, uid});
        if(res.data.result===1){
            let cnt = 0;
            books.forEach(async book=>{
              await axios.post('/orders/insert', {pid, bid:book.bid, price:book.price, qnt:book.qnt}); //주문상품입력
              await axios.post('/cart/delete', {uid, bid:book.bid});   //장바구니에 있는 상품 지우기
              cnt++;
              if(cnt===books.length){
                alert("주문이 완료되었습니다!");
                window.location.href="/";
              }
            });
        }
    }
    
  return (
    <div>
        <h1 className='text-center my-5'>주문하기</h1>
        <Table>
            <thead>
                <tr className='table-secondary'>
                    <td>ID.</td>
                    <td>TITLE</td>
                    <td>가격</td>
                    <td>수량</td>
                    <td>금액</td>

                </tr>
            </thead>
            <tbody>
                {books.map(book=>
                    <tr key={book.bid}>
                        <td>{book.bid}</td>
                        <td><img src={book.image} width="30px"/>
                            <span className='mx-2'> {book.title} </span>
                        </td>
                        <td>{book.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원</td>
                        <td>{book.qnt}권</td>
                        <td>{book.sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원</td>
                    </tr>
                )}
            </tbody>
        </Table>
       <Alert variant='danger' className='text-end'>주문할 금액 : {total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원</Alert>
       <Card className='mt-3 orderPage'>
        <Card.Header>
            <h3 className='text-center'>주문자정보</h3>
        </Card.Header>
        <CardBody>
        <InputGroup className='mb-2'>
                <InputGroup.Text className="title">주문번호</InputGroup.Text>
                <Form.Control value={pid} />
            </InputGroup>
            <InputGroup className='mb-2'>
                <InputGroup.Text className="title">주문자명</InputGroup.Text>
                <Form.Control name="uname" value={uname} onChange={onChangeForm}/>
            </InputGroup>
            <InputGroup className='mb-2'>
                <InputGroup.Text className="title">주문자전화</InputGroup.Text>
                <Form.Control name="phone" value={phone} onChange={onChangeForm}/>
            </InputGroup>
            <InputGroup className='mb-2'>
                <InputGroup.Text className="title">주문자주소</InputGroup.Text>
                <Form.Control name="address1" value={address1} onChange={onChangeForm}/>
               <ModalAddress form={form} setForm={setForm}/>
            </InputGroup>
            <InputGroup className='mb-2'>
                <InputGroup.Text className="title">상세주소</InputGroup.Text>
                <Form.Control name="address2" value={address2} onChange={onChangeForm} placeholder='상세주소'/>
            </InputGroup>
            <div className='text-center mt-3'>
                    <Button className='px-5' onClick={onClickOrder} variant='danger'>주문하기</Button>
                </div>
        </CardBody>
       </Card>
    </div>
  )
}

export default OrderPage