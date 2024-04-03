import React, { Component } from 'react';
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import { Link } from 'react-router-dom';

export default class InstitutoForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nome: "",
      acronimo: "",
      openDialog: false // estado para controlar a exibição da caixa de diálogo
    };
  }

  txtnome_change = (event) => {
    this.setState({ nome: event.target.value });
  }

  txtacronimo_change = (event) => {
    this.setState({ acronimo: event.target.value });
  }

  handleOpenDialog = () => {
    this.setState({ openDialog: true });
  }

  handleCloseDialog = () => {
    this.setState({ openDialog: false });
  }

  gravarInstituto = () => {
    const dados = {
      "nome": this.state.nome,
      "acronimo": this.state.acronimo
    };

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dados)
    };

    const url = window.servidor + '/instituto/incluir';
    fetch(url, requestOptions)
      .then(response => {
        console.log('Gravado Instituto: ' + this.state.nome);
        // Redireciona para a página de lista de institutos após o salvamento
        this.props.history.push("/instituto");
      })
      .catch(erro => console.log(erro));
  }

  render() {
    return (
      <div className='mt-5 p-2 col-3'>
        <h1>Formulário de Instituto</h1>
        {/* Campos de entrada para nome e acrônimo */}
        <TextField label="Nome" fullWidth margin="normal" value={this.state.nome} onChange={this.txtnome_change} />
        <TextField label="Acrônimo" fullWidth margin="normal" value={this.state.acronimo} onChange={this.txtacronimo_change} />
        {/* Botão para abrir a caixa de diálogo */}
        <Button variant="contained" color="primary" onClick={this.handleOpenDialog}>Salvar</Button>
        {/* Botão para cancelar */}
        <Button component={Link} to="/instituto" variant="contained" color="default">Cancelar</Button>
        {/* Caixa de diálogo */}
        <Dialog open={this.state.openDialog} onClose={this.handleCloseDialog}>
          <DialogTitle>Confirmação</DialogTitle>
          <DialogContent>
            <p>Deseja realmente adicionar o instituto:</p>
            <p>Nome: {this.state.nome}</p>
            <p>Acrônimo: {this.state.acronimo}</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseDialog} color="default">Cancelar</Button>
            <Button onClick={() => { this.gravarInstituto(); this.handleCloseDialog(); }} component={Link} to="/instituto" color="primary">OK</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

