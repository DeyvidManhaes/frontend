import React, { Component } from 'react';
import { Button, Table, TableHead, TableBody, TableCell, TableRow, TextField, Checkbox } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import 'zingchart/es6';
import ZingChart from 'zingchart-react';
import 'zingchart/modules-es6/zingchart-depth.min.js';

// Componente para a tela em branco
const BlankScreen = ({ config, onCancel }) => (
  <div className="blank-screen" style={{ position: 'relative', width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
    <h2>Gerador de Grafos</h2>
    <div style={{ width: '80%', height: '70%' }}>
      <ZingChart data={config} />
    </div>
    <Button variant="contained" color="secondary" onClick={onCancel}>Voltar</Button>
  </div>
);

export default class GraphGeneration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      institutos: [],
      producoes: [],
      pesquisadores: [],
      filteredPesquisadores: [],
      filteredInstitutos: [],
      filteredProducoes: [],
      selectedInstitutos: [],
      selectedProducoes: [],
      selectedPesquisadores: [],
      tipoVertice: 'pesquisador',
      npInicio: [1, 2, 4],
      npFim: [1, 2, 4],
      config: {}, // Adicione o estado config para o gráfico ZingChart
      showGraphOverlay: false, // Adicione o estado showGraphOverlay para controlar a exibição da sobreposição
      showBlankScreen: false // Estado para controlar a exibição da tela em branco
    };
  }

  componentDidMount() {
    this.fetchPesquisadores();
    this.fetchProducoes();
  }

  fetchPesquisadores = () => {
    const url = `${window.servidor}/pesquisador/exibir`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const institutos = Array.from(new Set(data.map(p => p.instituto?.nome).filter(Boolean)));
        this.setState({
          pesquisadores: data,
          filteredPesquisadores: data,
          institutos,
          filteredInstitutos: institutos
        });
      })
      .catch(error => console.error('Erro ao buscar pesquisadores:', error));
  }

  fetchProducoes = () => {
    const url = `${window.servidor}/trabalho/exibir/todos`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        this.setState({
          producoes: data,
          filteredProducoes: data
        });
      })
      .catch(error => console.error('Erro ao buscar produções:', error));
  }

  updateFilteredData = () => {
    const { producoes, pesquisadores, institutos, selectedInstitutos, selectedPesquisadores, selectedProducoes } = this.state;

    let filteredInstitutos = institutos;
    let filteredPesquisadores = pesquisadores;
    let filteredProducoes = producoes;

    if (selectedInstitutos.length > 0) {
      filteredPesquisadores = filteredPesquisadores.filter(p =>
        selectedInstitutos.includes(p.instituto?.nome)
      );
      filteredProducoes = filteredProducoes.filter(p =>
        selectedInstitutos.includes(p.pesquisador?.instituto?.nome)
      );
    }

    if (selectedPesquisadores.length > 0) {
      filteredInstitutos = filteredInstitutos.filter(i =>
        selectedPesquisadores.some(p => p.instituto?.nome === i)
      );
      filteredProducoes = filteredProducoes.filter(p =>
        selectedPesquisadores.some(pesquisador => pesquisador.id === p.pesquisador?.id)
      );
    }

    if (selectedProducoes.length > 0) {
      filteredInstitutos = filteredInstitutos.filter(i =>
        selectedProducoes.some(p => p.pesquisador?.instituto?.nome === i)
      );
      filteredPesquisadores = filteredPesquisadores.filter(p =>
        selectedProducoes.some(producao => producao.pesquisador?.id === p.id)
      );
    }

    this.setState({ filteredInstitutos, filteredPesquisadores, filteredProducoes });
  };

  applyFilters = () => {
    const { tipoVertice, filteredProducoes, filteredPesquisadores, selectedInstitutos, selectedPesquisadores } = this.state;
    let dataPoints = [];

    if (tipoVertice === 'instituto') {
      let institutos = selectedInstitutos.length > 0 ? selectedInstitutos : this.state.institutos;
      institutos.forEach(instituto => {
        let producoesCount = filteredProducoes.filter(p => p.pesquisador?.instituto?.nome === instituto).length;
        dataPoints.push({ text: instituto, size: producoesCount });
      });
    } else if (tipoVertice === 'pesquisador') {
      let pesquisadores = selectedPesquisadores.length > 0 ? selectedPesquisadores : filteredPesquisadores;
      pesquisadores.forEach(pesquisador => {
        let producoesCount = filteredProducoes.filter(p => p.pesquisador?.id === pesquisador.id).length;
        dataPoints.push({ text: pesquisador.nome, size: producoesCount, group: pesquisador.instituto?.nome });
      });
    }

    const config = {
      type: 'bubble',
      series: [
        {
          values: dataPoints.map(dp => [dp.text, dp.size])
        }
      ],
      scaleR: {
        visible: false // Oculta os eixos x e y
      },
      plotarea: {
        margin: false // Ajusta a margem da área do gráfico
      },
      tooltip: {
        text: "%t: %v produções"
      }
    };

    this.setState({ config, showGraphOverlay: true, showBlankScreen: true }); // Mostra a sobreposição do gráfico ao aplicar os filtros
  };

  handleMultipleSelectChange = (event, value, type) => {
    this.setState({ [type]: value }, this.updateFilteredData);
  };

  handleVerticeChange = (event) => {
    this.setState({ tipoVertice: event.target.value });
  };

  handleNpFimChange = (index, value) => {
    const { npInicio } = this.state;
    let newNpFim = [...this.state.npFim];
    newNpFim[index] = value;

    // Atualiza npInicio das linhas seguintes se o npFim for alterado
    let newNpInicio = [...npInicio];
    for (let i = index + 1; i < newNpInicio.length; i++) {
      newNpInicio[i] = newNpFim[i - 1] + 1;
    }

    // Verifica as regras de validação para npFim
    if (index === 0) {
      newNpFim[0] = Math.min(Math.max(value, 1), 2);
    } else if (index === 1) {
      newNpFim[1] = Math.min(Math.max(value, npInicio[1], 1), 5);
    } else if (index === 2) {
      newNpFim[2] = Math.max(value, npInicio[2]);
    }

    // Atualiza npInicio das linhas subsequentes se npFim for menor que npInicio
    for (let i = index + 1; i < newNpInicio.length; i++) {
      newNpInicio[i] = Math.max(newNpInicio[i], newNpFim[i - 1] + 1);
    }

    this.setState({ npFim: newNpFim, npInicio: newNpInicio });
  };

  render() {
    const { filteredInstitutos, filteredProducoes, filteredPesquisadores, selectedInstitutos, selectedProducoes, selectedPesquisadores, tipoVertice, npInicio, npFim, showGraphOverlay, showBlankScreen, config } = this.state;

    return (
      <div className='p-5'>
        <h1 className='p-2'>Gerador de Grafo</h1>
        <div className='row'>
          <div className='col-md-3'>
            <label><h5>Instituto:</h5></label>
            <Autocomplete
              multiple
              options={filteredInstitutos}
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
              options={filteredProducoes}
              getOptionLabel={(option) => option.titulo}
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
                  {option.titulo}
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
          <Button variant="contained" color="primary" onClick={this.applyFilters}>Aplicar</Button>
        </div>
        <h2 className='mt-4'>Regras de Plotagem (Número de Produção - NP): </h2>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Aresta</TableCell>
              <TableCell>Valor NP (Início)</TableCell>
              <TableCell>Valor NP (Fim)</TableCell>
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
                    inputProps={{
                      min: npInicio[index],
                      max: index === 0 ? npInicio[index] + 1 : index === 1 ? 5 : undefined // ajuste máximo para a segunda linha até 5 e sem limite para a terceira linha
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {showGraphOverlay && (
          <div className="graph-overlay">
            <div style={{ width: '100%', height: '100%', position: 'fixed', top: 0, left: 0, zIndex: 100, backgroundColor: 'rgba(255, 255, 255, 0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <BlankScreen config={config} onCancel={() => this.setState({ showGraphOverlay: false, showBlankScreen: false })} />
            </div>
          </div>
        )}
      </div>
    );
  }
}

