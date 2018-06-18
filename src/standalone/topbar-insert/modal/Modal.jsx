import React from "react"
import PropTypes from "prop-types"
import "./Modal.less"

const Modal = (props) => {
  return (
    <div className="swagger-ui modal insert-modal" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <span className="modal-title">{props.title}</span>
            <a type="button" className="close" aria-label="Close" onClick={props.onCloseClick}>
              <span aria-hidden="true">&times;</span>
            </a>
          </div>
          {props.children}
        </div>
      </div>
    </div>
  )
}

Modal.propTypes = {
  title: PropTypes.string,
  onCloseClick: PropTypes.func,
  children: PropTypes.oneOfType([ 
    PropTypes.array, 
    PropTypes.element 
  ])
}

export default Modal
