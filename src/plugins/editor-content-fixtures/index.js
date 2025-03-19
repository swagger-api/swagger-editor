import selectOpenAPI311PetstoreYAML from './selectors/selectOpenAPI311PetstoreYAML.js';
import selectOpenAPI304PetstoreYAML from './selectors/selectOpenAPI304PetstoreYAML.js';
import selectOpenAPI20PetstoreYAML from './selectors/selectOpenAPI20PetstoreYAML.js';
import selectAsyncAPI260PetstoreYAML from './selectors/selectAsyncAPI260PetstoreYAML.js';
import selectAsyncAPI300PetstoreYAML from './selectors/selectAsyncAPI300PetstoreYAML.js';
import selectAsyncAPI260StreetlightsYAML from './selectors/selectAsyncAPI260StreetlightsYAML.js';
import selectAsyncAPI300StreetlightsYAML from './selectors/selectAsyncAPI300StreetlightsYAML.js';
import selectAPIDesignSystemsYAML from './selectors/selectAPIDesignSystemsYAML.js';
// test

const EditorContentFixturesPlugin = () => ({
  statePlugins: {
    editorContentFixtures: {
      selectors: {
        selectOpenAPI311PetstoreYAML,
        selectOpenAPI304PetstoreYAML,
        selectOpenAPI20PetstoreYAML,
        selectAsyncAPI260PetstoreYAML,
        selectAsyncAPI300PetstoreYAML,
        selectAsyncAPI260StreetlightsYAML,
        selectAsyncAPI300StreetlightsYAML,

        selectAPIDesignSystemsYAML,
      },
    },
  },
});

export default EditorContentFixturesPlugin;
