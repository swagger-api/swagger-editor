import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';

export default class ModalInputWrapper extends PureComponent {
  render() {
    const {
      isOpen,
      contentLabel,
      modalTitle,
      closeModalClick,
      cancelModalClick,
      submitModalClick,
      modalBodyContent,
    } = this.props;
    return (
      <Modal
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
          <div className="modal-body">{modalBodyContent}</div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={cancelModalClick}>
              Cancel
            </button>
            <button type="button" className="btn btn-primary" onClick={submitModalClick}>
              Submit
            </button>
          </div>
        </div>
      </Modal>
    );
  }
}

ModalInputWrapper.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  contentLabel: PropTypes.string.isRequired,
  modalTitle: PropTypes.string.isRequired,
  closeModalClick: PropTypes.func.isRequired,
  cancelModalClick: PropTypes.func.isRequired,
  submitModalClick: PropTypes.func.isRequired,
  modalBodyContent: PropTypes.oneOfType([PropTypes.object]).isRequired,
};
