import JumpToPath from './components/JumpToPath.jsx';
import { bestJumpPath } from './selectors.js';

const EditorJumpFromPathToLine = () => ({
  components: {
    JumpToPath,
  },
  statePlugins: {
    spec: {
      selectors: {
        bestJumpPath,
      },
    },
  },
});

export default EditorJumpFromPathToLine;
