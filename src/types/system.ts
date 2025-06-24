import { PropChangedAction } from 'plugins/props-change-watcher/actions';
import { Action } from 'types/actions';
import { ComponentType } from 'react';

export interface SystemValues {
  getComponent: (
    componentName: string,
    container?: boolean,
    config?: object
  ) => ComponentType | null;
  editorSelectors: {
    selectContent: () => string;
    selectInferFileNameWithExtensionFromContent: () => string;
  };
  editorActions: {
    convertContentToJSON: (content: string) => Action<string | Error>;
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
