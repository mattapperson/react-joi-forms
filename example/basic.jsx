import React from 'react';
import Component from '../src/component';

export default class Basic extends React.Component {

  render() {
    return (
      <Component />
    );
  }
}

React.render(<Basic />, document.getElementById('react'));
