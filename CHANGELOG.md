# Changelog / Migration Status

### Known Issues
[ ] fix editor configuration/onChange to always word-wrap.
  - currently on refresh, displays single line. dev hot-reload, sometimes will wordwrap if monaco is created with a full definition (instead of default string value)
  - monaco editor currently expects a string (we'll need to support yaml/json)
[ ] fix exploding styling/rendering when using in-browser (ctrl+f) find text within monaco
  - monaco's find+replace feature
[ ] fix monaco syntax highlighting
[ ] remove "dev mode" case when editor content is undefined
[ ] handle case(s) when specSelectors.method returns undefined
[ ] remove mock data/fixtures/configuration from `actions.js`
[ ] warning: overlapping semantic tokens


### Legacy Swagger Editor Migrated Features

Extract menu action methods from React to Actions
[x] importFromURL
[x] saveAsYaml
[x] saveAsJson
[x] convertToYaml
[x] downloadGeneratedFile
[x] importFile
[x] onDocumentLoad prop - removed. handled now in actions. Theoretically, we could expose as a user-overwritable function. Maybe SH needed it?
[x] updateEditorContent prop - will be removed, and handled in actions.
[ ] clearEditor

Deprecate methods from React
[x] saveAsText
[x] handleResponse

Extract menu logic helpers to Actions
[x] getGeneratorUrl
[x] instantiateGeneratorClient
[x] shouldReInstantiateGeneratorClient (new)

Extract menu logic helpers to utils-converter
[x] hasParserErrors
[x] getFileName
[x] getDefinitionLanguage
[x] getDefinitionVersion

Create (axios) http method to utils-http
[x] getDefinitionFromUrl
[x] getGeneratedDefinition
[x] postPerformOasConversion

Remove unnecessary state:
[x] swaggerClient
[x] definitionVersion

Migrate state to redux (or try react hooks):
[ ] clients
[ ] servers

Remove use of alert and confirm via new modal system (try react hooks)
[x] alert
[x] confirm

Migrate React Components
[x] topbar-dropdown
[x] topbar-edit-menu
[x] topbar-file-menu
[x] convert from swagger2 to oas3 (plugin -> edit menu)
[x] ImportFileMenuItem (plugin); effective a DropdownItem, so try re-use
[ ] modal system (all-new)
[ ] react-dropzone
[ ] topbar-insert (plugin); this should be a copy/paste
[ ] jump-to-path; this should be a copy/paste
[x] topbar-menu-generator-clients; if done, probably as PureComponent
[x] topbar-menu-generator-servers; if done, probably as PureComponent
[ ] match and extend configurability options
[ ] if refresh empty monaco, should load a default definition
[ ] localStorage


### Integration
[x] swagger-ui redux state
[x] connect monaco state to swagger-ui redux state
[x] connect actions with monaco state, e.g. updateEditorContent
[ ] mixed monaco css with swagger css/less/sass
[ ] additional initial style and configuration of monaco editor, as appropriate
[x] init oas spec via swagger-ui
[x] connect & sync generic-editor updates to swagger-ui
[x] init oas spec via import File (finish action) - Json
[x] init oas spec via import File (finish action) - Yaml
[x] init oas spec via import Url (finish action)
[x] CSS/Less/Saas styling
[x] remove use of mock data in topbarActions. (mock fixtures not removed yet)
[x] try react-modal lib instead of creating internal version
[ ] pull-in SH validation pane
[ ] pull-in SH left sidebar (search, op/schema/etc sections)
[ ] modify generic-editor plugin to have a default editor placeholder (instead of calling GenericEditorContainer directly)
[ ] onLoad definition, detect and parse with matching apidom-parser


### Optimization
[ ] breakdown `actions.js` into smaller files (new)
[ ] further extraction in `actions.js` of business logic from action creators
[ ] monaco-editor should only load specified languages; webpack required
[ ] overall styling and consistency


### Test Coverage
[x] Topbar rendering; spies/mocks on calls to topbarActions, to avoid live http methods
[ ] topbarActions: http calls with swagger-generator + swagger-client; response includes additional functions;  
[ ] should add unit tests with bad/invalid urls; generator, import Url
[ ] topbarActions: downloadFile (mock download)
[ ] monaco-editor render
[ ] monaco-editor features
[ ] swagger-ui render
[ ] actions that affect swagger-ui spec
[ ] should add unit tests when both swagger2 and oas3 flags set to same value (both true, both false)
[ ] should add unit tests allowing exclusion of both swagger2 and oas3, e.g. future asynapi, graphql, etc.


### Additional Notes:
* Includes mock data and mock configuration. Should remove after implementing unit tests.
* there exists 1 case of 'require', but the lib does not have an es6 support. we could make a PR, or bring in house.
* Difference between Ace and Monaco: It appears Monaco does not/should not need an initial value. There exists default value, which atm, is set to a welcome string so that the component can load quickly and immediately.

Proposals:
*1*. Should test files be co-located with domain?
A: based on CRA setup, should be co-located. e.g. within /src and not /test

*2*. Do we want to control modals from React Component, or from redux Actions?
A: currently controlled via components. keep actions atomic.
