import PropTypes from 'prop-types';

const Main = ({ getComponent }) => {
  const Info = getComponent('ADSInfo', true);
  const Principles = getComponent('ADSPrinciples', true);
  const Standards = getComponent('ADSStandards', true);
  const Scenarios = getComponent('ADSScenarios', true);

  return (
    <section className="editor-preview editor-preview--ads swagger-ui swagger-container">
      <div className="swagger-ui">
        <div className="information-container wrapper">
          <section className="block col-12">
            <Info />
            <Principles />
            <Standards />
            <Scenarios />
            <br />
          </section>
        </div>
      </div>
    </section>
  );
};

Main.propTypes = {
  getComponent: PropTypes.func.isRequired,
};

export default Main;
