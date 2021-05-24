import React from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';

export default function ModalErrorWrapper(props) {
  const {
    isOpen,
    contentLabel,
    modalTitle,
    closeModalClick,
    // eslint-disable-next-line no-unused-vars
    cancelModalClick,
    // eslint-disable-next-line no-unused-vars
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
          <div>{modalBodyContent}</div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={closeModalClick}>
            Close
          </button>
        </div>
      </div>
    </ReactModal>
  );
}

// export default class ModalErrorWrapper extends PureComponent {
//   render() {
//     const {
//       isOpen,
//       contentLabel,
//       modalTitle,
//       closeModalClick,
//       // eslint-disable-next-line no-unused-vars
//       cancelModalClick,
//       // eslint-disable-next-line no-unused-vars
//       submitModalClick,
//       modalBodyContent,
//     } = this.props;
//     return (
//       <ReactModal
//         isOpen={isOpen}
//         contentLabel={contentLabel}
//         closeTimeoutMS={200}
//         className="ReactModalDefault"
//         overlayClassName="ReactModalOverlay"
//       >
//         <div className="modal-content">
//           <div className="modal-header">
//             <button type="button" className="close" onClick={closeModalClick}>
//               <span aria-hidden="true">x</span>
//             </button>
//             <div className="modal-title">{modalTitle}</div>
//           </div>
//           <div className="modal-body">
//             <div>{modalBodyContent}</div>
//           </div>
//           <div className="modal-footer">
//             <button type="button" className="btn btn-primary" onClick={closeModalClick}>
//               Close
//             </button>
//           </div>
//         </div>
//       </ReactModal>
//     );
//   }
// }

ModalErrorWrapper.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  contentLabel: PropTypes.string.isRequired,
  modalTitle: PropTypes.string.isRequired,
  closeModalClick: PropTypes.func.isRequired,
  cancelModalClick: PropTypes.func.isRequired,
  submitModalClick: PropTypes.func.isRequired,
  modalBodyContent: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
};
