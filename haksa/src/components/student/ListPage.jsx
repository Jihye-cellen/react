import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Button, Table } from 'react-bootstrap';
import '../../common/Page.css'
import Pagination from 'react-js-pagination';
import { BoxContext } from '../../context/BoxContext';
import {Row, Col} from 'react-bootstrap'
import { Link } from 'react-router-dom';

const ListPage = () => {
  const {box, setBox}=useContext(BoxContext);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(5);
  const [list, setList] = useState([]);
  const [count, setCount] = useState(0);
  const callAPI=async()=>{
    const url = `/stu?page=${page}&size=${size}&key=dept&word=`;
    const res = await axios.get(url);
    console.log(res.data);
    setList(res.data.list);
    setCount(res.data.total);
  }

  const onClickDelete = (scode)=>{
    setBox({
      show:true,
      message:`${scode}번 학생을 삭제하시겠습니까?`,
      action: ()=>onDelete(scode)
    })
  }

  const onDelete = async(scode)=>{
    await axios.post(`/stu/delete/${scode}`)
          .then(()=>{
            setPage(1);
            callAPI();
          })
          .catch(err=>{
            alert('에러발생');
            console.log(err)
          }); //exception 처리
  }

  useEffect(()=>{
    callAPI();
  },[page]);

  return (
    <div>
        <h1 className='text-center mb-5'>학생목록</h1>
        <Row>
          <Col>
           검색수 :{count}명
          </Col>
          <Col>
            <Link to ='/stu/insert'>학생등록</Link>
          </Col>
        </Row>
        <hr/>
        <Table>
          <thead>
          <tr>
              <td>학생코드</td>
              <td>이름</td>
              <td>학년</td>
              <td>학과</td>
              <td>담당교수</td>
              <td>생년월일</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {list.map(stu =>
              <tr key={stu.scode}>
                <td><Link to={`/stu/read/${stu.scode}`}>{stu.scode}</Link></td>
                <td>{stu.sname}</td>
                <td>{stu.year}</td>
                <td>{stu.dept}</td>
                <td>{stu.pname && `${stu.pname}(${stu.advisor})`}</td>
                <td>{stu.birthday}</td>
                <td><Button onClick={()=>onClickDelete(stu.scode)} size="sm" variant='outline-danger'>삭제</Button></td>
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
            onChange={ (e)=>setPage(e) }/>
        }

    </div>
  )
}

export default ListPage