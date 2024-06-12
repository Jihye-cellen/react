import React, { useEffect, useState } from 'react'
import {app} from '../../firebaseInit'
import { getDatabase, ref, onValue, remove } from 'firebase/database'
import { Button, Table } from 'react-bootstrap'
import ModalBook from '../book/ModalBook'

const CartPage = () => {
  const [loading, setLoading] =useState(false);
  const [books, setBooks] =useState([]);
  const uid = sessionStorage.getItem('uid');
  const db = getDatabase(app);

  const callAPI =()=>{
    setLoading(true);
    onValue(ref(db, `cart/${uid}`), snapshot=>{
      let rows=[];
      let count=0;
      snapshot.forEach(row=>{
        count++;
        rows.push({no:count, key:row.key, ...row.val()})
      });
      setBooks(rows);
      setLoading(false);
    });
  }


  useEffect(()=> {
    callAPI();
  }, [])


  const onClickDelete = (book) =>{
    if(window.confirm(`"${book.title}" 를/을 삭제하시겠습니까?`)){
      remove(ref(db, `cart/${uid}/${book.key}`));
    }
  }


  if(loading) return <h1 className='my-5'>로딩중...</h1>
  return (
    <div >
        <h1 className='text-center my-5'>장바구니</h1>
        <Table>
          <thead>
              <tr>
                <td>NO.</td>
                <td>제목</td>
                <td>저자</td>
                <td>가격</td>
                <td></td>
                <td></td>
              </tr>
              </thead>
              <tbody>
                {books.map(book=>
                  <tr key={book.key}>
                     <td>{book.no}</td>
                     <td><div className='ellipsis'>{book.title} </div></td> 
                     <td>{book.authors}</td> 
                     <td>{book.price}원</td> 
                     <td><Button onClick={()=>onClickDelete(book)} size="sm" variant="secondary">삭제</Button></td>
                     <td><ModalBook book={book} type="cart"/></td>
                  </tr>
                )}
            </tbody>
          
        </Table>
    </div>
  )
}

export default CartPage