/**
 * Dialogs inform users about a task and can contain critical information,
 * require decisions, or involve multiple tasks.
 *
 * A Dialog is a type of modal window that appears in front of app content to provide
 * critical information or ask for a decision. Dialogs disable all app functionality when they appear,
 * and remain on screen until confirmed, dismissed, or a required action has been taken. *
 */

import AlertDialog from './components/AlertDialog.jsx';
import ConfirmDialog from './components/ConfirmDialog.jsx';

const DialogsPlugin = () => ({
  components: {
    AlertDialog,
    ConfirmDialog,
  },
});

export default DialogsPlugin;
