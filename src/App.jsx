// This is for a bundled standalone App
import { PureComponent } from 'react';

import ide from './lib/components/IdePreset';

import 'swagger-ui-react/swagger-ui.css';
import './lib/components/_all.scss';

export default class App extends PureComponent {
  render() {
    return ide;
  }
}
