import React, { PropTypes } from "react"

export default class EditorLayout extends React.Component {

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

    let UIBaseLayout = getComponent("BaseLayout", true)

    let Container = getComponent("Container")
    let EditorContainer = getComponent("EditorContainer", true)
    const SplitPaneMode = getComponent("SplitPaneMode", true)

    return (
      <div>
        <Container className='container'>
          <SplitPaneMode>
            <EditorContainer/>
            <UIBaseLayout/>
        </SplitPaneMode>
      </Container>
    </div>

  )
  }

}
