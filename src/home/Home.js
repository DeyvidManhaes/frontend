import React, { Component } from 'react';
import Menu from '../menu/Menu';
import { TextField, Button, Table, TableHead, TableBody, TableCell, TableRow } from '@mui/material';
import '../home/Home.css'; // Arquivo de estilos para a página Home

export default class Home extends Component {
  render() {
    return (
      <div>
        {/* Importando e apresentando o componente Menu */}
        <Menu />

        {/* Título na parte superior da página */}
        <div className="title-container">
          <hr /> {/* Linha horizontal */}
          <br /> {/* Espaço extra */}
          <br /> {/* Espaço extra */}
          <h2>Painel Principal</h2>
        </div>

        {/* Seção de pesquisa */}
        <div className="search row mt-3 justify-content-between">
        <div className="row">
          <div className="col-md-3">
            <label><h5>Ano Início:</h5></label>
            <select className="form-control"  onChange={this.handleDataInicioChange}>
              <option value="">Todos</option>
             
            </select>
          </div>
          <div className="col-md-3">
            <label><h5>Ano Fim:</h5></label>
            <select className="form-control" onChange={this.handleDataFimChange}>
              <option value="">Todos</option>
              
            </select>
          </div>
          <div className="col-md-2">
            <Button variant="contained" color="primary" onClick={this.handleAplicarFiltro} className="col mt-3"><h6>Aplicar Filtro</h6></Button>
          </div>
        </div>
        <div className='row mt-1'>
          <div className="col-md-3">
            <label><h5>Instituto:</h5></label>
            <select name="buscainstituto"  onChange={this.handleFilterChange} className="form-control">
              <option value="">Todos</option>
             
            </select>
          </div>
          <div className="col-md-3">
            <label><h5>Pesquisador:</h5></label>
            <select name="buscapesquisador" onChange={this.handleFilterChange} className="form-control">
              <option value="">Todos</option>
            
            </select>
          </div>
          <div className="col-md-3">
            <label><h5>Tipo de Produção:</h5></label>
            <select name="buscatipoproducao"></select>
      
          </div>
        </div>
      </div>

        {/* Container principal com coloração cinza claro */}
        <div className="main-container">
          {/* Container secundário com coloração branca */}
          <div className="inner-container">
            {/* Lista de itens */}
            <ul>
              <li>Item 1</li>
              <li>Item 2</li>
              <li>Item 3</li>
              {/* Adicione mais itens conforme necessário */}
            </ul>
          </div>
        </div>

        {/* Container com os atalhos */}
        <div className="shortcut-container">
          {/* Atalho para a página de gráficos */}
          <div className="shortcut">
            <button>Gráfico de Produção</button>
          </div>
          {/* Atalho para a página de institutos */}
          <div className="shortcut">
            <button>Institutos</button>
          </div>
          {/* Atalho para a página de pesquisadores */}
          <div className="shortcut">
            <button>Pesquisadores</button>
          </div>
          {/* Atalho para a página do grafo */}
          <div className="shortcut">
            <button>Grafo</button>
          </div>
        </div>
      </div>
    );
  }
}

