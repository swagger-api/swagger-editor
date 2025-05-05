import PropTypes from 'prop-types';

const ModalTitle = ({ id = null, children = null }) => (
  <div id={id} className="modal-title">
    {children}
  </div>
);

ModalTitle.propTypes = {
  id: PropTypes.string,
  children: PropTypes.node,
};

export default ModalTitle;
