import React, { Component } from 'react';
import Menu from './menu/Menu';
import Home from './home/Home'; 
import Rodape from './rodape/Rodape';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Instituto from './instituto/Instituto';
import InstitutoForm from './instituto/InstitutoForm';
import Producao from './producao/Producao';
import Grafo from './grafo/Grafo';

export default class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Menu />
          <Routes> 
            <Route exact path="/" element={<Home />} /> {/* Usando chaves para Home */}
            <Route path="/instituto" element={<Instituto />} />
            <Route path="/producao" element={<Producao />} />
            <Route path="/grafo" element={<Grafo />} />
            <Route exact path="/instituto/novo" element={<InstitutoForm/>} />
          </Routes> 
          <Rodape/>
        </div>
      </Router>
    )
  }
}

