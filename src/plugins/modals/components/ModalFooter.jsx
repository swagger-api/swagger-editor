import PropTypes from 'prop-types';

const ModalFooter = ({ children = null }) => {
  return <div className="modal-footer">{children}</div>;
};

ModalFooter.propTypes = {
  children: PropTypes.node,
};

export default ModalFooter;
