import PropTypes from 'prop-types';

const ModalBody = ({ children = null }) => {
  return (
    <div className="modal-body">
      <div>{children}</div>
    </div>
  );
};

ModalBody.propTypes = {
  children: PropTypes.node,
};

export default ModalBody;
