import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap';

const FinancePage = () => {
    const [list, setList]=useState([]);
    const callAPI = async ()=>{
        const res = await axios.get("/crawl/finance");
        console.log(res.data);
        setList(res.data);
    }

    const up ={
        color:'red'
    }

    const down={
        color:'blue'
    }

    useEffect(()=>{
        callAPI();
    },[])

  return (
    <div>
        <h1 className='mb-5'>Top 15 종목</h1>
        <Table>
            <tbody>
                {list.map((fin, index)=>
                    <tr key={index}>
                        <td>{index+1}. {fin.title}</td>
                        <td style={fin.range.substr(0,2)==='상승' ?  up : down }>{fin.price}</td>
                        <td style={fin.range.substr(0,2)==='상승' ?  up : down }>{fin.range.substr(0,2)}</td>
                        <td style={fin.range.substr(0,2)==='상승' ?  up : down }>{fin.range.substring(3)}</td>
                    </tr>
                )}
            </tbody>
        </Table>
    </div>
  )
}

export default FinancePage