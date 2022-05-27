import Modal from './components/Modal.jsx';
import ModalHeader from './components/ModalHeader.jsx';
import ModalTitle from './components/ModalTitle.jsx';
import ModalBody from './components/ModalBody.jsx';
import ModalFooter from './components/ModalFooter.jsx';
import { useReactModal } from './hooks.js';

const ModalsPlugin = () => ({
  rootInjects: {
    useSwaggerEditorReactModal: useReactModal,
  },
  components: {
    Modal,
    ModalHeader,
    ModalTitle,
    ModalBody,
    ModalFooter,
  },
});

export default ModalsPlugin;
