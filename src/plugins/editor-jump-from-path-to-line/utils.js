/**
 * apidom-ls.getJsonPointerPosition arg types
 * (document: TextDocument, path: string)
 */

import { getLanguageService } from '@swagger-api/apidom-ls';
import { TextDocument } from 'vscode-languageserver-textdocument';

export async function getJsonPointerPosition(editorSpec, jumpPath) {
  const apidomContext = {
    defaultLanguageContent: {
      namespace: 'asyncapi',
    },
  };
  const languageService = getLanguageService(apidomContext);
  try {
    // TODO: instead of recreating textDoc, can we retrieve from Monaco memory?
    const textDoc = TextDocument.create('foo://spec', 'yaml', 0, editorSpec);
    console.log('new textDoc:', textDoc);
    const result = await languageService.getJsonPointerPosition(textDoc, jumpPath);
    // console.log('getJsonPointerPosition result:', result);
    if (!result) {
      return { error: 'apidom-ls.getJsonPointerPosition result was null ' };
    }
    return { message: 'jsonPointerPosition found', data: result };
  } catch (e) {
    console.log('getJsonPointerPosition... catch error', e.message);
    return { error: 'getJsonPointerPosition...unknown catch error' };
  }
}

export default { getJsonPointerPosition };
