import PropTypes from 'prop-types';

const ModalTitle = ({ id, children }) => (
  <div id={id} className="modal-title">
    {children}
  </div>
);

ModalTitle.propTypes = {
  id: PropTypes.string,
  children: PropTypes.node,
};

ModalTitle.defaultProps = {
  id: null,
  children: null,
};

export default ModalTitle;
