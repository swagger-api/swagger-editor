import PropTypes from 'prop-types';

const ModalHeader = ({ children = null }) => {
  return <div className="modal-header">{children}</div>;
};

ModalHeader.propTypes = {
  children: PropTypes.node,
};

export default ModalHeader;
