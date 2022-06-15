import PropTypes from 'prop-types';

const Scenarios = ({ getComponent, adsSelectors }) => {
  const scenariosCount = adsSelectors.selectScenariosCount();
  const scenarios = adsSelectors.selectScenarios();
  const Scenario = getComponent('ADSScenario', true);

  return (
    <section className="block col-12 block-desktop col-12-desktop">
      <section className="models is-open">
        <h4>
          <button type="button" aria-expanded="true" className="models-control">
            <span>{scenariosCount} Governance Scenarios</span>
            <svg width="20" height="20" aria-hidden="true" focusable="false" />
          </button>
        </h4>

        <div className="no-margin">
          {scenarios.map((scenarioElement) => {
            const key = adsSelectors.selectStandardIdentifier({
              standardIdentifier: scenarioElement.when,
            });
            return <Scenario key={key} element={scenarioElement} />;
          })}
        </div>
      </section>
    </section>
  );
};

Scenarios.propTypes = {
  adsSelectors: PropTypes.shape({
    selectScenariosCount: PropTypes.func.isRequired,
    selectScenarios: PropTypes.func.isRequired,
    selectStandardIdentifier: PropTypes.func.isRequired,
  }).isRequired,
  getComponent: PropTypes.func.isRequired,
};

export default Scenarios;
