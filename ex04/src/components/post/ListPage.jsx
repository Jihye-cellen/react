import React, { useEffect, useState } from 'react'
import { Button, Table } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import { app } from '../../firebaseInit'
import { getFirestore, collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { ClipLoader } from 'react-spinners'
import Pagination from 'react-js-pagination';
import '../Paging.css'

const ListPage = () => {
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(5);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const db = getFirestore(app);
  const email = sessionStorage.getItem('email');
  const navi = useNavigate();


  const callAPI = () => {
    setLoading(true);
    const q = query(collection(db, 'posts'), orderBy('date', 'desc'));
    let count = 0;
    onSnapshot(q, res => {
      let rows = [];
      res.forEach(row => {
        count++;
        rows.push({ no: count, id: row.id, ...row.data() });
      });
      setTotal(count);
      const start = (page - 1) * size + 1;
      const end = (page * size);
      const data = rows.filter(row => row.no >= start && row.no <= end);
      setPosts(data);
      setLoading(false);
    });
  }

  useEffect(() => {
    callAPI();
  }, [page])

  if (loading) return <h1 className='text-center my-5'><ClipLoader /></h1>
  return (
    <div className='my-5'>
      <h1 className='text-center'>게시판</h1>
      {email &&
        <div className='text-end mb-2'>
          <Button onClick={() => navi('/post/insert')}>글쓰기</Button>
        </div>
      }

      <Table>
        <thead>
          <tr>
            <td>No.</td>
            <td>제목</td>
            <td>작성자</td>
            <td>작성일</td>
          </tr>
        </thead>
        <tbody>
          {posts.map(post =>
            <tr>
              <td>{post.no}</td>
              <td><a href={`/post/read/${post.id}`}>{post.title}</a></td>
              <td>{post.email}</td>
              <td>{post.date}</td>
            </tr>
          )}
        </tbody>
      </Table>
      <Pagination
        activePage={page}
        itemsCountPerPage={size}
        totalItemsCount={total}
        pageRangeDisplayed={5}
        prevPageText={"‹"}
        nextPageText={"›"}
        onChange={(e) => setPage(e)} />
    </div>
  )
}

export default ListPage