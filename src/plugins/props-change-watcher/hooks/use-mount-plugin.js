import { useRef } from 'react';

import pluginImpl from '../plugin-impl.js';

const useMountPlugin = () => {
  const system = useRef(null);

  return {
    plugin(sys) {
      system.current = sys.getSystem();
      return pluginImpl;
    },
    getSystem() {
      return system.current;
    },
  };
};

export default useMountPlugin;
