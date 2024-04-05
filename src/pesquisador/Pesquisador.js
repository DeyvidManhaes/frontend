import React, { Component } from 'react';
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableHead, TableBody, TableCell, TableRow } from '@material-ui/core';
import './PesquisadorList.css';

export default class PesquisadorList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      itemsPerPage: 5,
      pesquisadores: [],
      institutos: [],
      pesquisadorSelecionado: null,
      opcaoBusca: 'todos', // Opções: 'todos', 'nome', 'email'
      termoBusca: '',
      openDialog: false,
      openDialoge: false,
      pesquisadorNaoEncontrado: false,
    };
  }

  componentDidMount() {
    this.preencherListPesquisador();
  }

  preencherListPesquisador = () => {
    fetch(window.servidor + '/pesquisador/exibir')
      .then(response => response.json())
      .then(data => {
        this.setState({ 
          pesquisadores: data,
          pesquisadorNaoEncontrado: data.length === 0,
        });
      });
  }

  handleOpcaoBuscaChange = (event) => {
    this.setState({ opcaoBusca: event.target.value });
  }

  handleTermoBuscaChange = (event) => {
    this.setState({ termoBusca: event.target.value });
  }

  handleAplicarFiltro = () => {
    const { opcaoBusca, termoBusca } = this.state;
  
    let url = window.servidor + '/pesquisador/exibir';
    if (opcaoBusca === 'nome') {
      url += `?nome=${termoBusca}`;
    } else if (opcaoBusca === 'email') {
      url += `?email=${termoBusca}`;
    }
  
    fetch(url)
      .then(response => response.json())
      .then(data => {
        this.setState({ 
          pesquisadores: data,
          pesquisadorNaoEncontrado: data.length === 0,
        });
      });
  }
  
  handleOpenDialog = (pesquisador) => {
    this.setState({ openDialog: true, pesquisadorSelecionado: pesquisador });
  }

  handleCloseDialog = () => {
    this.setState({ openDialog: false });
  }
  handleOpenDialog1 = (pesquisador) => {
    this.setState({ openDialoge: true, pesquisadorSelecionado: pesquisador });
  }

  handleCloseDialog1 = () => {
    this.setState({ openDialoge: false });
  }

  excluir = (pesquisador) => {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    };
  
    const url = window.servidor + '/pesquisador/excluir/' + pesquisador.id;
    fetch(url, requestOptions)
      .then(response => {
        console.log('Pesquisador Excluído: ' + pesquisador.nome);
        this.preencherListInstituto(); // Atualizando a lista de institutos após a exclusão
      })
      .catch(error => console.log(error));
  };

  handleChangeItemsPerPage = (event) => {
    this.setState({ itemsPerPage: parseInt(event.target.value), currentPage: 1 });
  };

  paginate = (pageNumber) => {
    this.setState({ currentPage: pageNumber });
  };

  render() {

    const { pesquisadores, currentPage, itemsPerPage, opcaoBusca, termoBusca, institutos, openDialog, pesquisadorSelecionado, pesquisadorNaoEncontrado } = this.state;
    const totalPages = Math.ceil(pesquisadores.length / itemsPerPage);
    const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

    const renderItems = () => {
      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      const currentItems = pesquisadores.slice(indexOfFirstItem, indexOfLastItem);

      return currentItems.map(pesquisador => (
        <TableRow key={pesquisador.id}>
          <TableCell>{pesquisador.nome}</TableCell>
          <TableCell>{pesquisador.email}</TableCell>
          <TableCell>{pesquisador.instituto}</TableCell>
          <TableCell>
            <Button variant="contained" color="secondary" onClick={() => this.handleOpenDialog(pesquisador)}>Excluir</Button>
          </TableCell>
        </TableRow>
      ));
    };      

    return (
      <div>
        <h1 className='mt-5 p-2'>CRUD de Pesquisador</h1>
        <div className="search-container mt-5" >
          <div className="termo">
            <label htmlFor="termo">Termo:</label>
            <input type="text" id="termo" placeholder="Digite aqui" value={termoBusca} onChange={this.handleTermoBuscaChange} />
          </div>
          <div className="box1">
            <label htmlFor="opcaoBusca">Campo:</label>
          </div>
          <div className="box2">
            <select id="opcaoBusca" value={opcaoBusca} onChange={this.handleOpcaoBuscaChange} aria-label="Default select example">
              <option value="todos">Todos</option>
              <option value="nome">Nome</option>
              <option value="acronimo">Acrônimo</option>
            </select>
          </div>
          <button type="button" className="btn btn-primary search-box" onClick={this.handleAplicarFiltro}>Aplicar</button>
        </div>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Instituto</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {renderItems()}
          </TableBody>
        </Table>
        <Button  variant="contained" className='mt-3 pl-5' class="btn btn-primary">Incluir</Button>
        
        <Button onClick={() => {this.handleOpenDialog()} } variant="contained" className='mt-3 pl-5' class="btn btn-danger">Excluir</Button>

        <Dialog open={openDialog} onClose={this.handleCloseDialog}>
          <DialogTitle>Confirmação</DialogTitle>
          <DialogContent>
            <p>Deseja realmente excluir o pesquisador:</p>
            <p>Nome: {pesquisadorSelecionado?.nome}</p>
            <p>Email: {pesquisadorSelecionado?.email}</p>
            <p>Instituto: {pesquisadorSelecionado?.instituto}</p>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="primary" onClick={() => { this.excluir(this.state.pesquisadorSelecionadoSelecionado); this.handleCloseDialog(); }}>Excluir</Button>
            <Button variant="contained" color="default" onClick={this.handleCloseDialog}>Cancelar</Button>
          </DialogActions>
        </Dialog>

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
            {pageNumbers.map(number => (
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
