import PropTypes from 'prop-types';

const ModalBody = ({ children }) => {
  return (
    <div className="modal-body">
      <div>{children}</div>
    </div>
  );
};

ModalBody.propTypes = {
  children: PropTypes.node,
};

ModalBody.defaultProps = {
  children: null,
};

export default ModalBody;
