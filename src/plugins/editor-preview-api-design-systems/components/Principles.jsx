import PropTypes from 'prop-types';

const Principles = ({ editorPreviewADSSelectors, getComponent }) => {
  const principlesCount = editorPreviewADSSelectors.selectPrinciplesCount();
  const principles = editorPreviewADSSelectors.selectPrinciples();
  const Principle = getComponent('ADSPrinciple');

  return (
    <div className="no-margin">
      <div className="opblock opblock-post is-open">
        <div className="opblock-summary opblock-summary-post">
          <span
            className="opblock-summary-method"
            style={{ paddingLeft: '6px', paddingRight: '6px' }}
          >
            {principlesCount} Principles
          </span>
        </div>
        <div className="no-margin">
          <div className="opblock-body">
            <div className="opblock-description-wrapper">
              <div className="opblock-description">
                <div className="markdown">
                  <p>Principles guide how decisions in API design and delivery should be made.</p>
                </div>
              </div>
            </div>
            <div className="opblock-section">
              <div className="parameters-container">
                <div className="table-container">
                  <table className="model ads-principles">
                    <thead>
                      <tr>
                        <th className="col_header" style={{ width: '50%' }}>
                          Internationalized Resource Identifiers
                        </th>
                        <th className="col_header" style={{ width: '20%' }}>
                          level
                        </th>
                        <th className="col_header">Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {principles.map((principle) => (
                        <Principle
                          key={principle.iri}
                          name={principle.name}
                          iri={principle.iri}
                          level={principle.level}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Principles.propTypes = {
  getComponent: PropTypes.func.isRequired,
  editorPreviewADSSelectors: PropTypes.shape({
    selectPrinciplesCount: PropTypes.func.isRequired,
    selectPrinciples: PropTypes.func.isRequired,
  }).isRequired,
};

export default Principles;
