import PropTypes from 'prop-types';

const Info = ({ adsSelectors }) => {
  const version = adsSelectors.selectVersion();
  const info = adsSelectors.selectInfo();
  const principles = adsSelectors.selectPrinciplesCount();
  const standards = adsSelectors.selectStandardsCount();
  const scenarios = adsSelectors.selectScenariosCount();

  if (info === null) return null;

  return (
    <div className="info">
      <hgroup className="main">
        <h2 className="title">
          {info.title}
          <span>
            <small>
              <pre className="version">{version}</pre>
            </small>
            <small className="version-stamp">
              <pre className="version">ADS</pre>
            </small>
          </span>
        </h2>
      </hgroup>
      <hgroup className="main title">
        <span>
          <small className="summary-pill">
            <pre className="version"> {principles} Principles</pre>
          </small>
          <small className="summary-pill">
            <pre className="version"> {standards} Standards</pre>
          </small>
          <small className="summary-pill">
            <pre className="version"> {scenarios} Scenarios</pre>
          </small>
        </span>
      </hgroup>

      <div className="description">
        <div className="renderedMarkdown">
          <p>{info.description}</p>
        </div>
      </div>
    </div>
  );
};

Info.propTypes = {
  adsSelectors: PropTypes.shape({
    selectVersion: PropTypes.func.isRequired,
    selectInfo: PropTypes.func.isRequired,
    selectPrinciplesCount: PropTypes.func.isRequired,
    selectStandardsCount: PropTypes.func.isRequired,
    selectScenariosCount: PropTypes.func.isRequired,
  }).isRequired,
};

export default Info;
