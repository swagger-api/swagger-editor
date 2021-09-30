# Changelog / Migration Status  

* [Swagger Editor Legacy (v3/v4) Migration Summary](docs/migration-summary-editor-v3.md)  

### Known Issues  

[ ] React Hoook-based component cannot be imported via swagger-ui's `getComponent` method  
[ ] handle case(s) when specSelectors.method returns undefined  

### Integration Tasks  
[ ] add generic error catch component, e.g. SHub uses react-error-boundary  
[ ] react-dropzone  
[ ] match and extend configurability options for editor & monaco  
[ ] localStorage  
[ ] if refresh empty monaco, should load a default definition  
[ ] jump-to-path; if still needed, this should be integrated into the new `EditorPane` plugin  
[ ] monaco - mixed monaco css with swagger css/less/sass, as needed  
[ ] monaco - additional initial style and configuration of monaco editor, as appropriate  
[ ] monaco - config/remove minimap. UX discussion.  
[ ] replicate SH validation pane  
[ ] replicate SH left sidebar (search, op/schema/etc sections)  
[ ] update generator (plugin?) for oas3.1, asyncapi, etc. support when available  
[ ] debounce initial load of definition. this may help with single vs. multi-line render in editor. atm, this would also apply to all user updates  
[ ] debounce user updates (might not be needed)  
[ ] topbar-insert (plugin); this should be integrated into the `Topbar` plugin  
[ ] memory performance benchmarks  


### Refinement  
[ ] overall styling and consistency  
[ ] update monaco syntax highlighting  
[ ] update "minimal" specs/fixtures for `clearEditor`; oas2, oas3, oas3_1, asycapi2  


### Test Coverage  
[x] Topbar rendering; spies/mocks on calls to topbarActions, to avoid live http methods  
[x] monaco-editor render (cypress)  
[x] e2e:monaco (cypress). user "select all" + "clear/cut" definition.  
[ ] optional: should add unit tests with bad/invalid urls; generator, import Url  
[ ] optional: topbarActions: downloadFile (mock download)  
[ ] optional: actions that affect swagger-ui spec  
[ ] optional: should add unit tests when both swagger2 and oas3 flags set to same value (both true, both false)  
[ ] optional: should add unit tests allowing exclusion of both swagger2 and oas3, e.g. future asynapi, graphql, etc.  
[ ] e2e: monaco-editor features  
[ ] e2e: swagger-ui render, when present in layout  
[ ] e2e:monaco. upload unsupported spec -> hover should not cause UI error  
[ ] e2e:monaco. upload unsupported spec -> user edit should not cause UI error  


### Additional Notes:
* Includes mock data and mock configuration. Should remove after implementing unit tests.
* there exists 1 case of 'require', but the lib does not have an es6 support. we could make a PR, or bring in house.
* Difference between Ace and Monaco: It appears Monaco does not/should not need an initial value. There exists default value, which atm, is set to a welcome string so that the component can load quickly and immediately.

Proposals:  
**1**. Should unit test files be co-located with domain?  
A: based on CRA setup, unit tests should be co-located. e.g. within /src and not /test  

**2**. Do we want to control modals from React Component, or from redux Actions?  
A: currently controlled via components (react hooks). keep actions atomic.  
