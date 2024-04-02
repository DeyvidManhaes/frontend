// InstitutoForm.js

import React, { Component } from 'react';
import { TextField, Button } from '@material-ui/core'; // Importa componentes do Material-UI
import { Link } from 'react-router-dom';
export default class InstitutoForm extends Component {

  state = {
    nome: "",
    acronimo: ""
  }

  txtnome_change = (event)=>{
    this.setState({nome: event.target.value})
  }
  txtacronimo_change = (event)=>{
    this.setState ({acronimo: event.target.value})
  }
  gravarinstituto = ()=>{
    const dados = {
      "nome":this.state.nome,
      "acronimo":this.state.acronimo
    }
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dados)
    };
    const url = "http://localhost:8080/instituto/incluir"
    fetch(url, requestOptions)
        .then(console.log('Gravado Instituto:'+this.state.nome))
        .catch(erro=> console.log(erro));
  }

  render() {
    return (

      <div className='mt-5 p-2 col-3'>
        <h1>Formulário de Instituto</h1>
        {/* Campos de entrada para nome e acrônimo */}
        <TextField label="Nome" fullWidth margin="normal" value={this.state.nome} onChange={this.txtnome_change}/>
        <TextField value={this.state.acronimo} onChange={this.txtacronimo_change} label="Acrônimo" fullWidth margin="normal" />
        {/* Botão para salvar */}
        <Button variant="contained" color="primary" onClick={()=> this.gravarinstituto()}>Salvar</Button>
        {/* Botão para cancelar */}
        <Button component={Link} to="/instituto" variant="contained" className=' pl-5'color="default">Cancelar</Button>
        
      </div>
    );
  }
}
