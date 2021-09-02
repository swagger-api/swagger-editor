## Swagger Editor Legacy (v3/v4) Migration Summary

### Topbar Features
[x] Import from URL  
[x] Import from File  
[x] Save As Json  
[x] Save As Yaml  
[x] Convert from Json to Yaml, then download  
[x] Convert from Yaml to Json, then download  
[x] Convert from Json to Yaml, in editor only  
[x] Clear Editor (moved from File Menu to Edit Menu)  
[x] Convert from OAS2 to OAS3  
[x] Generate Servers list - OAS2  
[x] Generate Servers list - OAS3.0  
[x] Generate Clients list - OAS2  
[x] Generate Clients list - OAS3.0  
[x] Display/Hide menu items based on combination of json/yaml, oas2/oas3  
[x] NEW: consistent use of styled Modal components throughout (react-modal)  
[x] NEW: Load default OAS2/OAS3/OAS3.1/AsyncApi2 definition; w/keyboard shortcuts  
[x] Removed: topbar-insert (plugin); no replacement planned  


### Editor Features
[x] NEW: Monaco Editor  
[x] NEW: validation from apidom-ls library
[x] Removed: Ace Editor  
[x] Removed: internal validation from swagger-editor v3/v4
[ ] Drag-n-drop local file to editor (react-dropzone)  
[ ] Persist definition on browser refresh/reload (localStorage)  
[ ] if refresh empty editor value, should load a default definition; hidden dev feature  
[ ] NEW: monaco configuration options  


### Visual UI Features
[x] SwaggerUI v4; React 17  


### Implementation Changes
[x] React Hooks support, e.g. menu item display toggle, modal system  
[x] Behavioral testing of components, e.g. not the implementation details  
[x] Simplify and reorganize `presets`, `layouts`, and `plugins`  
[x] Extract menu action methods from Components to Actions  
[x] Extract menu logic helpers to Actions  
[x] Extract shared menu logic helpers to `utils/editor-converter`  
[x] Replace `fetch` with `axios` http helpers to `utils/topbar-http`  
[x] deprecate plugins with direct implementation: Convert to OAS3, Import File  
[x] Removed: unnecessary state where possible  
[x] Removed: window.alert and window.confirm popups
[x] Removed: swagger-client library dependency  
[x] Tests: testing-library + jest (unit), cypress (e2e)  


### Possible additional/expanded docs/contributing topics  
- Separation of actions from components. tldr: easier to test, possibly more re-usable
- React Hooks. tldr: modern practices  
- testing-library. tldr: focus on user behaviors, more durable/maintainable tests  
- reorganizing the presets. e.g. what happened to `standalone` and other plugins? The new recommended structure. tldr: multi-spec, multi-layouts  


### List of migrated legacy methods  
Note: likely to remove this section from final doc  

Extract menu action methods from React to Actions  
[x] importFromURL  
[x] saveAsYaml  
[x] saveAsJson  
[x] convertToYaml  
[x] downloadGeneratedFile  
[x] importFile  
[x] onDocumentLoad prop - removed. handled now in actions. Theoretically, we could expose as a user-overwritable function. Maybe SH needed it?  
[x] updateEditorContent prop - will be removed, and handled in actions.  
[x] clearEditor  

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
[x] getGenerator2Definition  
[x] postPerformOasConversion  

Remove unnecessary state:
[x] swaggerClient  
[x] definitionVersion  

Remove use of alert and confirm via new modal system
[x] alert  
[x] confirm  


### Additional notes (remove from final doc)  
[x] swagger-ui redux state  
[x] connect monaco state to swagger-ui redux state  
[x] connect actions with monaco state, e.g. updateEditorContent  
[x] init oas spec via swagger-ui  
[x] connect & sync generic-editor updates to swagger-ui  
[x] init oas spec via import File (finish action) - Json  
[x] init oas spec via import File (finish action) - Yaml  
[x] init oas spec via import Url (finish action)  
[x] CSS/Less/Saas styling  
[x] remove use of mock data in topbarActions. (mock fixtures not removed yet)  
[x] try react-modal lib instead of creating internal version  
[x] modify generic-editor plugin to have a default editor placeholder (instead of calling GenericEditorContainer directly)  
[x] add disposables array, and ability to dispose()  
[x] make generator servers/clients toggleable; enable oas3.1/others when supported  
[x] File Menu dropdown - add json/yaml detection to display appropriate link  
[x] Edit menu dropdown - render convert to OAS3 only if currently 'isSwagger2`  
[x] Edit menu dropdown - render convert to Yaml only if currently 'json'  
[x] onboard - default definition should be in YAML format  

### Resolved Issues (remove from final doc)  

[x] ~~fix exploding styling/rendering when using in-browser (ctrl+f) find text within monaco; monaco's find+replace feature~~  USING P2M/M2P FIXES THIS ISSUE  
[x] ~~warning: overlapping semantic tokens~~ THIS IS APIDOM-LS ISSUE  
[x] fix editor configuration/onChange to always word-wrap.  
[x] remove "dev mode" case when editor content is undefined  
[x] remove mock data/fixtures/configuration from `actions.js`  
[x] in codeActionUi, sometimes recieve an Uncaught promise TypeError: d.dispose is not a funtion  
[x] asyncapi support: anywhere we should be detecting async api (or any other supported spec); e.g. clearEditor  
[x] handle apidom parser throw, when unable to detect langugage. e.g. empty string, or oas2  
[x] load default (oas3). note the topbar generate server/client exists. -> clear all. user may type random string. note that the topbar generate server/client did NOT disappear  
[x] load default -> import OAS2. note the topbar generate server/client exists. -> clear all. user may type random string. note that the topbar generate server/client did NOT disappear  
