import selectOpenAPI310PetstoreYAML from './selectors/selectOpenAPI310PetstoreYAML.js';
import selectOpenAPI303PetstoreYAML from './selectors/selectOpenAPI303PetstoreYAML.js';
import selectOpenAPI20PetstoreYAML from './selectors/selectOpenAPI20PetstoreYAML.js';
import selectAsyncAPI250PetstoreYAML from './selectors/selectAsyncAPI250PetstoreYAML.js';
import selectAsyncAPI250StreetlightsYAML from './selectors/selectAsyncAPI250StreetlightsYAML.js';
import selectAPIDesignSystemsYAML from './selectors/selectAPIDesignSystemsYAML.js';
// test

const EditorContentFixturesPlugin = () => ({
  statePlugins: {
    editorContentFixtures: {
      selectors: {
        selectOpenAPI310PetstoreYAML,
        selectOpenAPI303PetstoreYAML,
        selectOpenAPI20PetstoreYAML,
        selectAsyncAPI250PetstoreYAML,
        selectAsyncAPI250StreetlightsYAML,
        selectAPIDesignSystemsYAML,
      },
    },
  },
});

export default EditorContentFixturesPlugin;
