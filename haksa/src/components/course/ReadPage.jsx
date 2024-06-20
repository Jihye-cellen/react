import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Table } from 'react-bootstrap';

const ReadPage = () => {
    const {lcode}=useParams();
    const [course, setCourse]=useState('');

    const {lname, room, instructor, pname, persons, capacity, hours, dept } = course;
    const callAPI=async()=>{
        const res=await axios.get(`/cou/read/${lcode}`);
        console.log(res.data);
        setCourse(res.data);
    }

    useEffect(()=>{
        callAPI();
    },[])
  return (
    <div>
        <h1>{lcode} 강좌정보</h1>
        <div className='text-end'>
            <Link to={`/cou/update/${lcode}`}>정보수정</Link>
        </div>
        <Table bordered hover className='mt-3'>
            <tbody className='table'>
                <tr>
                    <td className='thead'>강좌이름</td>
                    <td>{lname}</td>
                    <td className='thead'>수강시간</td>
                    <td>{hours}시간</td>
                    <td className='thead'>강의실</td>
                    <td>{room ? `${room}호` : '-'}</td>
                </tr>
                <tr>
                    <td className='thead'>수강인원</td>
                    <td>{persons}/{capacity}</td>
                    <td className='thead'>지도교수</td>
                    <td>{pname? `${pname}(${instructor})`: '교수미지정'}</td>
                    <td className='thead'>개설학과</td>
                    <td>{dept}</td>
                </tr>
            </tbody>
        </Table>
    </div>
  )
}

export default ReadPage