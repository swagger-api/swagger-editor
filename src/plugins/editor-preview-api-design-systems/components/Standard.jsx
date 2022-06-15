import PropTypes from 'prop-types';

const Standard = ({ name, iri, level }) => {
  return (
    <tr>
      <td>
        <span className="property-primitivetype">{iri}</span>
      </td>
      <td>
        <span className="prop-type">{level}</span>
      </td>
      <td>{name}</td>
    </tr>
  );
};

Standard.propTypes = {
  name: PropTypes.string,
  iri: PropTypes.string.isRequired,
  level: PropTypes.string.isRequired,
};

Standard.defaultProps = {
  name: '',
};

export default Standard;
