import React, { Component } from 'react';
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableHead, TableBody, TableCell, TableRow, Select, MenuItem } from '@material-ui/core';
import './PesquisadorList.css'

export default class Pesquisador extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      itemsPerPage: 5,
      instituto: "",
      pesquisadores: [],
      institutos: [],
      filteredInstitutos: [],
      pesquisadorSelecionado: null,
      opcaoBusca: 'todos',
      termoBusca: '',
      termoBuscaInstituto: '',
      openDialog: false,
      incluindo: false,
      id: "",
      windowPosition: { x: 0, y: 0 }
    };
  }

  salvarPesquisador = () => {
    const dados = {
      "arquivoId": this.state.id.padStart(16, '0'), // Preenche com zeros à esquerda
      "institutoId": this.state.instituto.id // Apenas o ID do instituto
    };

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dados)
    };

    const url = window.servidor + '/pesquisador/incluir';
    fetch(url, requestOptions)
    .then(response => {
      console.log('Pesquisador Gravado: ' + this.state.id);
      this.setState({ incluindo: false });
      this.preencherListPesquisador();
      if (response.ok) {
        // Operação bem-sucedida
        alert("Cadastro realizado com sucesso."+  response.statusText);
      } else {
        // Operação falhou
        alert("Não foi possível realizar a operação erro ocorrido. Erro: " + response.statusText);
      }

    })
    .catch(error => {
      console.log(error);
    });
  }

  iniciarIncluir = () =>{
    this.setState({incluindo: true});
  }

  handleInstitutoChange = (event) => {
    this.setState({ instituto: event.target.value });
  };

  handleTermoBuscaInstitutoChange = (event) => {
    const termo = event.target.value.toLowerCase();
    const filteredInstitutos = this.state.institutos.filter(instituto =>
      instituto.nome.toLowerCase().includes(termo)
    );
    this.setState({ termoBuscaInstituto: event.target.value, filteredInstitutos });
  };

  txtnomeChange = (event) => {
    this.setState({ id: event.target.value });
  };

  componentDidMount() {
    this.preencherListPesquisador();
    this.carregarInstitutos();
    this.setState({ filteredInstitutos: [...this.state.institutos] });
  }

  carregarInstitutos = () => {
    fetch(window.servidor + '/instituto/exibir')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        this.setState({ institutos: data })
      })
      .catch(error => console.log(error));
  };

  preencherListPesquisador = () => {
    fetch(window.servidor + '/pesquisador/exibir')
      .then(response => response.json())
      .then(data => this.setState({ pesquisadores: data }));
  }

  renderPesquisadores = () => {
    const { currentPage, itemsPerPage, pesquisadores, pesquisadorSelecionado } = this.state;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = pesquisadores.slice(indexOfFirstItem, indexOfLastItem);

    return currentItems.map((pesquisador, index) => (
      <TableRow key={index} className={pesquisador === pesquisadorSelecionado ? 'selected' : ''} onClick={() => this.handleSelect(pesquisador)}>
        <TableCell>{pesquisador.nome}</TableCell>
        <TableCell>{pesquisador.email}</TableCell>
        <TableCell>{pesquisador.instituto.acronimo}</TableCell>
        <TableCell>
          <input type="checkbox" checked={pesquisador === pesquisadorSelecionado} onChange={() => this.handleSelect(pesquisador)} />
        </TableCell>
      </TableRow>
    ));
  };

  handleSelect = (pesquisador) => {
    this.setState({
      pesquisadorSelecionado: pesquisador === this.state.pesquisadorSelecionado ? null : pesquisador,
      id: pesquisador.id,
      nome: pesquisador.nome,
      email: pesquisador.email,
      instituto: pesquisador.instituto
    });
  };

  handleChangeItemsPerPage = (event) => {
    this.setState({ itemsPerPage: parseInt(event.target.value), currentPage: 1 });
  };

  paginate = (pageNumber) => {
    this.setState({ currentPage: pageNumber });
  };

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
    } else if (opcaoBusca === 'instituto') {
      url += `?instituto=${termoBusca}`;
    } else if (opcaoBusca === 'email') {
      url += `?email=${termoBusca}`;
    }

    fetch(url)
      .then(response => response.json())
      .then(data => this.setState({ pesquisadores: data }));
  }

  excluirPesquisador = () => {
    const { pesquisadorSelecionado } = this.state;
    if (pesquisadorSelecionado) {
      this.setState({ openDialog: true });
    } else {
      alert("Por favor, selecione um pesquisador para excluir.");
    }
  };

  handleCloseDialog = () => {
    this.setState({ openDialog: false, pesquisadorSelecionado: null});
  }

  excluir = () => {
    const { pesquisadorSelecionado } = this.state;

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    };

    const url = window.servidor + '/pesquisador/excluir/' + pesquisadorSelecionado.id;
    fetch(url, requestOptions)
      .then(response => {
        console.log('Pesquisador Excluído: ' + pesquisadorSelecionado.nome);
        this.preencherListPesquisador();
      })
      .catch(error => console.log(error))
      .finally(() => {
        this.handleCloseDialog();
        this.setState({ pesquisadorSelecionado: null });
      });
  };

  handleMouseDown = (event) => {
    event.preventDefault();
    const { clientX, clientY } = event;
    const { left, top } = event.target.getBoundingClientRect();
    const offsetX = clientX - left;
    const offsetY = clientY - top;

    this.setState({
      isDragging: true,
      dragOffset: { x: offsetX, y: offsetY }
    });

    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
  };

  handleMouseMove = (event) => {
    if (this.state.isDragging) {
      const { clientX, clientY } = event;
      const newX = clientX - this.state.dragOffset.x;
      const newY = clientY - this.state.dragOffset.y;
      this.setState({ windowPosition: { x: newX, y: newY } });
    }
  };

  handleMouseUp = () => {
    this.setState({
      isDragging: false,
      dragOffset: { x: 0, y: 0 }
    });
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
  };

  handleOpenIncluirDialog = () => {
    this.setState({ incluindo: true });
  }
  
  handleCloseIncluirDialog = () => {
    this.setState({ incluindo: false });
  }

  render() {
    const { currentPage, itemsPerPage, pesquisadores, opcaoBusca, termoBusca, pesquisadorSelecionado, incluindo, institutos } = this.state;
    const totalPages = Math.ceil(pesquisadores.length / itemsPerPage);
    const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

    return (
      <div className='p-2 mt-5'>
        <h1>CRUD de Pesquisador</h1>
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
              <option value="email">E-mail</option>
              <option value="instituto">Instituto</option>
            </select>
          </div>
          <button type="button" className="btn btn-primary search-box" onClick={this.handleAplicarFiltro}>Aplicar</button>
        </div>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>E-mail</TableCell>
              <TableCell>Instituto</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.renderPesquisadores()}
          </TableBody>
        </Table>

        <Button onClick={() => this.iniciarIncluir()} variant="contained" className='mt-3 pl-5' color="primary">Incluir</Button>
        <Button onClick={this.excluirPesquisador} variant="contained" className='mt-3 pl-5' color="primary">Excluir</Button>
        

        <Dialog open={this.state.openDialog} onClose={this.handleCloseDialog}>
          <DialogTitle>Confirmação</DialogTitle>
          <DialogContent>
            <p>Deseja realmente excluir o pesquisador:</p>
            <p>Id: {pesquisadorSelecionado ? pesquisadorSelecionado.id : ''}</p>
            <p>Nome: {pesquisadorSelecionado ? pesquisadorSelecionado.nome : ''}</p>
            <p>E-mail: {pesquisadorSelecionado ? pesquisadorSelecionado.email : ''}</p>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="primary" onClick={() => { this.excluir(); this.handleCloseDialog(); }}>Excluir</Button>
            <Button variant="contained" color="default" onClick={this.handleCloseDialog}>Cancelar</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={this.state.incluindo} onClose={this.handleCloseIncluirDialog} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 999 }}>
          <DialogTitle>Formulário de Pesquisador</DialogTitle>
          <DialogContent>
            <TextField label="ID" fullWidth margin="normal" value={this.state.id} onChange={this.txtnomeChange} />
            <Select
  label="Instituto"
  value={this.state.instituto}
  onChange={this.handleInstitutoChange}
  fullWidth
  MenuProps={{
    PaperProps: {
      style: {
        maxHeight: 300,
      },
    },
    getContentAnchorEl: null,
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left"
    },
    transformOrigin: {
      vertical: "top",
      horizontal: "left"
    },
    // Impedir o fechamento do menu ao clicar no campo de busca
    onClick: (e) => e.stopPropagation(),
  }}
  renderValue={(selected) => (
    <div>
      <span>{selected.nome}</span>
    </div>
  )}
>
  <MenuItem key="buscar" value="" onClose={(e) => e.preventDefault()}>
    <TextField
      label="Buscar Instituto"
      fullWidth
      margin="normal"
      value={this.state.termoBuscaInstituto}
      onChange={this.handleTermoBuscaInstitutoChange}
      onClick={(e) => e.stopPropagation()} // Impedir a propagação do evento de clique
    />
  </MenuItem>
  {this.state.filteredInstitutos.map(instituto => (
    <MenuItem key={instituto.id} value={instituto}>{instituto.nome}</MenuItem>
  ))}
</Select>



          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseIncluirDialog} color="primary">Cancelar</Button>
            <Button onClick={this.salvarPesquisador} color="primary">Salvar</Button>
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
}
