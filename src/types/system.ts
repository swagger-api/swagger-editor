import { PropChangedAction } from 'plugins/props-change-watcher/actions';
import { Action } from 'types/actions';

export interface SystemValues {
  getComponent: () => void;
  editorSelectors: {
    selectContent: () => string;
    selectInferFileNameWithExtensionFromContent: () => string;
  };
  editorActions: {
    convertContentToJSON: (content: string) => Action<string>;
    setContent: (content: string) => Action<string>;
    propChanged: PropChangedAction;
  };
  EditorContentOrigin: {
    Conversion: 'conversion';
  };
}

export interface System extends SystemValues {
  getSystem: () => SystemValues;
}
