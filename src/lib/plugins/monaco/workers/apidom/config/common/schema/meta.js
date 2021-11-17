import jsonSchemaCompleteYaml from './complete/yaml';
import jsonSchemaCompleteJson from './complete/json';
import schemaLints from './lint/lints';
import schemaDocs from './docs/schema';

const jsonSchemaMeta = {
  documentation: schemaDocs,
  lint: schemaLints,
  yaml: jsonSchemaCompleteYaml,
  json: jsonSchemaCompleteJson,
};

export default jsonSchemaMeta;
