import PropTypes from 'prop-types';

const Standards = ({ editorPreviewADSSelectors, getComponent }) => {
  const standardsCount = editorPreviewADSSelectors.selectStandardsCount();
  const standards = editorPreviewADSSelectors.selectStandards();
  const Standard = getComponent('ADSStandard');

  return (
    <div className="no-margin">
      <div className="opblock opblock-get is-open">
        <div className="opblock-summary opblock-summary-get">
          <span
            className="opblock-summary-method"
            style={{ paddingLeft: '6px', paddingRight: '6px' }}
          >
            {standardsCount} Standards
          </span>
        </div>
        <div className="no-margin">
          <div className="opblock-body">
            <div className="opblock-description-wrapper">
              <div className="opblock-description">
                <div className="markdown">
                  <p>
                    Standards are industry best practices (e.g. RFCs) that shall influence the rules
                    for API design.
                  </p>
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
                      {standards.map((principle) => (
                        <Standard
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

Standards.propTypes = {
  getComponent: PropTypes.func.isRequired,
  editorPreviewADSSelectors: PropTypes.shape({
    selectStandardsCount: PropTypes.func.isRequired,
    selectStandards: PropTypes.func.isRequired,
  }).isRequired,
};

export default Standards;
