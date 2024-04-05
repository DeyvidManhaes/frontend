// Instituto.js

import React, { Component } from 'react';
import InstitutoList from './InstitutoList'; // Corrigindo o caminho do componente InstitutoList


export default class Instituto extends Component {
  render() {
    return (
      <div className='p-2 mt-5'>
        
        <h1>CRUD de Instituto</h1>
        <InstitutoList />
        
      </div>
    );
  }
}


