import React from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';

const Modal = ({ isOpen = false, contentLabel = null, aria = {}, children = null }) => {
  return (
    <ReactModal
      isOpen={isOpen}
      contentLabel={contentLabel}
      aria={aria}
      closeTimeoutMS={200}
      className="ReactModalDefault"
      overlayClassName="ReactModalOverlay"
    >
      <div className="modal-content">{children}</div>
    </ReactModal>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool,
  contentLabel: PropTypes.string,
  aria: PropTypes.shape({ labelledby: PropTypes.string, describedby: PropTypes.string }),
  children: PropTypes.node,
};

export default Modal;
