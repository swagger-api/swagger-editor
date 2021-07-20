// eslint-disable-next-line no-unused-vars
import React, { Component, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export default class GeneratorMenuDropdown extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      clients: [],
      servers: [],
      specVersion: '',
    };
  }

  componentDidMount() {
    this.instantiateGeneratorClient();
  }

  componentDidUpdate() {
    this.shouldReInstantiateGeneratorClient();
  }

  instantiateGeneratorClient = async () => {
    const { topbarActions } = this.props;

    const instantiate = await topbarActions.instantiateGeneratorClient();
    if (instantiate && instantiate.error) {
      // probably should not display error
      return;
    }
    if (instantiate) {
      // intended as temporary setState, prefer set a redux state instead
      this.setState({
        clients: instantiate.clients,
        servers: instantiate.servers,
        specVersion: instantiate.specVersion,
      });
    }
  };

  shouldReInstantiateGeneratorClient = () => {
    // for live e2e test: oas3 will NOT include 'ada-server' as a list item
    const { topbarActions } = this.props;
    const { specVersion } = this.state;
    const shouldReinstantiate = topbarActions.shouldReInstantiateGeneratorClient({ specVersion });
    // expect shouldReinstantiate to be boolean
    if (shouldReinstantiate) {
      this.instantiateGeneratorClient();
    }
  };

  onDownloadGeneratedFileClick = async ({ type, name }) => {
    // ref legacy methods: downloadGeneratedFile -> handleResponse -> downloadFile -> reactFileDownload (lib)
    const { topbarActions } = this.props;
    const downloadData = await topbarActions.downloadGeneratedFile({
      type,
      name,
    });
    if (downloadData.error) {
      // display the error message
      console.log('generator download error:', downloadData.error);
    }
  };

  render() {
    const { servers, clients } = this.state;
    const { getComponent } = this.props;

    const DropdownMenu = getComponent('DropdownMenu');
    const DropdownItem = getComponent('DropdownItem');
    const shouldDisplayGeneratorLists = servers.length > 0 && clients.length > 0;

    return !shouldDisplayGeneratorLists ? null : (
      <div className="topbar-sub-group">
        <DropdownMenu displayName="Generate Server">
          {servers.map((server, i) => (
            <DropdownItem
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              onClick={() =>
                this.onDownloadGeneratedFileClick({ type: 'server', name: `${server}` })
              }
              name={server}
            />
          ))}
        </DropdownMenu>
        <DropdownMenu displayName="Generate Client">
          {clients.map((client, i) => (
            <DropdownItem
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              onClick={() =>
                this.onDownloadGeneratedFileClick({ type: 'client', name: `${client}` })
              }
              name={client}
            />
          ))}
        </DropdownMenu>
      </div>
    );
  }
}

// Todo: below as function, for react hooks
// export default function GeneratorMenuDropdown(props) {
//   const [clients, setClients] = useState([]);
//   const [servers, setServers] = useState([]);
//   const [specVersion, setSpecVersion] = useState('');

//   const instantiateGeneratorClient = async () => {
//     const { topbarActions } = props;

//     const instantiate = await topbarActions.instantiateGeneratorClient();
//     if (instantiate && instantiate.error) {
//       // probably should not display error
//       return;
//     }
//     if (instantiate) {
//       // intended as temporary setState, prefer set a redux state instead
//       // this.setState({
//       //   clients: instantiate.clients,
//       //   servers: instantiate.servers,
//       //   specVersion: instantiate.specVersion,
//       // });
//       if (instantiate.clients) {
//         setClients(instantiate.clients);
//       }
//       if (instantiate.servers) {
//         setServers(instantiate.servers);
//       }
//       if (instantiate.specVersion) {
//         setSpecVersion(instantiate.specVersion);
//       }
//     }
//   };

//   const shouldReInstantiateGeneratorClient = () => {
//     // for live e2e test: oas3 will NOT include 'ada-server' as a list item
//     const { topbarActions } = props;
//     // const { specVersion } = this.state;
//     const shouldReinstantiate = topbarActions.shouldReInstantiateGeneratorClient({ specVersion });
//     // expect shouldReinstantiate to be boolean
//     if (shouldReinstantiate) {
//       instantiateGeneratorClient();
//     }
//   };

//   const onDownloadGeneratedFileClick = async ({ type, name }) => {
//     // ref legacy methods: downloadGeneratedFile -> handleResponse -> downloadFile -> reactFileDownload (lib)
//     const { topbarActions } = props;
//     const downloadData = await topbarActions.downloadGeneratedFile({
//       type,
//       name,
//     });
//     if (downloadData.error) {
//       // display the error message
//     }
//   };

//   useEffect(() => {
//     // instantiateGeneratorClient();
//     shouldReInstantiateGeneratorClient();
//   });

//   const { getComponent } = props;

//   const DropdownMenu = getComponent('DropdownMenu');
//   const DropdownItem = getComponent('DropdownItem');

//   return (
//     <div className="topbar-sub-group">
//       <DropdownMenu displayName="Generate Server">
//         {servers.map((server, i) => (
//           <DropdownItem
//             key={i}
//             onClick={() => onDownloadGeneratedFileClick({ type: 'server', name: `${server}` })}
//             name={server}
//           />
//         ))}
//       </DropdownMenu>
//       <DropdownMenu displayName="Generate Client">
//         {clients.map((client, i) => (
//           <DropdownItem
//             key={i}
//             onClick={() => onDownloadGeneratedFileClick({ type: 'client', name: `${client}` })}
//             name={client}
//           />
//         ))}
//       </DropdownMenu>
//     </div>
//   );
// }

GeneratorMenuDropdown.propTypes = {
  topbarActions: PropTypes.oneOfType([PropTypes.object]).isRequired,
  getComponent: PropTypes.func.isRequired,
};
