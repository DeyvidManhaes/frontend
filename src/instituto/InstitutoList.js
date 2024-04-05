import React, { Component } from 'react';
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableHead, TableBody, TableCell, TableRow } from '@material-ui/core';
import { Link } from 'react-router-dom';
import './InstitutoList.css'

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
      alterando: false,
      openDialog: false,
      id: ""
    };
  }

  iniciarAlterar = (instituto) => {
    this.setState({ alterando: true, nome: instituto.nome, id: instituto.id, acronimo: instituto.acronimo });
  }

  gravarAlterar = () => {
    const dados = {
      "id": this.state.id,
      "nome": this.state.nome,
      "acronimo": this.state.acronimo
    }

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dados)
    };

    const url = window.servidor + '/instituto/alterar';
    fetch(url, requestOptions)
      .then(response => {
        console.log('Instituto alterado: ' + this.state.nome);
        this.setState({ alterando: false }); // Definindo alterando como falso após a alteração
        this.preencherListInstituto(); // Atualizando a lista de institutos após a alteração
        if (response.ok) {
          // Operação bem-sucedida
          
      } else {
          // Operação falhou
          alert("Não foi possível realizar a operação por nome ou acrônimo já existente. Erro: " + response.statusText);
      }
  
      })
      .catch(error => {
        console.log(error);
    });
      
  }
  excluir = (instituto) => {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    };
  
    const url = window.servidor + '/instituto/excluir/' + instituto.id;
    fetch(url, requestOptions)
      .then(response => {
        console.log('Instituto Excluído: ' + instituto.nome);
        this.preencherListInstituto(); // Atualizando a lista de institutos após a exclusão
      })
      .catch(error => console.log(error));
  };
  

  renderAlterar = () => {
    return (
      <div className='mt-5 p-2 col-3'>
        <h1>Editar Instituto</h1>
        <TextField label="Id" fullWidth margin="normal" value={this.state.id} />
        <TextField label="Nome" fullWidth margin="normal" value={this.state.nome} onChange={this.txtnome_change} />
        <TextField label="Acrônimo" fullWidth margin="normal" value={this.state.acronimo} onChange={this.txtacronimo_change} />
        <Button variant="contained" color="primary" onClick={this.handleOpenDialog}>Salvar</Button>
        <Button onClick={() => this.setState({ alterando: false })} variant="contained" color="default">Cancelar</Button>
        <Dialog open={this.state.openDialog} onClose={this.handleCloseDialog}>
            <DialogTitle>Confirmação</DialogTitle>
              <DialogContent>
                    <p>Deseja realmente alterar o instituto:</p>
                    <p>Id: {this.state.id}</p>
                    <p>Nome: {this.state.nome}</p>
                    <p>Acrônimo: {this.state.acronimo}</p>
              </DialogContent>
              <DialogActions>
                <Button variant="contained" color="primary" onClick={() => { this.gravarAlterar(); this.handleCloseDialog(); }}>Salvar</Button>
                <Button variant="contained" color="default" onClick={this.handleCloseDialog}>Cancelar</Button>
              </DialogActions>
        </Dialog>
      </div>
    )
  }

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
  handleOpenDialog = () => {
    this.setState({ openDialog: true });
  }

  handleCloseDialog = () => {
    this.setState({ openDialog: false });
  }

  gravarInstituto = () => {
    const { opcaoBusca, termoBusca } = this.state;

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
    fetch(window.servidor + '/instituto/exibir')
      .then(response => response.json())
      .then(data => this.setState({ institutos: data }));
  }

  handleAplicarFiltro = () => {
    const { opcaoBusca, termoBusca } = this.state;
  
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
  

  renderItems = (institutos) => {
    const { currentPage, itemsPerPage, institutoSelecionado } = this.state;
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
    this.setState({
      institutoSelecionado: instituto === this.state.institutoSelecionado ? null : instituto,
      id: instituto.id,
      nome: instituto.nome,
      acronimo: instituto.acronimo
    });
  };

  handleChangeItemsPerPage = (event) => {
    this.setState({ itemsPerPage: parseInt(event.target.value), currentPage: 1 });
  };

  paginate = (pageNumber) => {
    this.setState({ currentPage: pageNumber });
  };

  renderExibirLista = () => {
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
        <div className="search-container">
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
              <TableCell>Acrônimo</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.renderItems(institutosFiltrados)}
          </TableBody>
        </Table>
  
        <Button component={Link} to="/instituto/novo" variant="contained" className='mt-3 pl-5' color="primary">Incluir</Button>
        <Button onClick={() => this.iniciarAlterar(this.state.institutoSelecionado)} variant="contained" className='mt-3 pl-5' color="primary">Editar</Button>
        <Button onClick={() => {this.handleOpenDialog()} }variant="contained" className='mt-3 pl-5' color="primary">Excluir</Button>
        <Dialog open={this.state.openDialog} onClose={this.handleCloseDialog}>
          <DialogTitle>Confirmação</DialogTitle>
          <DialogContent>
            <p>Deseja realmente excluir o instituto:</p>
            <p>Id: {this.state.id}</p>
            <p>Nome: {this.state.nome}</p>
            <p>Acrônimo: {this.state.acronimo}</p>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="primary" onClick={() => { this.excluir(this.state.institutoSelecionado); this.handleCloseDialog(); }}>Excluir</Button>
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
  

  render() {
    let pagina = '';
    if (this.state.alterando) {
      pagina = this.renderAlterar();
    } else {
      pagina = this.renderExibirLista();
    }
    return pagina;
  }
}





