import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const GeneratorMenuDropdownHooks = (props) => {
  const { getComponent, topbarActions, topbarSelectors } = props;
  const hasMounted = useRef(false);
  const [shouldDisplayGeneratorLists, setShouldDisplayGeneratorLists] = useState(false);
  const [servers, setServers] = useState([]);
  const [clients, setClients] = useState([]);
  const [specVersion, setSpecVersion] = useState([]);

  useEffect(() => {
    const instantiateGeneratorClient = async () => {
      const instantiate = await topbarActions.instantiateGeneratorClient();
      if (instantiate && instantiate.error) {
        // probably should not display error
        return;
      }
      if (instantiate) {
        setServers(instantiate.servers);
        setClients(instantiate.clients);
        setSpecVersion(instantiate.specVersion);
      }
    };
    const shouldReInstantiateGeneratorClient = () => {
      // for live e2e test: oas3 will NOT include 'ada-server' as a list item
      const shouldReinstantiate = topbarSelectors.selectShouldReInstantiateGeneratorClient({
        specVersion,
      });
      // expect shouldReinstantiate to be boolean
      if (shouldReinstantiate) {
        instantiateGeneratorClient();
      }
    };
    if (!hasMounted.current) {
      hasMounted.current = true;
      // do init
      instantiateGeneratorClient();
      return;
    }
    shouldReInstantiateGeneratorClient();
  }, [servers, clients, specVersion, topbarActions, topbarSelectors]);

  useEffect(() => {
    if (servers.length > 0 && clients.length > 0) {
      setShouldDisplayGeneratorLists(true);
    } else {
      setShouldDisplayGeneratorLists(false);
    }
  }, [shouldDisplayGeneratorLists, servers, clients]);

  const handleDownloadGeneratedFileClick = ({ type, name }) => {
    async function downloadAsset() {
      const downloadData = await topbarActions.downloadGeneratedFile({
        type,
        name,
      });
      if (downloadData.error) {
        // may display the error message
      }
    }
    // call the async/await function
    downloadAsset({ type, name });
  };

  const DropdownMenu = getComponent('DropdownMenu');
  const DropdownItem = getComponent('DropdownItem');

  return !shouldDisplayGeneratorLists ? null : (
    <div className="topbar-sub-group">
      <DropdownMenu displayName="Generate Server">
        {servers.map((server, i) => (
          <DropdownItem
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            onClick={() => handleDownloadGeneratedFileClick({ type: 'server', name: `${server}` })}
            name={server}
          />
        ))}
      </DropdownMenu>
      <DropdownMenu displayName="Generate Client">
        {clients.map((client, i) => (
          <DropdownItem
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            onClick={() => handleDownloadGeneratedFileClick({ type: 'client', name: `${client}` })}
            name={client}
          />
        ))}
      </DropdownMenu>
    </div>
  );
};

GeneratorMenuDropdownHooks.propTypes = {
  topbarActions: PropTypes.oneOfType([PropTypes.object]).isRequired,
  topbarSelectors: PropTypes.oneOfType([PropTypes.object]).isRequired,
  getComponent: PropTypes.func.isRequired,
};

export default GeneratorMenuDropdownHooks;
