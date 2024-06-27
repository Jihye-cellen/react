import React, { useEffect, useState } from 'react'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Button, InputGroup } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {Row, Col, Form, Badge} from 'react-bootstrap'

const Detail = ({form, setForm, callAPI, good}) => {
    const [attaches, setAtteches]=useState([]);
    const [files, setFiles] =useState([]);
    const contents = form.contents;
    
    const onClickSave = async()=>{
        if(good.contents === form.contents) return;
        if(!window.confirm("상세정보를 저장하시겠습니까?")) return;
        await axios.post('/goods/update/contents', {gid:form.gid, contents:form.contents});
        alert("상세정보 저장완료");
        callAPI();
    }
    
    const onChangeFiles = (e)=>{
        let selFiles=[];
        for(let i=0; i<e.target.files.length; i++){
            const file={
                name:URL.createObjectURL(e.target.files[i]),
                byte:e.target.files[i]
            }
            selFiles.push(file);
        }
        setFiles(selFiles);
    }

    const onClickAttach = async()=>{
      if(files.length === 0) return;
      if(!window.confirm(`${files.length}개 파일을 업로드하시겠습니까?`)) return;
      //첨부파일업로드
      const formData = new FormData();
      for(let i=0; i<files.length; i++){
        formData.append("bytes", files[i].byte);
      }
      await axios.post(`/goods/attach/${form.gid}`, formData);
      alert("첨부파일업로드 완료!");
      callAttach();
  }

  const callAttach =async()=>{
    const res = await axios.get(`/goods/attach/${form.gid}`);
    //console.log(res.data);
    setAtteches(res.data);
  }

  useEffect(()=>{
    callAttach();
  },[])


  const onCliCKDelete =async(att)=>{
    if(!window.confirm(`${att.aid}번 이미지를 삭제하시겠습니까?`)) return;
    //첨부파일삭제
    await axios.post('/goods/attach/delete', att);
    alert("파일삭제완료!");
    callAttach();
  }

  return (
    <Tabs
    defaultActiveKey="profile"
    id="fill-tab-example"
    className="mb-3"
    fill
  >
    <Tab eventKey="home" title="상세정보">
        <div className='text-end mb-3'>
            <Button variant='outline-warning' onClick={onClickSave}>정보저장</Button>
        </div>
      <CKEditor editor={ClassicEditor} data={form.contents} 
      onChange={(e, editor)=>setForm({...form, contents:editor.getData()})}/>
    </Tab>
    <Tab eventKey="profile" title="첨부파일">
    <InputGroup className='mt-2'>
      <Form.Control onChange={onChangeFiles} type="file" multiple={true}/>
      <Button onClick={onClickAttach}>첨부파일저장</Button>
    </InputGroup>
      <Row className="my-5">
        {files.map(file=>
            <Col key={file.name} xs={3}>
                <img src={file.name} width='100%'/>
            </Col>
        )}
      </Row>
    </Tab>
    <Tab eventKey="attach" title="첨부한파일">
      <Row>
        {attaches.map(att=>
          <Col key={att.aid} xs={4} className='mb-3'>
            <div style={{position:'relative'}}>
              <Badge onClick={()=>onCliCKDelete(att)} bg="danger" style={{position:'absolute', top:'5px', right:'5px', cursor:'pointer'}}>x</Badge>
              <img src={att.filename} width="100%" style={{border:'1px solid gray'}}/>
            </div>
            
          </Col>
        )}
      </Row>
    </Tab>
  </Tabs>
);
  
}

export default Detail