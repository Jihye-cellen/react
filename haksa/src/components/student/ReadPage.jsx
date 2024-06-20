import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Tab, Table } from 'react-bootstrap'

const ReadPage = () => {
    const [students, setStudents] = useState('');
    const {scode} = useParams();
    const callAPI = async ()=>{
        const res = await axios.get(`/stu/${scode}`);
        console.log(res.data);
        setStudents(res.data);
    }

    const {sname, dept, birthday, advisor, pname, year} = students;

    useEffect(()=>{
        callAPI();
    },[]);

  return (
    <div>
        <h1 className='my-5'>{scode} 학생정보</h1>
        <div className='text-end mb-2'>
            <Link to={`/stu/update/${scode}`}>정보수정</Link>
        </div>
        <Table bordered hover>
            <tbody className='table'>
                <tr>
                    <td className='thead'>학번</td>
                    <td>{scode}</td>
                    <td className='thead'>성명</td>
                    <td>{sname}</td>
                    <td className='thead'>지도교수</td>
                    <td>{pname}({advisor})</td>
                </tr>
                <tr>
                    <td className='thead'>학년</td>
                    <td>{year}</td>
                    <td className='thead'>학과</td>
                    <td>{dept}</td>
                    <td className='thead'>생년월일</td>
                    <td>{birthday}</td>
                </tr>
            </tbody>
        </Table>
    </div>
  )
}

export default ReadPage