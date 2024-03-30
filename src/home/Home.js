import React, { Component } from 'react';
import Menu from '../menu/Menu';
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
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="dataInicio">Data Início:</label>
                <input type="date" id="dataInicio" className="form-control" />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="dataFim">Data Fim:</label>
                <input type="date" id="dataFim" className="form-control" />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <button className="btn btn-dark">Aplicar</button>
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

