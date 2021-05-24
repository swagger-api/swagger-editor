import React from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';

export default function ModalConfirmWrapper(props) {
  const {
    isOpen,
    contentLabel,
    modalTitle,
    closeModalClick,
    cancelModalClick,
    submitModalClick,
    modalBodyContent,
  } = props;

  return (
    <ReactModal
      isOpen={isOpen}
      contentLabel={contentLabel}
      closeTimeoutMS={200}
      className="ReactModalDefault"
      overlayClassName="ReactModalOverlay"
    >
      <div className="modal-content">
        <div className="modal-header">
          <button type="button" className="close" onClick={closeModalClick}>
            <span aria-hidden="true">x</span>
          </button>
          <div className="modal-title">{modalTitle}</div>
        </div>
        <div className="modal-body">
          <div>Warning: {modalBodyContent}</div>
          <br />
          <div>Are you sure you want to continue?</div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={cancelModalClick}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={submitModalClick}>
            Continue
          </button>
        </div>
      </div>
    </ReactModal>
  );
}

ModalConfirmWrapper.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  contentLabel: PropTypes.string.isRequired,
  modalTitle: PropTypes.string.isRequired,
  closeModalClick: PropTypes.func.isRequired,
  cancelModalClick: PropTypes.func.isRequired,
  submitModalClick: PropTypes.func.isRequired,
  modalBodyContent: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
};
