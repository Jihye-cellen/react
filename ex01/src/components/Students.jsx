import React, { useState } from 'react'
import { Table } from 'react-bootstrap';

const Students = () => {
    const [students, setStudents] = useState ([
        {no:100, name:'홍길동', address:'인천 서구 경서동', phone:'010-1010-2020'},
        {no:101, name:'심청이', address:'인천 계양구 계산동', phone:'010-3030-4040'},
        {no:102, name:'이순신', address:'서울특별시 금천구 가산동', phone:'010-5050-6060'},
        {no:103, name:'강감찬', address:'서울특별시 강남구 압구정동', phone:'010-7070-8080'}
        
    ]);
  return (
    <div className='m-5'>
        <h1>학생목록</h1>
        <Table striped bordered hover>
            <thead>
                <tr>
                    <td>학생번호</td>
                    <td>학생이름</td>
                    <td>학생주소</td>
                    <td>학생전화번호</td>
                </tr>
            </thead>
            <tbody>
                {students.map(s =>
                    <tr>
                        <td>{s.no}</td>
                        <td>{s.name}</td>
                        <td>{s.address}</td>
                        <td>{s.phone}</td>
                    </tr>
                )}
            </tbody>
        </Table>
    </div>
  )
}

export default Students