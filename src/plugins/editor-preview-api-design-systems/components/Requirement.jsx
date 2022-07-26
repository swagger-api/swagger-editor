import PropTypes from 'prop-types';
import { RequirementElement } from '@swagger-api/apidom-ns-api-design-systems';

const Requirement = ({ editorPreviewADSSelectors, element }) => {
  const subject = editorPreviewADSSelectors.selectStandardIdentifier({
    standardIdentifier: element.subject,
  });
  const level = editorPreviewADSSelectors.selectRequirementLevel({ requirementElement: element });
  const values = editorPreviewADSSelectors.selectRequirementValues({ requirementElement: element });

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
  editorPreviewADSSelectors: PropTypes.shape({
    selectStandardIdentifier: PropTypes.func.isRequired,
    selectRequirementLevel: PropTypes.func.isRequired,
    selectRequirementValues: PropTypes.func.isRequired,
  }).isRequired,
};

export default Requirement;
