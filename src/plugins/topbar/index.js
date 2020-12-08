import Topbar from './components/Topbar';
import * as actions from './actions';
// import reducers from './reducers';
// import * as selectors from './selectors';

export default function topbarPlugin() {
  // const SET_OAS_GENERATOR_SERVERS_LIST = 'topbar_set_oas_generator_servers_list';
  return {
    statePlugins: {
      topbar: {
        // reducers,
        actions,
        // actions: {
        //   setOasGeneratorServersList({ value }) {
        //     return {
        //       type: 'SET_OAS_GENERATOR_SERVERS_LIST',
        //       payload: { value },
        //     };
        //   },
        // },
        // reducers: {
        //   [SET_OAS_GENERATOR_SERVERS_LIST]: (state, { payload: { value } }) => {
        //     console.log('gonna set reducer action, got value:', value);
        //     return state.set('servers', value);
        //   },
        // },
        // selectors,
        // actions: {
        //   showModal(name) {
        //     return {
        //       type: 'TOPBAR_SHOW_MODAL',
        //       target: name,
        //     };
        //   },
        //   hideModal(name) {
        //     return {
        //       type: 'TOPBAR_HIDE_MODAL',
        //       target: name,
        //     };
        //   },
        // },
        // reducers: {
        //   TOPBAR_SHOW_MODAL: (state, action) => state.setIn(['shownModals', action.target], true),
        //   TOPBAR_HIDE_MODAL: (state, action) => state.setIn(['shownModals', action.target], false),
        // },
        // selectors: {
        //   showModal: (state, name) => state.getIn(['shownModals', name], false),
        // },
      },
    },
    components: {
      Topbar,
    },
  };
}
