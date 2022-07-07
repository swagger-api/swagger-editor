import Layout from './components/Layout/Layout.jsx';
import { requestIdleCallback, cancelIdleCallback } from './fn.js';
import { makeUseSplashScreen } from './hooks.js';

const LayoutPlugin = ({ getSystem }) => ({
  rootInjects: {
    useSplashScreen: makeUseSplashScreen(getSystem),
  },
  components: {
    SwaggerEditorLayout: Layout,
  },
  fn: {
    requestIdleCallback,
    cancelIdleCallback,
  },
});

export default LayoutPlugin;
