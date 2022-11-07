import Topbar from "./components/Topbar"

export default function () {
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
          }
        },
        reducers: {
          TOPBAR_SHOW_MODAL: (state, action) => state.setIn(["shownModals", action.target], true),
          TOPBAR_HIDE_MODAL: (state, action) => state.setIn(["shownModals", action.target], false),
        },
        selectors: {
          showModal: (state, name) => state.getIn(["shownModals", name], false)
        }
      }
    },
    components: {
      Topbar,
    }
  }
}
