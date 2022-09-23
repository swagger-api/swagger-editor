import { getLanguageService } from '@swagger-api/apidom-ls';
import { TextDocument } from 'vscode-languageserver-textdocument';

export async function requestGetJsonPointerPosition(editor, jsonPointer) {
  const apidomContext = {
    defaultLanguageContent: {
      namespace: 'asyncapi',
    },
  };
  const languageService = getLanguageService(apidomContext);

  try {
    const textDoc = TextDocument.create(
      editor.getModel().uri.toString(),
      // editor.getModel().getModeId(), // undefined; so hardcoding `yaml`
      'yaml',
      editor.getModel().getVersionId(),
      editor.getModel().getValue()
    );
    const result = await languageService.getJsonPointerPosition(textDoc, jsonPointer);
    if (!result) {
      return { error: 'an error has occured for: getJsonPointerPosition' };
    }
    const { line, character } = result;
    // map to Monaco interface
    const offset = 1;
    const monacoPosition = { startLineNumber: line, startColumn: character - offset };
    return { data: monacoPosition };
  } catch (e) {
    return { error: e.message };
  } finally {
    languageService.terminate();
  }
}

export default { requestGetJsonPointerPosition };
