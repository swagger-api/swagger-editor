import React from "react"
import PropTypes from "prop-types"
import Swagger from "swagger-client"
import URL from "url"
import DropdownMenu from "./DropdownMenu"
import fileDownload from "js-file-download"
import YAML from "js-yaml"
import beautifyJson from "json-beautify"
import { petStoreOas2Def, petStoreOas3Def } from "../../../plugins/default-definitions"


import Logo from "../assets/logo_small.svg"

export default class Topbar extends React.Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      swaggerClient: null,
      clients: [],
      servers: [],
      definitionVersion: "Unknown"
    }
  }

  getGeneratorUrl = () => {
    const { isOAS3, isSwagger2 } = this.props.specSelectors
    const { swagger2GeneratorUrl, oas3GeneratorUrl } = this.props.getConfigs()

    return isOAS3() ? oas3GeneratorUrl : (
      isSwagger2() ? swagger2GeneratorUrl : null
    )
  }

  instantiateGeneratorClient = () => {

    const generatorUrl = this.getGeneratorUrl()

    const isOAS3 = this.props.specSelectors.isOAS3()

    if(!generatorUrl) {
      return this.setState({
        clients: [],
        servers: []
      })
    }

    Swagger(generatorUrl, {
      requestInterceptor: (req) => {
        req.headers["Accept"] = "application/json"
        req.headers["Content-Type"] = "application/json"
      }
    })
    .then(client => {
      this.setState({
        swaggerClient: client
      })

      const clientGetter = isOAS3 ? client.apis.clients.clientLanguages : client.apis.clients.clientOptions
      const serverGetter = isOAS3 ? client.apis.servers.serverLanguages : client.apis.servers.serverOptions


      clientGetter({}, {
        // contextUrl is needed because swagger-client is curently
        // not building relative server URLs correctly
        contextUrl: generatorUrl
      })
      .then(res => {
        this.setState({ clients: res.body || [] })
      })

      serverGetter({}, {
        // contextUrl is needed because swagger-client is curently
        // not building relative server URLs correctly
        contextUrl: generatorUrl
      })
      .then(res => {
        this.setState({ servers: res.body || [] })
      })
    })
  }

  downloadFile = (content, fileName) => {
    if(window.Cypress) {
      // HACK: temporary workaround for https://github.com/cypress-io/cypress/issues/949
      // allows e2e tests to proceed without choking on file download native event
      return
    }
    return fileDownload(content, fileName)
  }

  // Menu actions

  importFromURL = () => {
    let url = prompt("Enter the URL to import from:")

    if(url) {
      fetch(url)
        .then(res => res.text())
        .then(text => {
          this.props.specActions.updateSpec(
            YAML.dump(YAML.load(text), {
              lineWidth: -1
            })
          )
        })
    }
  }

  saveAsYaml = () => {
    let editorContent = this.props.specSelectors.specStr()
    let language = this.getDefinitionLanguage()
    let fileName = this.getFileName()

    if(this.hasParserErrors()) {
      if(language === "yaml") {
        const shouldContinue = confirm("Swagger-Editor isn't able to parse your API definition. Are you sure you want to save the editor content as YAML?")
        if(!shouldContinue) return
      } else {
        return alert("Save as YAML is not currently possible because Swagger-Editor wasn't able to parse your API definition.")
      }
    }

    if(language === "yaml") {
      //// the content is YAML,
      //// so download as-is
      return this.downloadFile(editorContent, `${fileName}.yaml`)
    }

    //// the content is JSON,
    //// so convert and download

    // JSON String -> JS object
    let jsContent = YAML.load(editorContent)
    // JS object -> YAML string
    let yamlContent = YAML.dump(jsContent)
    this.downloadFile(yamlContent, `${fileName}.yaml`)
  }

  saveAsJson = () => {
    let editorContent = this.props.specSelectors.specStr()
    let fileName = this.getFileName()

    if(this.hasParserErrors()) {
      // we can't recover from a parser error in save as JSON
      // because we are always parsing so we can beautify
      return alert("Save as JSON is not currently possible because Swagger-Editor wasn't able to parse your API definition.")
    }

    // JSON or YAML String -> JS object
    let jsContent = YAML.load(editorContent)
    // JS Object -> pretty JSON string
    let prettyJsonContent = beautifyJson(jsContent, null, 2)
    this.downloadFile(prettyJsonContent, `${fileName}.json`)
  }

  saveAsText = () => {
    // Download raw text content
    console.warn("DEPRECATED: saveAsText will be removed in the next minor version.")
    let editorContent = this.props.specSelectors.specStr()
    let isOAS3 = this.props.specSelectors.isOAS3()
    let fileName = isOAS3 ? "openapi.txt" : "swagger.txt"
    this.downloadFile(editorContent, fileName)
  }

  convertToYaml = () => {
    // Editor content -> JS object -> YAML string
    let editorContent = this.props.specSelectors.specStr()
    let jsContent = YAML.load(editorContent)
    let yamlContent = YAML.dump(jsContent)
    this.props.specActions.updateSpec(yamlContent)
  }

  downloadGeneratedFile = (type, name) => {
    let { specSelectors } = this.props
    let swaggerClient = this.state.swaggerClient
    if(!swaggerClient) {
      // Swagger client isn't ready yet.
      return
    }

    if(specSelectors.isOAS3()) {
      // Generator 3 only has one generate endpoint for all types of things...
      // since we're using the tags interface we may as well use the client reference to it
      swaggerClient.apis.clients.generate({}, {
        requestBody: {
          spec: specSelectors.specJson(),
          type: type.toUpperCase(),
          lang: name
        },
        contextUrl: this.getGeneratorUrl()
      }).then(res => {
        this.downloadFile(res.data, `${name}-${type}-generated.zip`)
      })
    } else if(type === "server") {
      swaggerClient.apis.servers.generateServerForLanguage({
        framework : name,
        body: JSON.stringify({
          spec: specSelectors.specJson()
        }),
        headers: JSON.stringify({
          Accept: "application/json"
        })
      })
        .then(res => this.handleResponse(res, { type, name }))
    } else if(type === "client") {
      swaggerClient.apis.clients.generateClient({
        language : name,
        body: JSON.stringify({
          spec: specSelectors.specJson()
        })
      })
        .then(res => this.handleResponse(res, { type, name }))
    }
  }

  handleResponse = (res, { type, name }) => {
    if(!res.ok) {
      return console.error(res)
    }

    let downloadUrl = URL.parse(res.body.link)

    // HACK: workaround for Swagger.io Generator 2.0's lack of HTTPS downloads
    if(downloadUrl.hostname === "generator.swagger.io") {
      downloadUrl.protocol = "https:"
      delete downloadUrl.port
      delete downloadUrl.host
    }

    fetch(URL.format(downloadUrl))
      .then(res => res.blob())
      .then(res => {
        this.downloadFile(res, `${name}-${type}-generated.zip`)
      })
  }

  clearEditor = () => {
    if(window.localStorage) {
      window.localStorage.removeItem("swagger-editor-content")
      this.props.specActions.updateSpec("")
    }
  }

  loadPetStoreOas2 = () => {
    this.props.specActions.updateSpec(petStoreOas2Def)
  }

  loadPetStoreOas3 = () => {
    this.props.specActions.updateSpec(petStoreOas3Def)
  }

  // Helpers
  showModal = (name) => {
    this.setState({
      [name]: true
    })
  }

  hideModal = (name) => {
    this.setState({
      [name]: false
    })
  }

  // Logic helpers

  hasParserErrors = () => {
    return this.props.errSelectors.allErrors().filter(err => err.get("source") === "parser").size > 0
  }

  getFileName = () => {
    // Use `isSwagger2` here, because we want to default to `openapi` if we don't know.
    if(this.props.specSelectors.isSwagger2 && this.props.specSelectors.isSwagger2()) {
      return "swagger"
    }

    return "openapi"
  }

  getDefinitionLanguage = () => {
    let editorContent = this.props.specSelectors.specStr() || ""

    if(editorContent.trim()[0] === "{") {
      return "json"
    }

    return "yaml"
  }


  getDefinitionVersion = () => {
    const { isOAS3, isSwagger2 } = this.props.specSelectors

    return isOAS3() ? "OAS3" : (
      isSwagger2() ? "Swagger2" : "Unknown"
    )
  }

  ///// Lifecycle

  componentDidMount() {
    this.instantiateGeneratorClient()
  }

  componentDidUpdate() {
    const version = this.getDefinitionVersion()

    if(this.state.definitionVersion !== version) {
      // definition version has changed; need to reinstantiate
      // our Generator client
      // --
      // TODO: fix this if there's A Better Way
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        definitionVersion: version
      }, () => this.instantiateGeneratorClient())

    }
  }

  render() {
    let { getComponent, specSelectors, topbarActions } = this.props
    const Link = getComponent("Link")
    const TopbarInsert = getComponent("TopbarInsert")
    const ImportFileMenuItem = getComponent("ImportFileMenuItem")
    const ConvertDefinitionMenuItem = getComponent("ConvertDefinitionMenuItem")
    const AboutMenu = getComponent("TopbarAboutMenu", true)
    const NewEditorButton = getComponent("TopbarNewEditorButton", true)
    const { swagger2ConverterUrl } = this.props.getConfigs()

    console.dir(AboutMenu)

    let showServersMenu = this.state.servers && this.state.servers.length
    let showClientsMenu = this.state.clients && this.state.clients.length

    let definitionLanguage = this.getDefinitionLanguage()

    let isJson = definitionLanguage === "json"

    let makeMenuOptions = (name) => {
      let stateKey = `is${name}MenuOpen`
      let toggleFn = () => this.setState({ [stateKey]: !this.state[stateKey] })
      return {
        isOpen: !!this.state[stateKey],
        close: () => this.setState({ [stateKey]: false }),
        align: "left",
        toggle: <span className="menu-item" onClick={toggleFn}>{ name }</span>
      }
    }

    return (
      <div className="swagger-editor-standalone">
        <div className="topbar">
          <div className="topbar-wrapper">
            <Link href="https://swagger.io/tools/swagger-editor/">
              <img height="35" className="topbar-logo__img" src={ Logo } alt=""/>
            </Link>
            <DropdownMenu {...makeMenuOptions("File")}>
              <li><button type="button" onClick={this.importFromURL}>Import URL</button></li>
              <ImportFileMenuItem onDocumentLoad={content => this.props.specActions.updateSpec(content)} />
              <li role="separator"></li>
              {isJson ? [
                  <li key="1"><button type="button" onClick={this.saveAsJson}>Save as JSON</button></li>,
                  <li key="2"><button type="button" onClick={this.saveAsYaml}>Convert and save as YAML</button></li>
              ] : [
                  <li key="1"><button type="button" onClick={this.saveAsYaml}>Save as YAML</button></li>,
                  <li key="2"><button type="button" onClick={this.saveAsJson}>Convert and save as JSON</button></li>
              ]}
              <li role="separator"></li>
              <li><button type="button" onClick={this.clearEditor}>Clear editor</button></li>
            </DropdownMenu>
            <DropdownMenu {...makeMenuOptions("Edit")}>
              <li><button type="button" onClick={this.convertToYaml}>Convert to YAML</button></li>
              <ConvertDefinitionMenuItem
                isSwagger2={specSelectors.isSwagger2()}
                swagger2ConverterUrl={swagger2ConverterUrl}
                onClick={() => topbarActions.showModal("convert")}
              />
              <li role="separator"></li>
              <li><button type="button" onClick={this.loadPetStoreOas3}>Load Petstore OAS 3.0</button></li>
              <li><button type="button" onClick={this.loadPetStoreOas2}>Load Petstore OAS 2.0</button></li>
            </DropdownMenu>
            <TopbarInsert {...this.props} />
            { showServersMenu ? <DropdownMenu className="long" {...makeMenuOptions("Generate Server")}>
              { this.state.servers
                  .map((serv, i) => <li key={i}><button type="button" onClick={() => this.downloadGeneratedFile("server", serv)}>{serv}</button></li>) }
            </DropdownMenu> : null }
            { showClientsMenu ? <DropdownMenu className="long" {...makeMenuOptions("Generate Client")}>
              { this.state.clients
                  .map((cli, i) => <li key={i}><button type="button" onClick={() => this.downloadGeneratedFile("client", cli)}>{cli}</button></li>) }
            </DropdownMenu> : null }
            <AboutMenu {  ...makeMenuOptions("About")} />
            <NewEditorButton />
          </div>
        </div>
      </div>
    )
  }
}

Topbar.propTypes = {
  specSelectors: PropTypes.object.isRequired,
  errSelectors: PropTypes.object.isRequired,
  specActions: PropTypes.object.isRequired,
  topbarActions: PropTypes.object.isRequired,
  getComponent: PropTypes.func.isRequired,
  getConfigs: PropTypes.func.isRequired,
}
