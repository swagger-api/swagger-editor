import Layout from './components/Layout/Layout.jsx';
import { makeUseSplashScreen } from './hooks.js';

const LayoutPlugin = ({ getSystem }) => ({
  rootInjects: {
    useSplashScreen: makeUseSplashScreen(getSystem),
  },
  components: {
    SwaggerEditorLayout: Layout,
  },
});

export default LayoutPlugin;
