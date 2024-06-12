import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Row, Col, Table, Alert, Button } from 'react-bootstrap';
import { CountContext } from '../CountContext';
import { EmojiSmileUpsideDown } from 'react-bootstrap-icons';
import OrderPage from './OrderPage';


const CartPage = () => {
  const [isOrder, setIsOrder] =useState(false);
  const uid = sessionStorage.getItem("uid");
  const [books, setBooks] = useState([]);
  const [total, setTotal] =useState(0);
  const {count, setCount} =useContext(CountContext);
  const [chk, setChk]=useState(0);

  useEffect(()=>{
    let checkedCount =0 ;
    books.forEach(book=>book.checked && checkedCount++);
    setChk(checkedCount);
    console.log("......", checkedCount)
  },[books])


  const callAPI=async()=>{
    const res = await axios.get(`/cart/list?uid=${uid}`);
    const data = res.data.map(book=>book && {...book, sum:book.qnt*book.price, checked:false});
    setBooks(data);
    setCount(res.data.length);

    let totalSum = 0;
    data.forEach(book=>{
      totalSum+=book.sum;
    });
    setTotal(totalSum);
  }

  useEffect(()=>{
    callAPI();
  },[]);


  const onChangeQnt =(bid,e)=>{
    const qnt = e.target.value.replace(/[^0-9]/g,'');
    const data = books.map(book =>  book.bid ==bid ? {...book, qnt:qnt}:book);
    setBooks(data);
    }

  
  const onUpdateQnt = async(bid, qnt) =>{
    if(!window.confirm(`${bid}번 도서의 수량을 ${qnt}개로 변경하시겠습니까?`)) return;
    //수량수정
    const res = await axios.post('/cart/update', {uid:sessionStorage.getItem("uid"), bid, qnt});
    if(res.data.result===1){
      callAPI();
    }
  }

  const onClickDelete =async (bid)=>{
    if(!window.confirm("선택하신 항목을 삭제하시겠습니까?")) return;
    const res = await axios.post('/cart/delete', {uid:sessionStorage.getItem('uid'), bid});
    if(res.data.result===1){
      callAPI();
    }
  }

  const onChangeAll = (e) =>{
    const data = books.map(book=>book && {...book, checked:e.target.checked});
    setBooks(data);
  }

  const onChangeSingle=(e, bid)=>{
    const data=books.map(book=>book.bid == bid ? {...book, checked:e.target.checked} : book);
    setBooks(data);
  }


const onCheckedDelete = ()=>{
  if(chk===0){
    alert("삭제할 도서들을 선택하세요!");
    return;
  }
  if(!window.confirm(`${chk}개 도서들을 삭제하시겠습니까?`)) return;
  //선택도서삭제
  let deleted=0;
  books.forEach (async book=>{
    if(book.checked){
      deleted++;
      const res = await axios.post("/cart/delete", {bid:book.bid, uid});
    }
  });
  if(chk===deleted) callAPI();
}

const onOrder =()=>{
  if(chk===0){
    alert("주문할 상품들을 선택하세요!");
  }else{
    //주문페이지 이동
    setIsOrder(true);
  }
}

  return (
    <Row className='justify-content-center'>
      <Col xs={12} md={12} lg={12}>
        {!isOrder ?
        <>
        <h1 className='text-center my-5'> 장바구니</h1>
        <Table bordered hover>
          <thead>
            <tr className='table-secondary text-center'>
              <td><input onChange={onChangeAll} type="checkbox" checked={chk===books.length}/></td>
              <td>ID.</td>
              <td>TITLE.</td>
              <td>저자</td>
              <td>출판사</td>
              <td>가격</td>
              <td>수량</td>
              <td>금액</td>
              <td><Button onClick={()=>onCheckedDelete()}>선택삭제</Button></td>
            </tr>
            </thead>
            <tbody>
              {books.map(book=>
                <tr key={book.bid}>
                  <td className='text-center'><input type="checkbox" onChange={(e)=>onChangeSingle(e, book.bid)} checked={book.checked}/></td>
                  <td className='text-center'>{book.bid}</td>
                  <td>
                  <img src={book.image} width="10%"/>
                  <span className='mx-3'>{book.title}</span>
                  </td>
                  <td>{book.author}</td>
                  <td>{book.publisher}</td>
                  <td>{book.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원</td>
                  <td className='text-center'><input  className='text-center' onChange={(e)=>onChangeQnt(book.bid, e)} value={book.qnt} style={{width:'30px'}}/>
                      <Button variant="outline-danger" size="sm" className='mx-2' onClick={()=>onUpdateQnt(book.bid, book.qnt)}>수정</Button>
                  </td>
                  <td>{book.sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원</td>
                 <td className='text-center'><Button variant='dark' size="sm" className='text-center' onClick={()=>onClickDelete(book.bid)}>삭제</Button></td>
                </tr>
              )}
            </tbody>
        </Table>
        <Alert variant='light' className='text-end'>총합계: {total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} 원 </Alert>
        <div className='text-center my-3'>
          <Button className='me-3 px-5' variant='danger' onClick={onOrder}>주문하기</Button>
          <a href='/'><Button variant='dark' className='px-5'>쇼핑계속하기</Button></a>
        </div>
        </>
        :
        <OrderPage books={books} setBooks={setBooks}/>
        }
      </Col>
    </Row>
  )
}

export default CartPage