import YAML from 'js-yaml';
import beautifyJson from 'json-beautify';

import {
  getFileName,
  hasParserErrors,
  getDefinitionLanguage,
} from '../../../utils/utils-converter';
import { getFileDownload } from '../../../utils/utils-file-download';
import { getSpecVersion } from '../../../utils/utils-getSpecVersion';
import { mockOas3Spec } from './fixtures.actions';

export const saveAsJson = () => async (system) => {
  const { specSelectors, errSelectors } = system;
  const editorContent = specSelectors.specStr();
  const { isOAS3, isSwagger2, isAsyncApi2 } = getSpecVersion(system);
  // eslint-disable-next-line no-unused-vars
  const options = { isOAS3, isSwagger2, isAsyncApi2 };

  // dev mode; refactor 'contentToConvert' to handle case if editorContent is undefined
  // create a mock yaml from mock json (ref: convertToYaml)
  let contentToConvert;
  if (!editorContent) {
    const tempjsContent = YAML.safeLoad(JSON.stringify(mockOas3Spec));
    const tempyamlContent = YAML.safeDump(tempjsContent);
    contentToConvert = tempyamlContent;
  } else {
    contentToConvert = editorContent;
  }
  // eslint-disable-next-line no-unused-vars
  // const mockOptions = {
  //   isOAS3: true,
  //   isSwagger2: true,
  // };
  // end dev mode scaffold
  const fileName = getFileName({ options });
  const parserErrorExists = hasParserErrors({ errors: errSelectors.allErrors() });
  if (parserErrorExists) {
    // legacy alert window, which we should use a generic modal instead
    return {
      error:
        'Save as JSON is not currently possible because Swagger-Editor was not able to parse your API definiton.',
    };
  }
  // JSON or YAML String -> JS object
  const jsContent = YAML.safeLoad(contentToConvert);
  // JS Object -> pretty JSON string
  const prettyJsonContent = beautifyJson(jsContent, null, 2);
  getFileDownload({ blob: prettyJsonContent, filename: `${fileName}.json` });
  return { data: 'ok' };
};

export const saveAsYaml = ({ overrideWarning }) => async (system) => {
  // console.log('actions.saveAsYaml');
  const { specSelectors, errSelectors } = system;
  const editorContent = specSelectors.specStr();
  // eslint-disable-next-line no-unused-vars
  const { isOAS3, isSwagger2, isAsyncApi2 } = getSpecVersion(system);
  // eslint-disable-next-line no-unused-vars
  const options = { isOAS3, isSwagger2, isAsyncApi2 };

  // dev mode; refactor 'contentToConvert' to handle case if editorContent is undefined
  // create a mock yaml from mock json (ref: convertToYaml)
  let contentToConvert;
  if (!editorContent) {
    const tempjsContent = YAML.safeLoad(JSON.stringify(mockOas3Spec));
    // eslint-disable-next-line no-unused-vars
    const tempyamlContent = YAML.safeDump(tempjsContent);
    contentToConvert = tempyamlContent;
    // contentToConvert = JSON.stringify(mockOas3Spec);
  } else {
    contentToConvert = editorContent;
  }
  // eslint-disable-next-line no-unused-vars
  // const mockOptions = {
  //   isOAS3: true,
  //   isSwagger2: true,
  // };
  // end dev mode scaffold
  const fileName = getFileName({ options });
  const languageSubType = getDefinitionLanguage({ data: contentToConvert });
  const parserErrorExists = hasParserErrors({ errors: errSelectors.allErrors() });
  // const parserErrorExists = true; // mock test
  if (parserErrorExists && !overrideWarning) {
    // legacy method, if already yaml, displays confirm window if parser error
    if (languageSubType === 'yaml') {
      return {
        warning:
          'Swagger Editor is not able to parse your API definition. Are you sure you want to save the editor content as YAML?',
      };
    }
    // legacy alert window, which we should use a generic modal instead
    return {
      error:
        'Save as YAML is not currently possible because Swagger-Editor was not able to parse your API definiton.',
    };
  }

  if (languageSubType === 'yaml') {
    // console.log('download yaml as-is');
    // content is already yaml, so download as-is
    getFileDownload({ blob: contentToConvert, filename: `${fileName}.yaml` });
    return { data: 'ok' };
  }
  // console.log('download yaml from json');
  // JSON String -> JS object
  const jsContent = YAML.safeLoad(contentToConvert);
  // JS Object -> YAML string
  const yamlContent = YAML.safeDump(jsContent);
  getFileDownload({ blob: yamlContent, filename: `${fileName}.yaml` });
  return { data: 'ok' };
};

export default { saveAsJson, saveAsYaml };
