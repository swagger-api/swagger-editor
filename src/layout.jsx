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
    let { specSelectors, getComponent } = this.props

    let info = specSelectors.info()
    let url = specSelectors.url()
    let basePath = specSelectors.basePath()
    let host = specSelectors.host()
    let securityDefinitions = specSelectors.securityDefinitions()
    let externalDocs = specSelectors.externalDocs()

    let Info = getComponent("info")
    let Operations = getComponent("operations", true)
    let Models = getComponent("models", true)
    let AuthorizeBtn = getComponent("authorizeBtn", true)
    let Container = getComponent("Container")
    let Row = getComponent("Row")
    let Col = getComponent("Col")
    let Errors = getComponent("errors", true)
    let Topbar = getComponent("Topbar", true)
    let EditorContainer = getComponent("EditorContainer", true)
    const SplitPaneMode = getComponent("SplitPaneMode", true)

    return (
      <div>
        <Topbar></Topbar>
        <Container className='container'>
          <SplitPaneMode>
            <EditorContainer/>
            <div className="swagger-ui">
              <Errors/>
              <Row>
                <Col mobile={12}>
                  { info.count() ? (
                    <Info info={ info } url={ url } host={ host } basePath={ basePath } externalDocs={externalDocs} getComponent={getComponent}/>
                  ) : null }
                </Col>
              </Row>
              { securityDefinitions && <Row>
                <Col mobile={12}>
                  <AuthorizeBtn />
                </Col>
              </Row>
            }
            <Row>
              <Col mobile={12} desktop={12} >
                <Operations/>
              </Col>
            </Row>
            <Row>
              <Col mobile={12} desktop={12} >
                <Models/>
              </Col>
            </Row>
          </div>
        </SplitPaneMode>
      </Container>
    </div>

  )
  }

}
