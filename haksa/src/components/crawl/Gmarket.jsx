import React, { useContext, useState } from 'react'
import {Row, Col, InputGroup, Form , Button, Table} from 'react-bootstrap'
import {BoxContext} from '../../context/BoxContext'
import { BounceLoader } from 'react-spinners';
import axios from 'axios';


const Gmarket = () => {
  const [list, setList]=useState([]);
  const [loading, setLoading] = useState(false);
  const {setBox} =useContext(BoxContext);
  const [query, setQuery]=useState('');
  const onSubmit=async(e)=>{
    e.preventDefault();
    if(query===''){
      setBox({show:true, message:'검색어를 입력하세요!'});
      return;
    }
    setLoading(true);
    const res= await axios.get(`/crawl/gmarket?query=${query}`);
    console.log(res.data);
    setList(res.data);
    setLoading(false);
    
  }

  if(loading) return <div className='my-5 text-center'><BounceLoader color="#36d7b7"/></div>
  return (
    <div>
      <h1>Gmarket 상품검색</h1>
      <Row className='justify-content-center'>
        <Col xs={6} md={4} lg={3} className='mb-2'>
          <form onSubmit={onSubmit}>
            <InputGroup className='mt-3'>
              <Form.Control placeholder='검색어' value={query} onChange={(e)=>setQuery(e.target.value)}/>
              <Button type="submit">검색</Button>
            </InputGroup>
          </form>
        </Col>
        <hr/>
        <Table striped bordered hover>
          <thead>
            <tr className='table-dark'>
              <td>상품코드</td>
              <td colSpan={2}>상품</td>
              <td>가격</td>
            </tr>
          </thead>
          {list.map((pro, index)=>
            <tr key={pro.code}>
               <td>{pro.code ?  `${pro.code}` : ''}</td>
              <td><img src={pro.image} width="100px"/></td>
              <td>{index+1}. {pro.title}</td>
              <td>{pro.price ? `${pro.price}원` : ''}</td>
            </tr>
          )}
        </Table>
      </Row>
    </div>
  )
}

export default Gmarket