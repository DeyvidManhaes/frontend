import React, { Component } from 'react';
import Menu from './menu/Menu';
import Home from './home/Home'; 
import Rodape from './rodape/Rodape';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Instituto from './instituto/Instituto';
import Producao from './producao/Producao';
import Grafo from './grafo/Grafo';
import Pesquisador from './pesquisador/Pesquisador';

export default class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Menu />
          <Routes> 
            <Route exact path="/" element={<Home />} /> {/* Usando chaves para Home */}
            <Route path="/instituto" element={<Instituto />} />
            <Route path="/pesquisador" element={<Pesquisador/>} />
            <Route path="/producao" element={<Producao />} />
            <Route path="/grafo" element={<Grafo />} />
          </Routes> 
          <Rodape/>
        </div>
      </Router>
    )
  }
}

