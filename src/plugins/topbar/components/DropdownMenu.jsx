/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Dropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isExpanded: false,
    };
  }

  componentDidMount = () => {
    document.addEventListener('mousedown', this.handleClickOutside);
  };

  componentWillUnmount = () => {
    document.removeEventListener('mousedown', this.handleClickOutside);
  };

  handleToggleClick = () => {
    this.setState((prevState) => ({
      isExpanded: !prevState.isExpanded,
    }));
  };

  setWrapperRef = (node) => {
    this.wrapperRef = node;
  };

  handleClickOutside = (event) => {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({
        isExpanded: false,
      });
    }
  };

  render() {
    const { isExpanded } = this.state;
    const { children, displayName } = this.props;

    return (
      <div className="dd-menu dd-menu-left" ref={this.setWrapperRef}>
        <span
          className="menu-item"
          role="button"
          tabIndex={0}
          aria-haspopup="true"
          aria-expanded={isExpanded}
          onClick={this.handleToggleClick}
        >
          {displayName}
        </span>
        {isExpanded && (
          <div
            className="dd-menu-items"
            aria-labelledby="Dropdown"
            onClick={this.handleToggleClick}
            role="menu"
            tabIndex={0}
          >
            <ul className="dd-items-left">{children}</ul>
          </div>
        )}
      </div>
    );
  }
}

Dropdown.propTypes = {
  displayName: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.element]),
};

Dropdown.defaultProps = {
  children: [],
};

export default Dropdown;
