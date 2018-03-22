import React, { Component } from "react";
import { StyleProvider } from "native-base";

import App from "../App";
import getTheme from '../../native-base-theme/components';
import material from '../../native-base-theme/variables/material';

export default class Setup extends Component {
  render() {
    return (
      <StyleProvider style={getTheme(material)}>
        <App />
      </StyleProvider>
    );
  }
}

