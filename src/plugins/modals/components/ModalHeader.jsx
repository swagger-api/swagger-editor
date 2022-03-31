import PropTypes from 'prop-types';

const ModalHeader = ({ id, title, children }) => {
  return (
    <div className="modal-header">
      {title && (
        <div id={id} className="modal-title">
          {title}
        </div>
      )}
      {children}
    </div>
  );
};

ModalHeader.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  children: PropTypes.node,
};

ModalHeader.defaultProps = {
  id: null,
  title: null,
  children: null,
};

export default ModalHeader;
