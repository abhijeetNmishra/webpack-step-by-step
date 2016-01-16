import React from 'react';
import ReactDOM from 'react-dom';
import MyComponent from './MyComponent';

// load the stylesheet
require('../styles/main.scss');

ReactDOM.render(
  <MyComponent />, document.getElementById('main')
);
