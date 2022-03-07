import Layout from './components/Layout/Layout.jsx';
import { useReactModal } from './hooks.js';

const LayoutPlugin = () => ({
  rootInjects: {
    useSwaggerIDEReactModal: useReactModal,
  },
  components: {
    SwaggerIDELayout: Layout,
  },
});

export default LayoutPlugin;
