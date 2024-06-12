import React from 'react'
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {Map, MapMarker} from 'react-kakao-maps-sdk'

const ModalMap = ({local}) => {
    
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const {place_name, address_name, x, y, phone, road_address_name} = local;

    return (
        <>
          <Button variant="primary" onClick={handleShow} size="sm">
            지도보기
          </Button>
    
          <Modal
            size="lg"
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            style={{top:"25%"}}
          >
            <Modal.Header closeButton>
              <Modal.Title>{place_name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Map center={{lat:y, lng:x}} style={{width:'100%', height:'300px'}}>
                    <MapMarker position={{lat:y, lng:x}}>
                        <div>전화: {phone || '-'}</div>
                    </MapMarker>
                    <hr/>
                    <div>주소: {address_name}</div>
                    <div>지번주소:{road_address_name}</div>
                </Map>
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

export default ModalMap