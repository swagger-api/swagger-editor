import Topbar from "./components/Topbar"
import AboutMenu from "./components/AboutMenu"

export default function() {
  return {
    statePlugins: {
      topbar: {
        actions: {
          showModal(name) {
            return {
              type: "TOPBAR_SHOW_MODAL",
              target: name
            }
          },
          hideModal(name) {
            return {
              type: "TOPBAR_HIDE_MODAL",
              target: name
            }
          },
          switchSpectralVersion(version) {
            return {
              type: "SWITCH_SPECTRAL_VERSION",
              version
            }
          }
        },
        reducers: {
          TOPBAR_SHOW_MODAL: (state, action) => state.setIn(["shownModals", action.target], true),
          TOPBAR_HIDE_MODAL: (state, action) => state.setIn(["shownModals", action.target], false),
          SWITCH_SPECTRAL_VERSION: (state, action) => state.setIn(["spectralVersion"], action.version)
        },
        selectors: {
          showModal: (state, name) => state.getIn(["shownModals", name], false),
          spectralVersion: (state) => state.getIn(["spectralVersion"], "v5")
        }
      }
    },
    components: {
      Topbar,
      TopbarAboutMenu: AboutMenu,
    }
  }
}
