// ModalGenerico.js
import React from 'react';
import { Modal, Button } from 'react-bootstrap'; // Eliminamos 'Form'

const ModalGenerico = ({ show, handleClose, title, children, handleConfirm, confirmText }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
        <Button variant="primary" onClick={handleConfirm}>{confirmText}</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalGenerico;
