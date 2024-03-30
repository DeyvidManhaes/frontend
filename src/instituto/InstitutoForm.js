// InstitutoForm.js

import React, { Component } from 'react';
import { TextField, Button } from '@material-ui/core'; // Importa componentes do Material-UI
import { Link } from 'react-router-dom';
export default class InstitutoForm extends Component {
  render() {
    return (
      <div className='mt-5 p-2 col-3'>
        <h1>Formulário de Instituto</h1>
        {/* Campos de entrada para nome e acrônimo */}
        <TextField label="Nome" fullWidth margin="normal" />
        <TextField label="Acrônimo" fullWidth margin="normal" />
        {/* Botão para salvar */}
        <Button variant="contained" color="primary">Salvar</Button>
        {/* Botão para cancelar */}
        <Button component={Link} to="/instituto" variant="contained" className=' pl-5'color="default">Cancelar</Button>
        
      </div>
    );
  }
}
