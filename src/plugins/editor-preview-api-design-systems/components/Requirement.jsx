import PropTypes from 'prop-types';
import { RequirementElement } from '@swagger-api/apidom-ns-api-design-systems'; // eslint-disable-line

const Requirement = ({ adsSelectors, element }) => {
  const subject = adsSelectors.selectStandardIdentifier({ standardIdentifier: element.subject });
  const level = adsSelectors.selectRequirementLevel({ requirementElement: element });
  const values = adsSelectors.selectRequirementValues({ requirementElement: element });

  return (
    <tr className="property-row">
      <td>{subject}</td>
      <td>
        <span className="prop-type">{level}</span>
      </td>
      <td>
        <span className="property-primitive">{values}</span>
      </td>
    </tr>
  );
};

Requirement.propTypes = {
  element: PropTypes.instanceOf(RequirementElement).isRequired,
  adsSelectors: PropTypes.shape({
    selectStandardIdentifier: PropTypes.func.isRequired,
    selectRequirementLevel: PropTypes.func.isRequired,
    selectRequirementValues: PropTypes.func.isRequired,
  }).isRequired,
};

export default Requirement;
