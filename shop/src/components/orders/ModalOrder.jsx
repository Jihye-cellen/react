import axios from 'axios';
import React, { useEffect } from 'react'
import { useState } from 'react';
import { Button, InputGroup, Table, Form, Alert } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';



const ModalOrder = ({ pid, order}) => {
    const [show, setShow] = useState(false);
    const [books, setBooks] = useState([]);
    const callAPI = async () => {
        const res = await axios.get(`/orders/books?pid=${pid}`);
        setBooks(res.data);
    }

    useEffect(() => {
        callAPI();
    }, [])

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <>
            <Button variant="outline-danger" size="sm" onClick={handleShow}>
                주문상품
            </Button>

            <Modal
                style={{ top: '5%' }}
                show={show} size="lg"
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>주문목록</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <InputGroup className='mb-1'>
                        <InputGroup.Text style={{ backgroundColor: "lightgray" , width:'100px'}}>주문번호</InputGroup.Text>
                        <Form.Control disabled value={pid} />
                    </InputGroup>
                    <InputGroup className='mb-3'>
                        <InputGroup.Text style={{ backgroundColor: "lightgray" , width:'100px'}}>배송지주소</InputGroup.Text>
                        <Form.Control value={order.address1} />
                        <Form.Control value={order.address2}/>
                    </InputGroup>

                    <Table bordered hover>
                        <thead >
                            <tr className='table-dark'>
                                <td>ID.</td>
                                <td>제목</td>
                                <td>가격</td>
                                <td>수량</td>
                                <td>금액</td>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map(book =>
                                <tr>
                                    <td>{book.bid}</td>
                                    <td><img src={book.image} width="30px" className='me-2' />
                                        {book.title}</td>
                                    <td>{book.fmtprice}원</td>
                                    <td>{book.qnt}</td>
                                    <td>{book.fmtsum}원</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                    <Alert className="text-end" variant='light'>
                        <div>총 금액 {order.fmtsum}원</div>
                    </Alert>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        닫기
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}


export default ModalOrder