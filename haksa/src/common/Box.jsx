import React from 'react'
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { GiConfirmed } from "react-icons/gi";
import { FiAlertCircle } from "react-icons/fi";


const Box = ({box, setBox}) => {

    const style ={
        color:'orange',
        fontSize:'2rem'
    }

    const style1 ={
      color:'red',
      fontSize:'2rem'
  }

      //확인버튼
  const onClose = () => {
    if(box.action2) {
      box.action2();
    }
    setBox({...box, show:false});
  }

    const onAction = ()=>{
      box.action();
      onClose();
    }

    return (
        <>
         <Modal
            style={{top:'10%'}}
            show={box.show}
            onHide={onClose}
            backdrop="static"
            keyboard={false} >

            <Modal.Header closeButton>
              <Modal.Title>
                {box.action ? 'Confirm' : 'Warning'}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            {box.action ? <GiConfirmed style={style}/> : <FiAlertCircle style={style1}/>} 
             {box.message}
            </Modal.Body>
            <Modal.Footer>
              {box.action ?
                <>
                 <Button variant="outline-secondary" className='px-3' onClick={onClose}>No</Button>
              <Button variant="outline-primary" className='px-3' onClick={onAction}>Yes</Button>
                </>
                :
                <Button variant="outline-primary" className='px-3' onClick={onClose}>Yes</Button>
              }
             
            </Modal.Footer>
          </Modal>
        </>
      );
}

export default Box