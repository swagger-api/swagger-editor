import React, { Component } from "react"
import PropTypes from "prop-types"

class Dropdown extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isExpanded: false
    }

    this.onToggleClick = this.onToggleClick.bind(this)
    this.handleClickOutside = this.handleClickOutside.bind(this)
    this.setWrapperRef = this.setWrapperRef.bind(this)
  }

  componentDidMount = () => {
    document.addEventListener("mousedown", this.handleClickOutside)
  }

  componentWillUnmount = () => {
    document.removeEventListener("mousedown", this.handleClickOutside)
  }

  onToggleClick = () => {
    this.setState(prevState => ({
      isExpanded: !prevState.isExpanded
    }))
  }
  
  setWrapperRef = (node) => {
    this.wrapperRef = node
  }

  handleClickOutside = (event) => {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({
        isExpanded: false
      })
    }
  }

  render() {
    return (
      <div className="dd-menu dd-menu-left" ref={this.setWrapperRef}>
        <span className="menu-item" role="button" aria-haspopup="true" aria-expanded={this.state.isExpanded} onClick={this.onToggleClick}>
          {this.props.displayName}
        </span>
        {this.state.isExpanded && 
          <div className="dd-menu-items" aria-labelledby="Dropdown" onClick={this.onToggleClick} role="menu" tabIndex={0}>
            <ul className="dd-items-left">
              {this.props.children}
            </ul>
          </div>
        }
      </div>
    )
  }
}

Dropdown.propTypes = {
  displayName: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([ 
    PropTypes.array, 
    PropTypes.element 
  ])
}

export default Dropdown
