import React, { Component, PropTypes } from "react";
import '../css/normalize.css';
import 'react-select/dist/react-select.css';
import '../css/react_tel_input.css';
import '../css/common.css';
import '../css/common_forms.css';

class App extends Component {
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.object.isRequired
}

export default App;
