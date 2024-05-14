import React, { Component } from 'react';
import { TextField, Button, Table, TableHead, TableBody, TableCell, TableRow } from '@material-ui/core';
import './ProducaoList.css';

export default class Producao extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      itemsPerPage: 5,
      termoBusca: '',
      trabalhos: [],
      nomesCitacao: [], // Alterado para objeto
    };
  }

  componentDidMount() {
    this.fetchTrabalhos();
    this.fetchNomes();
  }

  fetchTrabalhos = () => {
    const url = window.servidor + "/trabalho/exibir";
    fetch(url)
      .then(response => response.json())
      .then(data => this.setState({ trabalhos: data }))
      .catch(error => console.error('Erro ao buscar trabalhos:', error));
  }
  fetchNomes = () => {
    const url = window.servidor + "/nome/exibir";
    fetch(url)
    .then(response => response.json())
    .then(datanome => this.setState({ nomesCitacao: datanome }))
    .catch(error => console.error('Erro ao buscar nomes:', error));
}
getNomeCitacaoById = (trabalhoId) => {
  const { nomesCitacao } = this.state;
  const nomeCitacao = nomesCitacao.find(nome => nome.trabalho.id === trabalhoId);
  return nomeCitacao ? nomeCitacao.nome : '';
};


  handleTermoBuscaChange = (event) => {
    this.setState({ termoBusca: event.target.value });
  }

  handleAplicarFiltro = () => {
    const { termoBusca } = this.state;
    const trabalhosFiltrados = this.state.trabalhos.filter(trabalho => trabalho.nome.includes(termoBusca));
    this.setState({ trabalhos: trabalhosFiltrados });
  }

  renderItems = () => {
    const { currentPage, itemsPerPage, trabalhos } = this.state;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = trabalhos.slice(indexOfFirstItem, indexOfLastItem);
  
    return currentItems.map((trabalho, index) => (
      <TableRow key={index}>
        <TableCell>{trabalho.tipo.nome}</TableCell>
        <TableCell>{this.getDetalhamento(trabalho)}</TableCell>
      </TableRow>
    ));
  };

  getDetalhamento = (trabalho) => {
    if (trabalho && trabalho.tipo) {
      const tipoNome = trabalho.tipo.nome;
      if (tipoNome === "Livro Publicado") {
        const nomeCitacaoLivro = this.getNomeCitacaoById(trabalho.id) ;
        return `${nomeCitacaoLivro}, ${trabalho.titulo}, ${trabalho.editora}, ${trabalho.local}, ${trabalho.ano}`;
      } else if (tipoNome === "Artigo Publicado") {
        const nomeCitacaoArtigo = this.getNomeCitacaoById(trabalho.id) || "";
        return `${nomeCitacaoArtigo}, ${trabalho.titulo}, ${trabalho.periodico}, ${trabalho.local}, ${trabalho.ano}`;
      }
    }
    return "Detalhes não disponíveis";
  };
  

  handleChangeItemsPerPage = (event) => {
    this.setState({ itemsPerPage: parseInt(event.target.value), currentPage: 1 });
  };

  paginate = (pageNumber) => {
    this.setState({ currentPage: pageNumber });
  };

  render() {
    const { currentPage, itemsPerPage, termoBusca, trabalhos } = this.state;
    const totalPages = Math.ceil(trabalhos.length / itemsPerPage);
    const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

    return (
      <div className='p-2 mt-5'>
        <h1>Itens de Produção</h1>
        <div className="search-container">
          <div className="termo">
            <label htmlFor="termo">Termo:</label>
            <input type="text" id="termo" placeholder="Digite aqui" value={termoBusca} onChange={this.handleTermoBuscaChange} />
          </div>
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
          <button type="button" className="btn btn-primary search-box" onClick={this.handleAplicarFiltro}>Aplicar</button>
        </div>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tipo</TableCell>
              <TableCell>Detalhamento</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.renderItems(trabalhos)}
          </TableBody>
        </Table>

        <nav aria-label="Page navigation example" className="mt-3">
          <ul className="pagination justify-content-center">
            <li className="page-item">
              <a className="page-link" href="javascript:void(0)" onClick={() => this.paginate(1)} aria-label="First">
                <span aria-hidden="true">&lt;&lt;</span>
              </a>
            </li>
            <li className="page-item">
              <a className="page-link" href="javascript:void(0)" onClick={() => this.paginate(currentPage - 1)} aria-label="Previous">
                <span aria-hidden="true">&lt;</span>
              </a>
            </li>
            {pageNumbers.map((number) => (
              <li key={number} className={`page-item ${number === currentPage ? 'active' : ''}`}>
                <a className="page-link" href="javascript:void(0)" onClick={() => this.paginate(number)}>{number}</a>
              </li>
            ))}
            <li className="page-item">
              <a className="page-link" href="javascript:void(0)" onClick={() => this.paginate(currentPage + 1)} aria-label="Next">
                <span aria-hidden="true">&gt;</span>
              </a>
            </li>
            <li className="page-item">
              <a className="page-link" href="javascript:void(0)" onClick={() => this.paginate(totalPages)} aria-label="Last">
                <span aria-hidden="true">&gt;&gt;</span>
              </a>
            </li>
          </ul>
        </nav>

        <div className="mt-3 ml-auto mr-5">
          <select value={itemsPerPage} onChange={this.handleChangeItemsPerPage}>
            <option value="5">5 por página</option>
            <option value="10">10 por página</option>
            <option value="30">30 por página</option>
            <option value="100">100 por página</option>
          </select>
        </div>
      </div>
    );
  }
}
