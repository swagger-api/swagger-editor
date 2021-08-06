import YAML from 'js-yaml';
import JSONSchemaValidator from 'src/plugins/json-schema-validator/validator/index.js';
import fs from 'fs';
import path from 'path';

const swagger2SchemaYaml = fs.readFileSync(path.join(__dirname, '../../../../src/plugins/json-schema-validator/swagger2-schema.yaml')).toString();
const oas3SchemaYaml = fs.readFileSync(path.join(__dirname, '../../../../src/plugins/json-schema-validator/oas3-schema.yaml')).toString();

const swagger2Schema = YAML.load(swagger2SchemaYaml);
const oas3Schema = YAML.load(oas3SchemaYaml);


var testDocuments = fs
  .readdirSync(__dirname + '/test-documents')
  .filter(path => path.endsWith('yaml'))
  .map(path => ({
    path: '/test-documents/' + path,
    contentString: fs.readFileSync(__dirname + '/test-documents/' + path, 'utf8'),
  }))
  .map(doc => ({
    path: doc.path,
    content: YAML.load(doc.contentString)
  }));

testDocuments.forEach(doc => {
  const { path, content } = doc;
  const { meta = {}, cases = [] } = content;

  const validator = new JSONSchemaValidator();
  validator.addSchema(swagger2Schema, ['openapi-2.0']);
  validator.addSchema(oas3Schema, ['openapi-3.0']);

  const rootDescribe = meta.skip ? describe.skip : describe;

  rootDescribe('schema validation plugin - ' + (meta.title || path), function() {
    if(content.input && content.output) {
      // fold simple input/output docs into implicit cases
      cases.push({
        input: content.input,
        output: content.output,
      });
    }

    if(cases && cases.length) {
      cases.forEach(currentCase => {
        const versionDefaultSchema = currentCase.input.openapi && !currentCase.input.swagger ? 'openapi-3.0' : 'openapi-2.0';

        const result = validator.validate({
          jsSpec: currentCase.input,
          specStr: '', // not needed here
          schemaPath: versionDefaultSchema,
          source: 'structural',
        });

        if(currentCase.name) {
          // only create a new describe block if we have a name
          describe(currentCase.name || '', () => {
            assertCaseExpectations(currentCase, result);
          });
        } else {
          // else, just do the assertions under the root describe block
          assertCaseExpectations(currentCase, result);
        }
      });
    }
  });
});

function assertCaseExpectations(currentCase, result) {
  const itFn = currentCase.skip ? it.skip : it;
  if (currentCase.output.match !== undefined) {
    itFn('should match expected error output', function () {
      expect(result.toString()).toMatch(currentCase.output.match.toString());
    });
  }

  if (currentCase.output.length !== undefined) {
    itFn('should have expected array length', function () {
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(currentCase.output.length);
    });
  }

  if(currentCase.output.equal !== undefined) {
    itFn('should equal expected value', function() {
      expect(result).toEqual(currentCase.output.equal);
    });
  }
}
