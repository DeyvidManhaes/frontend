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
      nomeCitacao: {}, // Alterado para objeto
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
        .then(data => {
            console.log("Dados de nomeCitacao:", data); // Adicionando um log para debug
            const nomeCitacaoMap = {};
            data.forEach(nome => {
                nomeCitacaoMap[nome.id] = nome.nome;
            });
            console.log("Mapa de nomeCitacao:", nomeCitacaoMap); // Adicionando um log para debug
            this.setState({ nomeCitacao: nomeCitacaoMap });
        })
        .catch(error => console.error('Erro ao buscar nomes citações:', error));
}

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
    const { nomeCitacao } = this.state;
    
    // Verifica se 'trabalho' é válido e se 'tipo' está definido
    if (trabalho && trabalho.tipo) {
      const tipoNome = trabalho.tipo.nome;
      
      // Verifica se 'tipoNome' está definido
      if (tipoNome === "Livro Publicado") {
        const nomeCitacaoLivro = nomeCitacao[trabalho.nomeCitacao] || ""; // Obtém o nome de citação do livro ou uma string vazia se não estiver definido
        return `${nomeCitacaoLivro}, ${trabalho.titulo}, ${trabalho.editora}, ${trabalho.local}, ${trabalho.ano}`;
      } else if (tipoNome === "Artigo Publicado") {
        const nomeCitacaoArtigo = nomeCitacao[trabalho.nomeCitacao] || ""; // Obtém o nome de citação do artigo ou uma string vazia se não estiver definido
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
