import selectOpenAPI310PetstoreYAML from './selectors/selectOpenAPI310PetstoreYAML.js';
import selectOpenAPI304PetstoreYAML from './selectors/selectOpenAPI304PetstoreYAML.js';
import selectOpenAPI20PetstoreYAML from './selectors/selectOpenAPI20PetstoreYAML.js';
import selectAsyncAPI260PetstoreYAML from './selectors/selectAsyncAPI260PetstoreYAML.js';
import selectAsyncAPI300PetstoreYAML from './selectors/selectAsyncAPI300PetstoreYAML.js';
import selectAsyncAPI260StreetlightsYAML from './selectors/selectAsyncAPI260StreetlightsYAML.js';
import selectAsyncAPI300StreetlightsYAML from './selectors/selectAsyncAPI300StreetlightsYAML.js';
import selectJSONSchema202012YAML from './selectors/selectJSONSchema202012YAML.js';
import selectAPIDesignSystemsYAML from './selectors/selectAPIDesignSystemsYAML.js';
// test

const EditorContentFixturesPlugin = () => ({
  statePlugins: {
    editorContentFixtures: {
      selectors: {
        selectOpenAPI310PetstoreYAML,
        selectOpenAPI304PetstoreYAML,
        selectOpenAPI20PetstoreYAML,
        selectAsyncAPI260PetstoreYAML,
        selectAsyncAPI300PetstoreYAML,
        selectAsyncAPI260StreetlightsYAML,
        selectAsyncAPI300StreetlightsYAML,
        selectJSONSchema202012YAML,
        selectAPIDesignSystemsYAML,
      },
    },
  },
});

export default EditorContentFixturesPlugin;
