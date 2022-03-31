import PropTypes from 'prop-types';

const ModalHeader = ({ children }) => {
  return <div className="modal-header">{children}</div>;
};

ModalHeader.propTypes = {
  children: PropTypes.node,
};

ModalHeader.defaultProps = {
  children: null,
};

export default ModalHeader;
