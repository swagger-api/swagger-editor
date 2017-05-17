import React, { PropTypes } from "react"

export default class StandaloneLayout extends React.Component {

  static propTypes = {
    errSelectors: PropTypes.object.isRequired,
    errActions: PropTypes.object.isRequired,
    specActions: PropTypes.object.isRequired,
    specSelectors: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
    layoutSelectors: PropTypes.object.isRequired,
    layoutActions: PropTypes.object.isRequired
  }

  render() {
    let { getComponent } = this.props

    let EditorLayout = getComponent("EditorLayout", true)

    let Topbar = getComponent("Topbar", true)

    return (
      <div>
        <Topbar></Topbar>
        <EditorLayout></EditorLayout>
      </div>
    )
  }

}
