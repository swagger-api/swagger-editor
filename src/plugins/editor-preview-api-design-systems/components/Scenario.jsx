import PropTypes from 'prop-types';
import { ScenarioElement } from '@swagger-api/apidom-ns-api-design-systems'; // eslint-disable-line

const Scenario = ({ getComponent, adsSelectors, element }) => {
  const scenarioName = adsSelectors.selectStandardIdentifier({ standardIdentifier: element.when });
  const description = adsSelectors.selectScenarioDescription({ scenarioElement: element });
  const requirements = adsSelectors.selectScenarioRequirements({ scenarioElement: element });
  const Requirement = getComponent('ADSRequirement', true);

  return (
    <div className="modal-container">
      <span className="model-box" style={{ display: 'block' }}>
        <button
          type="button"
          aria-expanded="false"
          className="model-box-control"
          style={{ width: '100%' }}
        >
          <span className="pointer">
            <span className="model-box">
              <span className="model model-title">
                <strong>Scenario: </strong> {scenarioName}
              </span>
            </span>
          </span>

          <div className="description">
            <div className="markdown">
              <p>{description}</p>
            </div>
          </div>

          <div className="table-container">
            <table className="model">
              <thead>
                <tr>
                  <th className="col_header" style={{ width: '50%' }}>
                    Subject
                  </th>
                  <th className="col_header">Level</th>
                  <th className="col_header" style={{ width: '40%' }}>
                    Values
                  </th>
                </tr>
              </thead>
              <tbody>
                {requirements.map((requirementElement, index) => {
                  // eslint-disable-next-line react/no-array-index-key
                  return <Requirement key={index} element={requirementElement} />;
                })}
              </tbody>
            </table>
          </div>
        </button>
      </span>
    </div>
  );
};

Scenario.propTypes = {
  element: PropTypes.instanceOf(ScenarioElement).isRequired,
  getComponent: PropTypes.func.isRequired,
  adsSelectors: PropTypes.shape({
    selectStandardIdentifier: PropTypes.func.isRequired,
    selectScenarioDescription: PropTypes.func.isRequired,
    selectScenarioRequirements: PropTypes.func.isRequired,
  }).isRequired,
};

export default Scenario;
