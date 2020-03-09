import React from "react"
import PropTypes from "prop-types"
import classNames from "classnames"

const Modal = (props) => (
  <div className="swagger-ui modal topbar-modal" role="dialog">
    <div className={classNames("modal-dialog", props.styleName)} role="document">
      <div className="modal-content">
        <div className={classNames("modal-header", {"modal-header-border" : props.title})} >
          <span className="modal-title">{props.title}</span>
          {!props.hideCloseButton && <a type="button" className="close" aria-label="Close" onClick={props.onCloseClick}>
            <span aria-hidden="true">&times;</span>
          </a> }
        </div>
        {props.children}
      </div>
    </div>
  </div>
)

Modal.propTypes = {
  title: PropTypes.string,
  styleName: PropTypes.string,
  onCloseClick: PropTypes.func,
  hideCloseButton: PropTypes.bool,
  children: PropTypes.oneOfType([ 
    PropTypes.array, 
    PropTypes.element 
  ])
}

export default Modal
