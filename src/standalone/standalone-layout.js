import React from "react"
import PropTypes from "prop-types"

export default class StandaloneLayout extends React.Component {

  static propTypes = {
    specActions: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
  }

  render() {
    const { getComponent } = this.props
    const EditorLayout = getComponent("EditorLayout", true)
    const Topbar = getComponent("Topbar", true)

    return (
      <div>
        <Topbar />
        <EditorLayout/>
      </div>
    )
  }

}
