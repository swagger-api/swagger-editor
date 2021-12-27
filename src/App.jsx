import { PureComponent } from 'react';
import 'swagger-ui-react/swagger-ui.css';

import ide from './components/IdePreset';
import './components/_all.scss';

export default class App extends PureComponent {
  render() {
    return ide;
  }
}
