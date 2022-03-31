import React from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';

const Modal = ({ isOpen, contentLabel, aria, children }) => {
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

Modal.defaultProps = {
  isOpen: false,
  contentLabel: null,
  aria: {},
  children: null,
};

export default Modal;
