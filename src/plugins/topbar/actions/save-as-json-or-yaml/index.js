import YAML from 'js-yaml';
import beautifyJson from 'json-beautify';
import { getLanguageService, Format } from '@swagger-api/apidom-ls';
import { TextDocument } from 'vscode-languageserver-textdocument'; // this is true source

import {
  getDefinitionLanguage,
  getFileName,
  hasParserErrors,
} from '../../../../utils/spec-converter.js';
import { getFileDownload } from '../../../../utils/common-file-download.js';
import { getSpecVersion } from '../../../../utils/spec-get-spec-version.js';
import { mockOas3Spec } from '../topbar-actions-fixtures.js';

export const saveAsJson = () => async (system) => {
  const { specSelectors, errSelectors } = system;
  const editorContent = specSelectors.specStr();
  // eslint-disable-next-line camelcase
  const { isOAS3, isSwagger2, isOAS3_1, isAsyncApi2 } = getSpecVersion(system);
  const options = { isOAS3, isSwagger2, isOAS3_1, isAsyncApi2 }; // eslint-disable-line camelcase

  // create a mock yaml from mock json (ref: convertToYaml)
  let contentToConvert;
  if (!editorContent) {
    const tempjsContent = YAML.load(JSON.stringify(mockOas3Spec));
    const tempyamlContent = YAML.dump(tempjsContent);
    contentToConvert = tempyamlContent;
  } else {
    contentToConvert = editorContent;
  }

  const fileName = getFileName({ options });
  const parserErrorExists = hasParserErrors({ errors: errSelectors.allErrors() });
  if (parserErrorExists) {
    // message for modal to display
    return {
      error:
        'Save as JSON is not currently possible because Swagger-Editor was not able to parse your API definiton.',
    };
  }
  // JSON or YAML String -> JS object
  const jsContent = YAML.load(contentToConvert);
  // JS Object -> pretty JSON string
  const prettyJsonContent = beautifyJson(jsContent, null, 2);
  getFileDownload({ blob: prettyJsonContent, filename: `${fileName}.json` });
  return { data: 'ok' };
};

export const saveAsJsonResolved = () => async (system) => {
  const { specSelectors, errSelectors } = system;
  const editorContent = specSelectors.specStr();
  // eslint-disable-next-line camelcase
  const { isOAS3, isSwagger2, isOAS3_1, isAsyncApi2 } = getSpecVersion(system);
  const options = { isOAS3, isSwagger2, isOAS3_1, isAsyncApi2 }; // eslint-disable-line camelcase

  // create a mock yaml from mock json (ref: convertToYaml)
  let contentToConvert;
  if (!editorContent) {
    const tempjsContent = YAML.load(JSON.stringify(mockOas3Spec));
    const tempyamlContent = YAML.dump(tempjsContent);
    contentToConvert = tempyamlContent;
  } else {
    contentToConvert = editorContent;
  }

  const fileName = getFileName({ options });
  const parserErrorExists = hasParserErrors({ errors: errSelectors.allErrors() });
  if (parserErrorExists) {
    // message for modal to display
    return {
      error:
        'Save as JSON is not currently possible because Swagger-Editor was not able to parse your API definiton.',
    };
  }
  const apidomContext = {};
  const languageService = getLanguageService(apidomContext); // use apidom metadata

  try {
    const doc = TextDocument.create('foo://bar/file.json', 'apidom', 0, contentToConvert);
    const context = {
      format: Format.JSON,
      baseURI: window.location.href,
    };
    const result = await languageService.doDeref(doc, context);

    if (!result) {
      return { error: 'an error has occured' };
    }
    getFileDownload({ blob: result, filename: `${fileName}.json` });
    return { data: 'ok' };
  } catch (e) {
    return { error: e.message };
  }
};

export const saveAsYamlResolved = () => async (system) => {
  const { specSelectors, errSelectors } = system;
  const editorContent = specSelectors.specStr();
  // eslint-disable-next-line camelcase
  const { isOAS3, isSwagger2, isOAS3_1, isAsyncApi2 } = getSpecVersion(system);
  const options = { isOAS3, isSwagger2, isOAS3_1, isAsyncApi2 }; // eslint-disable-line camelcase

  // create a mock yaml from mock json (ref: convertToYaml)
  let contentToConvert;
  if (!editorContent) {
    const tempjsContent = YAML.load(JSON.stringify(mockOas3Spec));
    const tempyamlContent = YAML.dump(tempjsContent);
    contentToConvert = tempyamlContent;
  } else {
    contentToConvert = editorContent;
  }

  const fileName = getFileName({ options });
  const parserErrorExists = hasParserErrors({ errors: errSelectors.allErrors() });
  if (parserErrorExists) {
    return {
      error:
        'Save as JSON is not currently possible because Swagger-Editor was not able to parse your API definiton.',
    };
  }

  const apidomContext = {};
  const languageService = getLanguageService(apidomContext); // use apidom metadata

  try {
    const doc = TextDocument.create('foo://bar/file.json', 'apidom', 0, contentToConvert);
    const context = {
      format: Format.YAML,
      baseURI: window.location.href,
    };
    const result = await languageService.doDeref(doc, context);
    if (!result) {
      return { error: 'an error has occured' };
    }
    const jsContent = YAML.load(result);
    const yamlResult = YAML.dump(jsContent);
    getFileDownload({ blob: yamlResult, filename: `${fileName}.yaml` });
    return { data: 'ok' };
  } catch (e) {
    return { error: e.message };
  }
};

export const saveAsYaml =
  ({ overrideWarning }) =>
  async (system) => {
    const { specSelectors, errSelectors } = system;
    const editorContent = specSelectors.specStr();
    // eslint-disable-next-line camelcase
    const { isOAS3, isSwagger2, isOAS3_1, isAsyncApi2 } = getSpecVersion(system);
    const options = { isOAS3, isSwagger2, isOAS3_1, isAsyncApi2 }; // eslint-disable-line camelcase

    // create a mock yaml from mock json (ref: convertToYaml)
    let contentToConvert;
    if (!editorContent) {
      const tempjsContent = YAML.load(JSON.stringify(mockOas3Spec));
      const tempyamlContent = YAML.dump(tempjsContent);
      contentToConvert = tempyamlContent;
    } else {
      contentToConvert = editorContent;
    }

    const fileName = getFileName({ options });
    const languageFormat = getDefinitionLanguage({ data: contentToConvert });
    const parserErrorExists = hasParserErrors({ errors: errSelectors.allErrors() });

    if (parserErrorExists && !overrideWarning) {
      // legacy method, if already yaml, displays confirm window if parser error
      if (languageFormat === 'yaml') {
        return {
          warning:
            'Swagger Editor is not able to parse your API definition. Are you sure you want to save the editor content as YAML?',
        };
      }
      // message for modal to display
      return {
        error:
          'Save as YAML is not currently possible because Swagger-Editor was not able to parse your API definiton.',
      };
    }

    if (languageFormat === 'yaml') {
      // content is already yaml, so download as-is
      getFileDownload({ blob: contentToConvert, filename: `${fileName}.yaml` });
      return { data: 'ok' };
    }
    // JSON String -> JS object
    const jsContent = YAML.load(contentToConvert);
    // JS Object -> YAML string
    const yamlContent = YAML.dump(jsContent);
    getFileDownload({ blob: yamlContent, filename: `${fileName}.yaml` });
    return { data: 'ok' };
  };

export default { saveAsJson, saveAsYaml, saveAsJsonResolved, saveAsYamlResolved };
