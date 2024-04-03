import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Table, TableHead, TableBody, TableCell, TableRow, Button } from '@material-ui/core';
import './InstitutoList.css';

export default class InstitutoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      itemsPerPage: 5,
      nome: "",
      acronimo: "",
      institutos: [],
      institutoSelecionado: null,
      opcaoBusca: 'todos', // Opções: 'todos', 'nome', 'acronimo'
      termoBusca: '',
      alterar: false,
      id:""
    };
  }
  iniciaralterar = (instituto) =>
  txtnome_change = (event) => {
    this.setState({ nome: event.target.value });
  }

  txtacronimo_change = (event) => {
    this.setState({ acronimo: event.target.value });
  }

  handleOpcaoBuscaChange = (event) => {
    this.setState({ opcaoBusca: event.target.value });
  }

  handleTermoBuscaChange = (event) => {
    this.setState({ termoBusca: event.target.value });
  }

  gravarinstituto = () => {
    const { opcaoBusca, termoBusca } = this.state;

    // Lógica para buscar os institutos com base na opção de busca e no termo
    let url = window.servidor + '/instituto/exibir';
    if (opcaoBusca === 'nome') {
      url += `?nome=${termoBusca}`;
    } else if (opcaoBusca === 'acronimo') {
      url += `?acronimo=${termoBusca}`;
    }

    fetch(url)
      .then(response => response.json())
      .then(data => this.setState({ institutos: data }));
  }

  componentDidMount() {
    this.preencherListInstituto();
  }

  preencherListInstituto = () => {
    // Lógica para buscar a lista de institutos do servidor
    fetch(window.servidor + '/instituto/exibir')
      .then(response => response.json())
      .then(data => this.setState({ institutos: data }));
  }

  handleAplicarFiltro = () => {
    this.gravarinstituto();
  }

  renderItems = () => {
    const { currentPage, itemsPerPage, institutos, institutoSelecionado } = this.state;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = institutos.slice(indexOfFirstItem, indexOfLastItem);

    return currentItems.map((instituto, index) => (
      <TableRow key={index} className={instituto === institutoSelecionado ? 'selected' : ''} onClick={() => this.handleSelect(instituto)}>
        <TableCell>{instituto.nome}</TableCell>
        <TableCell>{instituto.acronimo}</TableCell>
        <TableCell>
          <input type="checkbox" checked={instituto === institutoSelecionado} onChange={() => this.handleSelect(instituto)} />
        </TableCell>
      </TableRow>
    ));
  };

  handleSelect = (instituto) => {
    this.setState({ institutoSelecionado: instituto === this.state.institutoSelecionado ? null : instituto });
  };

  handleChangeItemsPerPage = (event) => {
    this.setState({ itemsPerPage: parseInt(event.target.value), currentPage: 1 });
  };

  paginate = (pageNumber) => {
    this.setState({ currentPage: pageNumber });
  };

  render() {
    const { currentPage, itemsPerPage, opcaoBusca, termoBusca, institutos } = this.state;
    const totalPages = Math.ceil(institutos.length / itemsPerPage);
    const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

    let institutosFiltrados = institutos;
    if (termoBusca.trim() !== '') {
      institutosFiltrados = institutos.filter(instituto => {
        if (opcaoBusca === 'nome') {
          return instituto.nome.toLowerCase().startsWith(termoBusca.toLowerCase());
        } else if (opcaoBusca === 'acronimo') {
          return instituto.acronimo.toLowerCase().startsWith(termoBusca.toLowerCase());
        } else {
          return instituto.nome.toLowerCase().startsWith(termoBusca.toLowerCase()) ||
                 instituto.acronimo.toLowerCase().startsWith(termoBusca.toLowerCase());
        }
      });
    }

    return (
      <div>
        <div className="pl-5 search-container">
          <div className="pl-5 termo">
            Termo:<input type="text" placeholder="Digite aqui" value={termoBusca} onChange={this.handleTermoBuscaChange} />
            <button type="button" className="btn btn-secondary" onClick={this.handleAplicarFiltro}><i className="bi bi-search"></i></button>
          </div>
          <div className="box1">Campo:</div>
          <div className="box2">
            <select value={opcaoBusca} onChange={this.handleOpcaoBuscaChange} aria-label="Default select example">
              <option value="todos">Todos</option>
              <option value="nome">Nome</option>
              <option value="acronimo">Acrônimo</option>
            </select>
          </div>
          <button type="button" className="btn btn-primary ml-3">Aplicar</button>
        </div>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Acrônimo</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.renderItems(institutosFiltrados)}
          </TableBody>
        </Table>

        <Button component={Link} to="/instituto/novo" variant="contained" className='mt-3 pl-5' color="primary">Incluir</Button>
        <Button component={Link} to="/instituto/editar" variant="contained" className='mt-3 pl-5' color="primary">Editar</Button>
        <Button component={Link} to="/instituto/excluir" variant="contained" className='mt-3 pl-5' color="primary">Excluir</Button>

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




