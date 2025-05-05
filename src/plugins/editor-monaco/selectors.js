import * as monaco from 'monaco-editor';
import { createSelector } from 'reselect';
import { List } from 'immutable';

export const selectTheme = (state) => state.get('theme', 'se-vs-dark');

export const selectMarkers = createSelector(
  (state) => state.get('markers', List()),
  (markers) => markers.toJS()
);

export const selectLanguage = (state) => state.get('language', 'plaintext');

export const selectEditor = () => (system) => {
  const id = system.editorSelectors.selectId();
  return monaco.editor.getEditors().find((editor) => editor.getId() === id);
};

export const selectEditorWidth = () => (system) => {
  const editor = system.editorSelectors.selectEditor();
  const { width } = editor.getLayoutInfo();
  return width;
};

export const selectModelVersionId = (state) => state.get('versionId', null);

export const selectModelAlternativeVersionId = (state) => state.get('alternativeVersionId', null);
