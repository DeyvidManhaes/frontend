// Instituto.js

import React, { Component } from 'react';
import Menu from '../menu/Menu'; // Corrigindo o caminho do componente Menu
import Rodape from '../rodape/Rodape'; // Corrigindo o caminho do componente Rodape
import InstitutoList from './InstitutoList'; // Corrigindo o caminho do componente InstitutoList
import InstitutoForm from './InstitutoForm'; // Corrigindo o caminho do componente InstitutoForm
import { Routes, Route } from 'react-router-dom'; // Removendo BrowserRouter

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


