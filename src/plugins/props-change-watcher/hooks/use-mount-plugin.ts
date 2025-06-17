import { useRef } from 'react';
import { GetSystemValues, System } from 'types/system';

import pluginImpl from '../plugin-impl';

const useMountPlugin = () => {
  const system = useRef<null | GetSystemValues>(null);

  return {
    plugin(sys: System) {
      system.current = sys.getSystem();
      return pluginImpl;
    },
    getSystem() {
      return system.current;
    },
  };
};

export default useMountPlugin;
