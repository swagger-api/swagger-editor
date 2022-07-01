import JumpToPath from './components/JumpToPath.jsx';
import { getSpecLineFromPath, bestJumpPath } from './selectors.js';

const JumpFromPathToLine = () => ({
  components: {
    JumpToPath,
  },
  statePlugins: {
    spec: {
      selectors: {
        getSpecLineFromPath,
        bestJumpPath,
      },
    },
  },
});

export default JumpFromPathToLine;
