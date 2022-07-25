import PropTypes from 'prop-types';

const Principle = ({ name, iri, level }) => {
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

Principle.propTypes = {
  name: PropTypes.string,
  iri: PropTypes.string.isRequired,
  level: PropTypes.string.isRequired,
};

Principle.defaultProps = {
  name: '',
};

export default Principle;
