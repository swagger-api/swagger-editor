import * as monaco from 'monaco-editor';
import { StandaloneServices, IQuickInputService } from 'vscode/services';

const goToSymbolActionDescriptor = {
  id: 'editor.action.quickOutline',
  label: 'Go to Symbol...',
  precondition: 'editorHasDocumentSymbolProvider',
  contextMenuGroupId: 'navigation',
  contextMenuOrder: 3,
  keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyO], // eslint-disable-line no-bitwise
  async run() {
    StandaloneServices.get(IQuickInputService).quickAccess.show('@', {
      itemActivation: 0,
    });
  },
};

export default goToSymbolActionDescriptor;
