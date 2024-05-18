import React, { Component } from 'react';
import { Button, Table, TableHead, TableBody, TableCell, TableRow, TextField, Checkbox } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';

export default class GraphGeneration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      institutos: [],
      producoes: [],
      pesquisadores: [],
      filteredPesquisadores: [],
      selectedInstitutos: [],
      selectedProducoes: [],
      selectedPesquisadores: [],
      tipoVertice: 'pesquisador',
      npInicio: [1, 2, 3],
      npFim: [1, 2, 3]
    };
  }

  componentDidMount() {
    this.fetchPesquisadores();
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
        this.setState({ pesquisadores: data, filteredPesquisadores: data,
          institutos, institutos: institutosUnicos });
      })
      .catch(error => console.error('Erro ao buscar pesquisadores:', error));
  }

  extractUniqueInstitutos = (pesquisadores) => {
    const institutos = [];
    pesquisadores.forEach(p => {
      if (!institutos.includes(p.instituto)) {
        institutos.push(p.instituto);
      }
    });
    return institutos;
  };

  handleMultipleSelectChange = (event, value, type) => {
    if (type === 'selectedInstitutos') {
      this.updateFilteredPesquisadores(value);
    }
    if (type === 'selectedPesquisadores') {
      this.fetchProducoes(value);
    }
    this.setState({ [type]: value });
  };

  updateFilteredPesquisadores = (selectedInstitutos) => {
    const filteredPesquisadores = this.state.pesquisadores.filter(p =>
      selectedInstitutos.includes(p.instituto)
    );
    this.setState({ filteredPesquisadores, selectedPesquisadores: [] });
  };

  fetchProducoes = (selectedPesquisadores) => {
    if (selectedPesquisadores.length > 0) {
      const ids = selectedPesquisadores.map(p => p.id).join(',');
      const url = window.servidor +"/trabalho/trabalhoscomuns";
      fetch(url)
        .then(response => response.json())
        .then(data => this.setState({ producoes: data, selectedProducoes: [] }))
        .catch(error => console.error('Erro ao buscar produções:', error));
    } else {
      this.setState({ producoes: [], selectedProducoes: [] });
    }
  };

  handleVerticeChange = (event) => {
    this.setState({ tipoVertice: event.target.value });
  };

  handleNpFimChange = (index, value) => {
    const { npFim } = this.state;
    const newNpFim = [...npFim];
    newNpFim[index] = value;
    this.setState({ npFim: newNpFim });
  };

  applyFilters = () => {
    // Logic to apply filters and generate graph
    console.log('Filters applied');
  };

  render() {
    const { institutos, producoes, filteredPesquisadores, selectedInstitutos, selectedProducoes, selectedPesquisadores, tipoVertice, npInicio, npFim } = this.state;

    return (
      <div className='p-5'>
        <h1 className='p-2'>Gerador de Grafo</h1>
        <div className='row'>
          <div className='col-md-3'>
            <label><h5>Instituto:</h5></label>
            <Autocomplete
              multiple
              options={institutos}
              getOptionLabel={(option) => option}
              value={selectedInstitutos}
              onChange={(event, value) => this.handleMultipleSelectChange(event, value, 'selectedInstitutos')}
              renderInput={(params) => (
                <TextField {...params} variant="outlined" label="Selecione Institutos" />
              )}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox
                    checked={selected}
                    style={{ marginRight: 8 }}
                  />
                  {option}
                </li>
              )}
            />
          </div>
          <div className='col-md-3'>
            <label><h5>Produção:</h5></label>
            <Autocomplete
              multiple
              options={producoes}
              getOptionLabel={(option) => option.nome}
              value={selectedProducoes}
              onChange={(event, value) => this.handleMultipleSelectChange(event, value, 'selectedProducoes')}
              renderInput={(params) => (
                <TextField {...params} variant="outlined" label="Selecione Produções" />
              )}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox
                    checked={selected}
                    style={{ marginRight: 8 }}
                  />
                  {option.nome}
                </li>
              )}
            />
          </div>
          <div className='col-md-3'>
            <label><h5>Pesquisador:</h5></label>
            <Autocomplete
              multiple
              options={filteredPesquisadores}
              getOptionLabel={(option) => option.nome}
              value={selectedPesquisadores}
              onChange={(event, value) => this.handleMultipleSelectChange(event, value, 'selectedPesquisadores')}
              renderInput={(params) => (
                <TextField {...params} variant="outlined" label="Selecione Pesquisadores" />
              )}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox
                    checked={selected}
                    style={{ marginRight: 8 }}
                  />
                  {option.nome}
                </li>
              )}
            />
          </div>
          <div className='col-md-3'>
            <label><h5>Tipo de Vértice:</h5></label>
            <select value={tipoVertice} onChange={this.handleVerticeChange} className="form-control">
              <option value="pesquisador">Pesquisador</option>
              <option value="instituto">Instituto</option>
            </select>
          </div>
        </div>
        <div className='text-right mt-3'>
          <Button variant="contained" color="primary" onClick={this.applyFilters}>Aplicar Filtro</Button>
        </div>
        <h2 className='mt-4'>Regras de Plotagem</h2>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Aresta</TableCell>
              <TableCell>NP (Início)</TableCell>
              <TableCell>NP (Fim)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {['Vermelha', 'Amarela', 'Verde'].map((color, index) => (
              <TableRow key={index}>
                <TableCell>{color}</TableCell>
                <TableCell>{npInicio[index]}</TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={npFim[index]}
                    onChange={(e) => this.handleNpFimChange(index, parseInt(e.target.value))}
                    inputProps={{ min: npInicio[index], max: npInicio[index] + 1 }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
}
