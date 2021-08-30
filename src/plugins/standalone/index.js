// This is where we import the topbar component
// and wrap state plugins, component
import TopbarPlugin from '../topbar';
import StandaloneLayout from './components/StandaloneLayout';

const StandalonePlugin = () => {
  return {
    components: {
      StandaloneLayout,
    },
  };
};

// should load into swagger-ui as a 'preset'
export default function standalonePreset() {
  return [
    TopbarPlugin,
    // TopbarInsertPlugin,
    StandalonePlugin,
  ];
}
