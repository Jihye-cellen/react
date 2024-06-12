import React, { useRef } from 'react'
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';



const ModalPhoto = ({uid, photo, callAPI}) => {
    const refPhoto =useRef();
    const [image, setImage] =useState({
        name:'',
        file:null
    });

    const {name, file}=image;
    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
        setImage({
            name:photo,
            file:null //선택하지 않았을 때 선택하라고 나올 수 있게 null로 넣어줬다
        })   
    };
    
    const handleShow = () => {
        setShow(true);
        setImage({
            name:photo,
            file:null //선택하지 않았을 때 선택하라고 나올 수 있게 null로 넣어줬다
        })   
    };

    const onChangeFile =(e)=>{
        setImage({
            name:URL.createObjectURL(e.target.files[0]),
            file:e.target.files[0]
        });
        
    }

    const onClickSave =async()=>{
        if(!file){
            alert("변경할 사진을 선택하세요!");
            return;
        }else{
            if(!window.confirm(uid +"사진으로 변경하실래요?")) return;
            //사진저장업로드
            const data = new FormData();
            data.append("file", file);
            data.append("uid", uid);

            const res= await axios.post('/users/photo', data);
            if(res.data.result===1){
                handleClose();
                callAPI();
            }

        }
    }

  return (
    <>
       <img src={photo || "http://via.placeholder.com/200x200"} width="90%" onClick={handleShow}/>

      <Modal
        style={{top:'10%'}}
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>사진변경</Modal.Title>
        </Modal.Header>
        <Modal.Body className='text-center'>
          <img src ={name|| "http://via.placeholder.com/200x200"}  width="80%" 
          style={{borderRadius:'50%', cursor:'pointer' }} onClick={()=>refPhoto.current.click()}/>
          <input type="file" onChange={onChangeFile} ref={refPhoto} style={{display:'none'}}/>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            닫기
          </Button>
          <Button variant="outline-danger" onClick={onClickSave}>저장</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalPhoto