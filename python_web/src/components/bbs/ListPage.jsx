import React, { useEffect, useState } from 'react'
import '../Paging.css'
import axios from 'axios'
import {Table, Row, Col} from 'react-bootstrap'
import Pagination from 'react-js-pagination'
import { Link, useNavigate } from 'react-router-dom'

const ListPage = () => {
  const [page, setPage]=useState(1);
  const [size, setSize]=useState(10);
  const [list, setList]=useState([]);
  const [count, setCount]=useState(0);

  const callAPI =async()=>{
    const res=await axios.get(`/bbs/?page=${page}&size=${size}`)
    console.log(res.data)
    setList(res.data.list);
    setCount(res.data.total);

  }

  useEffect(()=>{
    callAPI();
  },[page])

  return (
    <div className='my-5'>
      <h1 className='text-center my-5'>게시판</h1>
      <Row className='mb-2'>
        <Col>검색수 : <span>{count}건</span></Col>
        <Col>
        <div className='text-end'>
          <Link to="/bbs/insert">글쓰기</Link>
          </div>
        </Col>
      </Row>
      <Table>
        <thead>
          <tr className='table-dark'>
            <td>NO.</td>
            <td>Title</td>
            <td>contents</td>
            <td>writer</td>
            <td>Date</td>
          </tr>
        </thead>
        <tbody>
          {list.map(b=>
            <tr key={b.bid}>
              <td>{b.bid}</td>
              <td><Link to={`/bbs/${b.bid}`}>{b.title}</Link></td>
              <td>{b.contents}</td>
              <td>{b.writer}</td>
              <td>{b.fmtdate}</td>
            </tr>
          )}
        </tbody>
      </Table>
      <Pagination
          activePage={page}
          itemsCountPerPage={size}
          totalItemsCount={count}
          pageRangeDisplayed={5}
          prevPageText={"‹"}
          nextPageText={"›"}
          onChange={ (e)=>setPage(e) }/>
    </div>
  )
}

export default ListPage