import React, { Component } from 'react';
import { TextField, Button, Table, TableHead, TableBody, TableCell, TableRow } from '@material-ui/core';
import './ProducaoList.css';

export default class Producao extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      itemsPerPage: 5,
      dataInicio: '',
      dataFim: '',
      buscainstituto: '',
      buscapesquisador: '',
      buscatipoproducao: '',
      contador: 0,
      trabalhos: [],
      filteredTrabalhos: [],
      institutos: [],
      pesquisadores: [],
      nomesCitacao: [],
    };
  }

  componentDidMount() {
    this.fetchTrabalhos();
    this.fetchNomes();
    this.fetchPesquisadores();
  }

  fetchTrabalhos = () => {
    const url = window.servidor + "/trabalho/exibir";
    fetch(url)
      .then(response => response.json())
      .then(data => this.setState({ trabalhos: data, filteredTrabalhos: data, contador: data.length }))
      .catch(error => console.error('Erro ao buscar trabalhos:', error));
  }

  fetchPesquisadores = () => {
    const url = window.servidor + "/pesquisador/exibir";
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const institutos = data.reduce((acc, pesquisador) => {
          if (pesquisador.instituto && pesquisador.instituto.nome) {
            acc.push(pesquisador.instituto.nome);
          }
          return acc;
        }, []);
        const institutosUnicos = Array.from(new Set(institutos));
        this.setState({ pesquisadores: data, institutos: institutosUnicos });
      })
      .catch(error => console.error('Erro ao buscar pesquisadores:', error));
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

  handleDataInicioChange = (event) => {
    this.setState({ dataInicio: event.target.value });
  };

  handleDataFimChange = (event) => {
    this.setState({ dataFim: event.target.value });
  };

  handleFilterChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleAplicarFiltro = () => {
    const { buscainstituto, buscapesquisador, buscatipoproducao, dataInicio, dataFim, trabalhos, pesquisadores } = this.state;

    const trabalhosFiltrados = trabalhos.filter(trabalho => {
      const pesquisador = pesquisadores.find(pesq => pesq.id === trabalho.pesquisador.id);
      const byInstituto = buscainstituto ? pesquisador && pesquisador.instituto && pesquisador.instituto.nome === buscainstituto : true;
      const byPesquisador = buscapesquisador ? trabalho.pesquisador && trabalho.pesquisador.id === parseInt(buscapesquisador) : true;
      const byTipo = buscatipoproducao ? trabalho.tipo && trabalho.tipo.nome === buscatipoproducao : true;
      const byAnoInicio = dataInicio ? trabalho.ano >= dataInicio : true;
      const byAnoFim = dataFim ? trabalho.ano <= dataFim : true;

      return byInstituto && byPesquisador && byTipo && byAnoInicio && byAnoFim;
    });

    this.setState({ filteredTrabalhos: trabalhosFiltrados, currentPage: 1, contador: trabalhosFiltrados.length });
  }

  renderItems = () => {
    const { currentPage, itemsPerPage, filteredTrabalhos } = this.state;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredTrabalhos.slice(indexOfFirstItem, indexOfLastItem);

    return currentItems.map((trabalho, index) => (
      <TableRow key={index}>
        <TableCell>{trabalho.tipo ? trabalho.tipo.nome : 'Tipo não disponível'}</TableCell>
        <TableCell>{this.getDetalhamento(trabalho)}</TableCell>
      </TableRow>
    ));
  };

  getDetalhamento = (trabalho) => {
    if (trabalho && trabalho.tipo) {
      const tipoNome = trabalho.tipo.nome;
      if (tipoNome === "Livro Publicado") {
        const nomeCitacaoLivro = this.getNomeCitacaoById(trabalho.id);
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
    const { currentPage, itemsPerPage, pesquisadores, dataInicio, dataFim, buscainstituto, buscapesquisador, buscatipoproducao, filteredTrabalhos, contador } = this.state;
    const totalPages = Math.ceil(filteredTrabalhos.length / itemsPerPage);
    const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

    const anosTrabalhos = [...new Set(filteredTrabalhos.map(trabalho => trabalho.ano))];
    const anosFiltradosInicio = anosTrabalhos.filter(ano => !dataFim || ano <= dataFim).sort((a, b) => b - a);
    const anosFiltradosFim = anosTrabalhos.filter(ano => !dataInicio || ano >= dataInicio).sort((a, b) => b - a);

    return (
      <div className='p-1 mt-5'>
        <h1>Itens de Produção</h1>
        <div className="search row mt-3 justify-content-between">
          <div className="row">
            <div className="col-md-3">
              <label><h5>Ano Início:</h5></label>
              <select className="form-control" value={dataInicio} onChange={this.handleDataInicioChange}>
                <option value="">Todos</option>
                {anosFiltradosInicio.map(ano => (
                  <option key={ano} value={ano}>{ano}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label><h5>Ano Fim:</h5></label>
              <select className="form-control" value={dataFim} onChange={this.handleDataFimChange}>
                <option value="">Todos</option>
                {anosFiltradosFim.map(ano => (
                  <option key={ano} value={ano}>{ano}</option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <Button variant="contained" color="primary" onClick={this.handleAplicarFiltro} className="col mt-3"><h6>Aplicar Filtro</h6></Button>
            </div>
          </div>
          <div className='row mt-1'>
            <div className="col-md-3">
              <label><h5>Instituto:</h5></label>
              <select name="buscainstituto" value={buscainstituto} onChange={this.handleFilterChange} className="form-control">
                <option value="">Todos</option>
                {this.state.institutos.map((instituto, index) => (
                  <option key={index} value={instituto}>{instituto}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label><h5>Pesquisador:</h5></label>
              <select name="buscapesquisador" value={buscapesquisador} onChange={this.handleFilterChange} className="form-control">
                <option value="">Todos</option>
                {pesquisadores.map(pesquisador => (
                  <option key={pesquisador.id} value={pesquisador.id}>{pesquisador.nome}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label><h5>Tipo de Produção:</h5></label>
              <select name="buscatipoproducao" value={buscatipoproducao} onChange={this.handleFilterChange} className="form-control">
                <option value="">Todos</option>
                {["Artigo Publicado", "Livro Publicado"].map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className='p-3 col'> 
          <label className='col-1'><h5>Total de trabalhos:</h5></label>
          <div class="badge text-bg-primary text-wrap col-1">
         <h4> {contador}</h4></div></div>
        <Table className='mt-2'>
          <TableHead>
            <TableRow className="search-container mt-5 p-5">
              <TableCell>Tipo</TableCell>
              <TableCell>Detalhamento</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.renderItems()}
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
