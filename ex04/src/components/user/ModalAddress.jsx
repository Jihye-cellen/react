import React from 'react'
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import DaumPostcodeEmbed from 'react-daum-postcode'


const ModalAddress = (prop) => {
    const {form, setForm} = prop; //비구조할당
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const onComplete = (e) =>{
        console.log(e);
        const address = e.buildingName ? `${e.address}(${e.buildingName})` : e.address;
        setForm({
            ...form,
            address1:address
        })
        handleClose();
    }

     return (

    <>
      <Button variant="primary" size="sm" onClick={handleShow}>
        주소검색
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>주소검색</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DaumPostcodeEmbed onComplete={onComplete}/>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );

}

export default ModalAddress