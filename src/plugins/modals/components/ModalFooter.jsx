import PropTypes from 'prop-types';

const ModalFooter = ({ children }) => {
  return <div className="modal-footer">{children}</div>;
};

ModalFooter.propTypes = {
  children: PropTypes.node,
};

ModalFooter.defaultProps = {
  children: null,
};

export default ModalFooter;
