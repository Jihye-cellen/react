import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { BounceLoader } from 'react-spinners';
import { Card, Row, Col, Button } from 'react-bootstrap';
import {BoxContext} from '../../context/BoxContext'

const CGVPage = () => {
  const {setBox}=useContext(BoxContext);
  const [loading, setLoading] =useState(false);
  const [list, setList]=useState([]);

  const callAPI = async()=>{
    setLoading(true);
    const res = await axios.get('/crawl/cgv');
    //console.log(res.data);
    setList(res.data);
    setLoading(false);
  }

  const onClickDownload=async(url)=>{
    await axios.post(`/crawl/cgv/download?image=${url}`);
    setBox({show:true, message:`이미지다운로드완료.`});
  }

  useEffect(()=>{
    callAPI();
  },[]);


  if(loading) return <div className='my-5 text-center'><BounceLoader color="#36d7b7"/></div>
  return (
    <div>
      <Row>
        {list.map((cgv, index)=>
          <Col key={cgv.image} xs={8} md={6} lg={4} className='mb-3'>
            <Card>
              <Card.Body>
                <img src={cgv.image} width="100%"/>
                <Button size="sm" onClick={()=>onClickDownload(cgv.image)} className='mt-3'>이미지다운로드</Button>
              </Card.Body>
              <Card.Footer>
                <span className='ellipsis' style={{fontSize:'0.8rem'}}>{index+1}. {cgv.title}</span>
              </Card.Footer>
            </Card>
          </Col>
        )}
      </Row>
    </div>
  )
}

export default CGVPage