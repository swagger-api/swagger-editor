import selectOpenAPI310PetstoreYAML from './selectors/selectOpenAPI310PetstoreYAML.js';
import selectOpenAPI303PetstoreYAML from './selectors/selectOpenAPI303PetstoreYAML.js';
import selectOpenAPI20PetstoreYAML from './selectors/selectOpenAPI20PetstoreYAML.js';
import selectAsyncAPI260PetstoreYAML from './selectors/selectAsyncAPI260PetstoreYAML.js';
import selectAsyncAPI260StreetlightsYAML from './selectors/selectAsyncAPI260StreetlightsYAML.js';
import selectAPIDesignSystemsYAML from './selectors/selectAPIDesignSystemsYAML.js';
// test

const EditorContentFixturesPlugin = () => ({
  statePlugins: {
    editorContentFixtures: {
      selectors: {
        selectOpenAPI310PetstoreYAML,
        selectOpenAPI303PetstoreYAML,
        selectOpenAPI20PetstoreYAML,
        selectAsyncAPI260PetstoreYAML,
        selectAsyncAPI260StreetlightsYAML,
        selectAPIDesignSystemsYAML,
      },
    },
  },
});

export default EditorContentFixturesPlugin;
