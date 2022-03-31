import PropTypes from 'prop-types';
import React from 'react';

const ConfirmDialog = ({ isOpen, title, getComponent, children, onClose }) => {
  const Modal = getComponent('Modal');
  const ModalHeader = getComponent('ModalHeader');
  const ModalTitle = getComponent('ModalTitle');
  const ModalBody = getComponent('ModalBody');
  const ModalFooter = getComponent('ModalFooter');

  const handleOKClick = () => {
    onClose(true);
  };
  const handleCancelClick = () => {
    onClose(false);
  };
  const handleCloseClick = () => {
    onClose(false);
  };

  return (
    <Modal isOpen={isOpen} contentLabel={title}>
      <ModalHeader>
        <button type="button" className="close" onClick={handleCloseClick}>
          <span aria-hidden="true">x</span>
        </button>
        <ModalTitle>{title}</ModalTitle>
      </ModalHeader>
      <ModalBody>{children}</ModalBody>
      <ModalFooter>
        <button type="button" className="btn btn-secondary" onClick={handleCancelClick}>
          Cancel
        </button>
        <button type="button" className="btn btn-primary" onClick={handleOKClick}>
          OK
        </button>
      </ModalFooter>
    </Modal>
  );
};

ConfirmDialog.propTypes = {
  isOpen: PropTypes.bool,
  title: PropTypes.string,
  getComponent: PropTypes.func.isRequired,
  children: PropTypes.node,
  onClose: PropTypes.func,
};

ConfirmDialog.defaultProps = {
  isOpen: false,
  title: '',
  children: null,
  onClose: () => {},
};

export default ConfirmDialog;
