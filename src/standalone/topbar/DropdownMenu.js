// Adapted from https://github.com/mlaursen/react-dd-menu/blob/master/src/js/DropdownMenu.js

import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import CSSTransitionGroup from "react-transition-group/CSSTransitionGroup"
import classnames from "classnames"

const TAB = 9
const SPACEBAR = 32
const ALIGNMENTS = ["center", "right", "left"]
const MENU_SIZES = ["sm", "md", "lg", "xl"]


export default class DropdownMenu extends PureComponent {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
    toggle: PropTypes.node.isRequired,
    children: PropTypes.node,
    inverse: PropTypes.bool,
    align: PropTypes.oneOf(ALIGNMENTS),
    animAlign: PropTypes.oneOf(ALIGNMENTS),
    textAlign: PropTypes.oneOf(ALIGNMENTS),
    menuAlign: PropTypes.oneOf(ALIGNMENTS),
    className: PropTypes.string,
    size: PropTypes.oneOf(MENU_SIZES),
    upwards: PropTypes.bool,
    animate: PropTypes.bool,
    enterTimeout: PropTypes.number,
    leaveTimeout: PropTypes.number,
    closeOnInsideClick: PropTypes.bool,
    closeOnOutsideClick: PropTypes.bool,
  };

  static defaultProps = {
    inverse: false,
    align: "center",
    animAlign: null,
    textAlign: null,
    menuAlign: null,
    className: null,
    size: null,
    upwards: false,
    animate: true,
    enterTimeout: 150,
    leaveTimeout: 150,
    closeOnInsideClick: true,
    closeOnOutsideClick: true,
  };

  static MENU_SIZES = MENU_SIZES;
  static ALIGNMENTS = ALIGNMENTS;

  componentDidUpdate(prevProps) {
    if(this.props.isOpen === prevProps.isOpen) {
      return
    }

    const menuItems = this.dropdownMenuRef.querySelector(".dd-menu > .dd-menu-items")
    if(this.props.isOpen && !prevProps.isOpen) {
      this.lastWindowClickEvent = this.handleClickOutside
      document.addEventListener("click", this.lastWindowClickEvent)
      if(this.props.closeOnInsideClick) {
        menuItems.addEventListener("click", this.props.close)
      }
      menuItems.addEventListener("onkeydown", this.close)
    } else if(!this.props.isOpen && prevProps.isOpen) {
      document.removeEventListener("click", this.lastWindowClickEvent)
      if(prevProps.closeOnInsideClick) {
        menuItems.removeEventListener("click", this.props.close)
      }
      menuItems.removeEventListener("onkeydown", this.close)

      this.lastWindowClickEvent = null
    }
  }

  componentWillUnmount() {
    if(this.lastWindowClickEvent) {
      document.removeEventListener("click", this.lastWindowClickEvent)
    }
  }

  close = (e) => {
    const key = e.which || e.keyCode
    if(key === SPACEBAR) {
      this.props.close()
      e.preventDefault()
    }
  };

  handleClickOutside = (e) => {
    if(!this.props.closeOnOutsideClick) {
      return
    }

    const node = this.dropdownMenuRef
    let target = e.target

    while(target.parentNode) {
      if(target === node) {
        return
      }

      target = target.parentNode
    }

    this.props.close(e)
  };

  handleKeyDown = (e) => {
    const key = e.which || e.keyCode
    if(key !== TAB) {
      return
    }

    const items = this.dropdownMenuRef.current.querySelectorAll("button,a")
    const id = e.shiftKey ? 1 : items.length - 1

    if(e.target === items[id]) {
      this.props.close(e)
    }
  };


  render() {
    const { menuAlign, align, inverse, size, className } = this.props

    const menuClassName = classnames(
      "dd-menu",
      `dd-menu-${menuAlign || align}`,
      { "dd-menu-inverse": inverse },
      className,
      size ? ("dd-menu-" + size) : null
    )

    const { textAlign, upwards, animAlign, animate, enterTimeout, leaveTimeout } = this.props

    const listClassName = "dd-items-" + (textAlign || align)
    const transitionProps = {
      transitionName: "grow-from-" + (upwards ? "up-" : "") + (animAlign || align),
      component: "div",
      className: classnames("dd-menu-items", { "dd-items-upwards": upwards }),
      onKeyDown: this.handleKeyDown,
      transitionEnter: animate,
      transitionLeave: animate,
      transitionEnterTimeout: enterTimeout,
      transitionLeaveTimeout: leaveTimeout,
    }

    return (
      <div className={menuClassName} ref={node => this.dropdownMenuRef = node}>
        {this.props.toggle}
        <CSSTransitionGroup {...transitionProps}>
          {this.props.isOpen &&
          <ul key="items" className={listClassName}>{this.props.children}</ul>
          }
        </CSSTransitionGroup>
      </div>
    )
  }
}
