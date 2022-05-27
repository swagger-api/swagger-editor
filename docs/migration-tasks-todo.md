# Migration Status  

* [Swagger Editor Legacy (v3/v4) Migration Summary](/migration-legacy-summary.md)  

### Known Issues  

[ ] handle case(s) when specSelectors.method returns undefined  

### Integration Tasks  
[ ] match and extend configurability options for editor & monaco  

### Backlog
[ ] update "minimal" specs/fixtures for `clearEditor`; oas2, oas3, oas3_1, asycapi2  
[ ] memory performance benchmarks  
[ ] if refresh empty monaco, ~~should~~ MAY load a default definition  
[ ] jump-to-path (plugin)  


### Ideas
[ ] topbar: topbar-insert (plugin); this should be integrated into the `Topbar` plugin  
[ ] topbar: update generator (plugin?) for oas3.1, asyncapi, etc. support when available  
[ ] monaco: update syntax highlighting as needed  
[ ] monaco - additional initial style and configuration of monaco editor, as needed  


### Test Coverage Ideas   
[ ] should add unit tests with bad/invalid urls; generator, import Url  
[ ] should add unit tests when both swagger2 and oas3 flags set to same value (both true, both false)  
[ ] should add unit tests allowing exclusion of both swagger2 and oas3, e.g. future asynapi, graphql, etc.  
[ ] e2e: monaco-editor features  
