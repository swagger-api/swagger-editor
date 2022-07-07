// eslint-disable-next-line import/no-unresolved
import loader from '../../assets/loader.gif?raw';

const SplashScreenSpinner = () => (
  <img
    width="25"
    height="25"
    className="swagger-editor__splash-screen-spinner"
    src={loader}
    alt="Loading..."
  />
);

export default SplashScreenSpinner;
