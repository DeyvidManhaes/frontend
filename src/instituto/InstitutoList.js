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
      institutos: []
    };
  }

  renderItems = () => {
    const { currentPage, itemsPerPage, institutos } = this.state;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = institutos.slice(indexOfFirstItem, indexOfLastItem);
    
    return currentItems.map((instituto, index) => (
      <TableRow key={index}>
        <TableCell>{instituto.nome}</TableCell>
        <TableCell>{instituto.acronimo}</TableCell>
        <TableCell>
          <Button onClick={() => this.handleSelect(instituto)}>Selecionar</Button>
        </TableCell>
      </TableRow>
    ));
  };

  handleSelect = (instituto) => {
    // Lógica para selecionar o instituto e habilitar os botões de editar e excluir
  };

  handleChangeItemsPerPage = (event) => {
    this.setState({ itemsPerPage: parseInt(event.target.value), currentPage: 1 });
  };

  paginate = (pageNumber) => {
    this.setState({ currentPage: pageNumber });
  };

  render() {
    const { currentPage, itemsPerPage, institutos } = this.state;
    const totalPages = Math.ceil(institutos.length / itemsPerPage);
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <div>
        <div className="pl-5 search-container">
          <div className="pl-5 termo">
            Termo:<input type="text" placeholder="Digite aqui" />
            <button type="button" className="btn btn-secondary"><i className="bi bi-search"></i></button>
          </div>
          <div className="box1">Campo:</div>
          <div className="box2">
            <select aria-label="Default select example">
              <option selected>Todos</option>
              <option value="1">Nome</option>
              <option value="2">Acrônimo</option>
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
            {this.renderItems()}
          </TableBody>
        </Table>
        
        <Button component={Link} to="/instituto/novo" variant="contained" className='mt-3 pl-5'color="primary">Incluir</Button>
        <Button component={Link} to="/instituto/editar" variant="contained" className='mt-3 pl-5' color="primary">Editar</Button>
        <Button component={Link} to="/instituto/excluir" variant="contained" className='mt-3 pl-5' color="primary">Excluir</Button>

        <nav aria-label="Page navigation example" className="mt-3">
          <ul className="pagination justify-content-center">
            <li className="page-item">
              <a className="page-link" href="#" onClick={() => this.paginate(1)} aria-label="First">
                <span aria-hidden="true">&lt;&lt;</span>
              </a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#" onClick={() => this.paginate(currentPage - 1)} aria-label="Previous">
                <span aria-hidden="true">&lt;</span>
              </a>
            </li>
            {pageNumbers.map((number) => (
              <li key={number} className={`page-item ${number === currentPage ? 'active' : ''}`}>
                <a className="page-link" href="#" onClick={() => this.paginate(number)}>{number}</a>
              </li>
            ))}
            <li className="page-item">
              <a className="page-link" href="#" onClick={() => this.paginate(currentPage + 1)} aria-label="Next">
                <span aria-hidden="true">&gt;</span>
              </a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#" onClick={() => this.paginate(totalPages)} aria-label="Last">
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



