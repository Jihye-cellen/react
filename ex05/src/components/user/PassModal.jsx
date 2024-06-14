import React from 'react'
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { InputGroup, Form } from 'react-bootstrap';
import axios from 'axios';

const PassModal = () => {
    const [form, setForm]=useState({
      upass:'pass',
      npass:'1234',
      cpass:'1234'
    })
    const {upass, npass, cpass} = form;
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const onChangeForm = (e)=>{
      setForm({...form, [e.target.name]:e.target.value});
    }

    const onClickSave =async()=>{
      //현재비밀번호가 일치체크
     const res= await axios.get(`/users/${sessionStorage.getItem("uid")}`);
     if(res.data.upass!==upass){
      alert("현재비밀번호가 일치하지 않습니다!");
      return;
     }
      //새비밀번호와 비밀번호확인이 같은지 체크
      if(npass!==cpass){
        alert("새 비밀번호가 일치하지 않습니다!");
        return;
      }
      if(npass===upass){
        alert("이전 비밀번호입니다. 다시 변경해주세요!");
        return;
      }
      //비밀번호수정
      if(!window.confirm("비밀번호를 변경하시겠습니까?")) return;
      await axios.post('/users/update/pass', {uid:sessionStorage.getItem("uid"), upass:npass});
      alert("비밀번호변경완료! 재로그인 해주시기 바랍니다.")
      sessionStorage.clear();
      window.location.href="/users/login"
    }

  return (
    <>
      <Button variant="outline-danger" onClick={handleShow}>
       비밀번호변경
      </Button>

      <Modal
        style={{top:'20%'}}
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>비밀번호변경</Modal.Title>
        </Modal.Header>
        <Modal.Body>         
              <InputGroup className='mb-2'>
                <InputGroup.Text style={{width:'100px'}}>현재비밀번호</InputGroup.Text>
                <Form.Control type="password" name="upass" value={upass} onChange={onChangeForm}/>
              </InputGroup>
              <InputGroup className='mb-2'>
                <InputGroup.Text style={{width:'100px'}}>새 비밀번호</InputGroup.Text>
                <Form.Control  type="password" name="npass" value={npass} onChange={onChangeForm}/>
              </InputGroup>
              <InputGroup className='mb-2'>
                <InputGroup.Text style={{width:'100px'}}>비밀번호확인</InputGroup.Text>
                <Form.Control  type="password" name="cpass" value={cpass} onChange={onChangeForm}/>
              </InputGroup>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={onClickSave}>저장</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default PassModal