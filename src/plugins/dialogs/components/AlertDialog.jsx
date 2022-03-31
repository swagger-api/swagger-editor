import PropTypes from 'prop-types';
import React from 'react';

const AlertDialog = ({ isOpen, title, getComponent, children, onClose }) => {
  const Modal = getComponent('Modal');
  const ModalHeader = getComponent('ModalHeader');
  const ModalTitle = getComponent('ModalTitle');
  const ModalBody = getComponent('ModalBody');
  const ModalFooter = getComponent('ModalFooter');

  return (
    <Modal isOpen={isOpen} contentLabel={title}>
      <ModalHeader>
        <button type="button" className="close" onClick={onClose}>
          <span aria-hidden="true">x</span>
        </button>
        <ModalTitle>{title}</ModalTitle>
      </ModalHeader>
      <ModalBody>{children}</ModalBody>
      <ModalFooter>
        <button type="button" className="btn btn-primary" onClick={onClose}>
          OK
        </button>
      </ModalFooter>
    </Modal>
  );
};

AlertDialog.propTypes = {
  isOpen: PropTypes.bool,
  title: PropTypes.string,
  getComponent: PropTypes.func.isRequired,
  children: PropTypes.node,
  onClose: PropTypes.func,
};

AlertDialog.defaultProps = {
  isOpen: false,
  title: '',
  children: null,
  onClose: () => {},
};

export default AlertDialog;
