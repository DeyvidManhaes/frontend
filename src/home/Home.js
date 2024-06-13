import React, { Component } from 'react';
import Menu from '../menu/Menu';
import { Button } from '@mui/material';
import '../home/Home.css'; // Arquivo de estilos para a página Home
import ZingChart from 'zingchart-react'; // Importe o componente ZingChart
import 'zingchart/es6'; // Importe o módulo principal do ZingChart

export default class Home extends Component {
  handleChartClick = () => {
    window.location.href = '/producao';
  };

  render() {
    const chartConfig = {
      type: 'ring',
      legend: {
        align: 'right',
        borderWidth: '0px',
        item: {
          cursor: 'pointer',
          fontSize: '10px',
          offsetX: '-5px',
        },
        layout: 'vertical',
        marker: {
          type: 'circle',
          cursor: 'pointer',
          size: '10px',
        },
        toggleAction: 'start', // remove plot so it re-calculates percentage
        verticalAlign: 'middle',
      },
      plot: {
        tooltip: {
          visible: false,
        },
        detached: false, // turn off click on slices
        slice: 20, // set hole size in middle of chart
      },
      series: [
        { values: [34], backgroundColor: '#FE7A5D' },
        { values: [40], backgroundColor: '#69A8F8' },
        { values: [50], backgroundColor: '#54DBB9' },
        { values: [20], backgroundColor: '#FEDA60' },
      ],
    };

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
              <select className="form-control" onChange={this.handleDataInicioChange}>
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
              <select name="buscainstituto" onChange={this.handleFilterChange} className="form-control">
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
              <select name="buscatipoproducao" className="form-control"></select>
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
            <div onClick={this.handleChartClick} style={{ padding: '10px', position: 'relative' }}>
              
              <div id="myChart" className="chart--container" style={{ width: '10px', height: '10px', position: 'absolute', top: '-15px', right: '400px' }}>
                Gráfico de Produção
                <ZingChart data={chartConfig} height="300px" width="300px" />
              </div>
            </div>
          </div>
          {/* Atalho para a página de institutos */}
          <div className="shortcut">
            <Button>Institutos</Button>
          </div>
          {/* Atalho para a página de pesquisadores */}
          <div className="shortcut">
            <Button>Pesquisadores</Button>
          </div>
          {/* Atalho para a página do grafo */}
          <div className="shortcut">
            <Button>Grafo</Button>
          </div>
        </div>
      </div>
    );
  }
}


