# Generic editor home

## Install

```shell script
 $ npm i
```

### POC -> Apidom migration notes
[x] migrate existing POC to apidom/experiments
[x] init oas spec via swagger-ui
[x] connect & sync generic-editor updates to swagger-ui
[x] init oas spec via import File (finish action) - Json
[x] init oas spec via import File (finish action) - Yaml
[ ] init oas spec via import Url (finish action)
[x] CSS/Less/Saas styling

[ ] additional initial style and configuration of monaco editor, as appropriate
[ ] try react-modal lib instead of creating internal version

...more to come
[ ] fix editor configuration/onChange to always word-wrap.
  - currently on refresh, displays single line. dev hot-reload, sometimes will wordwrap if monaco is created with a full definition (instead of default string value)
  - monaco editor currently expects a string (we'll need to support yaml/json)
[ ] fix exploding styling/rendering when using in-browser (ctrl+f) find text within monaco
  - monaco's find+replace feature
[ ] fix importFile not updating generic editor

...reminder of existing features
[ ] match and extend configurability options
[ ] if refresh empty monaco, should load a default definition

### POC notes

The todo list

Last updated: 12/3/2020

Extract menu action methods from React to Actions
[x] importFromURL
[x] saveAsYaml
[x] saveAsJson
[x] convertToYaml
[x] downloadGeneratedFile
[x] importFile
[ ] clearEditor
[x] onDocumentLoad prop - removed. handled now in actions. Theoretically, we could expose as a user-overwritable function. Maybe SH needed it?
[ ] updateEditorContent prop

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
[ ] alert
[ ] confirm

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
[ ] topbar-menu-generator-clients; if done, probably as PureComponent
[ ] topbar-menu-generator-servers; if done, probably as PureComponent

Integration
[ ] swagger-ui redux state
[ ] connect monaco state to swagger-ui redux state
[ ] connect actions with monaco state, e.g. updateEditorContent
[ ] mixed monaco css with swagger css/less/sass

Optimization
[ ] breakdown `actions.js` into smaller files (new)


Notes:
* Swagger-client is used as middleware to transform `generator` responses,
which also includes function methods alongside data objects.
* using swagger-client as "fetch", need to attach `.catch`. should add unit tests with bad/invalid urls
* Todo, handle case(s) when specSelectors.method returns undefined
* Includes mock data and mock configuration. Should remove after implementing unit tests.
* should add unit tests when both swagger2 and oas3 flags set to same value (both true, both false)
* should add unit tests allowing exclusion of both swagger2 and oas3, e.g. future asynapi, graphql, etc.
* there exists 1 case of 'require', but the lib does not have an es6 support. we could make a PR, or bring in house.


Proposals:
*1*. React component onClick => `on<ActionMethod>Click`
|_ redux action method, `handle<ActionMethod>`
  |_ import action, `<ActionMethod>`
reason 1: `<ActionMethod>` should be testable, independent of workflow chains
reason 2: `<ActionMethod>` should be an individual unit, and imported into n index of actions

`handle<ActionMethod>` could wrap a set of user workflow actions, e.g. modals.

*2*. Should test files be co-located with domain?
A: based on CRA setup, should be co-located. e.g. within /src and not /test

*3*. Do we want to control modals from React Component, or from redux Actions?
