import React from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';

const ModalConfirmWrapper = (props) => {
  const {
    isOpen,
    contentLabel,
    modalTitle,
    onCloseModalClick,
    onCancelModalClick,
    onSubmitModalClick,
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
          <button type="button" className="close" onClick={onCloseModalClick}>
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
          <button type="button" className="btn btn-secondary" onClick={onCancelModalClick}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={onSubmitModalClick}>
            Continue
          </button>
        </div>
      </div>
    </ReactModal>
  );
};

ModalConfirmWrapper.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  contentLabel: PropTypes.string.isRequired,
  modalTitle: PropTypes.string.isRequired,
  onCloseModalClick: PropTypes.func.isRequired,
  onCancelModalClick: PropTypes.func.isRequired,
  onSubmitModalClick: PropTypes.func.isRequired,
  modalBodyContent: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
};

export default ModalConfirmWrapper;
