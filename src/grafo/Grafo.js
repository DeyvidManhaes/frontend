import React, { Component } from 'react';
import { Button, Table, TableHead, TableBody, TableCell, TableRow, TextField, Checkbox } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import CytoscapeComponent from 'react-cytoscapejs';
import Cytoscape from 'cytoscape';

// Componente para a tela em branco
const BlankScreen = ({ elements, onCancel, tipolayout, handlelayoutChange }) => (
  
  <div className="blank-screen" style={{ position: 'relative', width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
    <h2>Gerador de Grafos</h2>
   
    <div className='column-1 col-1 md-3'>
       <Button   variant="contained" color="secondary" onClick={onCancel}>Voltar</Button>
      
      </div>
    <div style={{ width: '80%', height: '70%' }}>
      
    <CytoscapeComponent
  elements={elements}
  layout={{
    name: tipolayout || 'circle' ,
    radius: 10, // Aumente o raio para ampliar o círculo
    spacingFactor: 0.5, // Ajuste o fator de espaçamento para aumentar a distância entre os nós
    avoidOverlap: true,
    nodeDimensionsIncludeLabels: true
  }}
         stylesheet={nodeStyles}
  style={{ width: '100%', height: '800px' }} // Ajuste a altura conforme necessário para melhor visualização
  
/>
    </div >
    
  </div>
);
const nodeStyles = [
  {
    selector: 'node',
    style: {
      'background-color': '#1a8cff',
      'label': 'data(label)',
      'text-valign': 'center',
      'text-wrap': 'wrap',
      'text-max-width': '100px',
      'width': 'label',
      'height': 'label',
      'padding': '10px',
      'shape': 'ellipse'
    }
  },
  {
    selector: '.instituto',
    style: {
      'background-color': '#ffcc00',
      'width': 'label * 1.5',
      'height': 'label * 1.5'
    }
  },
  {
    selector: '.pesquisador',
    style: {
      'background-color': '#ff6666',
      'width': 'label * 1.2',
      'height': 'label * 1.2'
    }
  },
  {
    selector: '.vermelha',
    style: {
      'line-color': 'red',
      'target-arrow-color': 'red',
      'width': 2,
      'label': 'data(label)',
      'text-rotation': 'autorotate',
      'color': 'red'
    }
  },
  {
    selector: '.amarela',
    style: {
      'line-color': 'yellow',
      'target-arrow-color': 'yellow',
      'width': 2,
      'label': 'data(label)',
      'text-rotation': 'autorotate',
      'color': 'yellow'
    }
  },
  {
    selector: '.verde',
    style: {
      'line-color': 'green',
      'target-arrow-color': 'green',
      'width': 2,
      'label': 'data(label)',
      'text-rotation': 'autorotate',
      'color': 'green'
    }
  }
];


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
      tipos: [],
      selectedPesquisadores: [],
      tipoVertice: 'pesquisador',
      tipolayout:'circle',
      npInicio: [1, 2, 4],
      npFim: [1, 2, 4],
      elements: [], // Adicione o estado elements para o Cytoscape
      showGraphOverlay: false, // Adicione o estado showGraphOverlay para controlar a exibição da sobreposição
      showBlankScreen: false // Estado para controlar a exibição da tela em branco
    };
  }

  componentDidMount() {
    this.fetchPesquisadores();
    this.fetchProducoes();
    this.fetchTipos();
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

   fetchTipos = () => {
    const url = `${window.servidor}/tipo/exibir`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        this.setState({
          tipos: data,
        });
      })
      .catch(error => console.error('Erro ao buscar os tipos:', error));
   }
  
  fetchTrabalhosEntrePesquisadores = () => {
  const url = `${window.servidor}/pesquisador/contarTrabalhosEntrePesquisadores`;
  return fetch(url)
    .then(response => response.json())
    .catch(error => {
      console.error('Erro ao buscar trabalhos entre pesquisadores:', error);
      return {};
    });
}

fetchTrabalhosEntreInstitutos = () => {
  const url = `${window.servidor}/instituto/contarTrabalhosEntreInstitutos`;
  return fetch(url)
    .then(response => response.json())
    .catch(error => {
      console.error('Erro ao buscar trabalhos entre institutos:', error);
      return {};
    });
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

  applyFilters = async () => {
  const { tipoVertice, filteredProducoes, filteredPesquisadores, selectedInstitutos, selectedPesquisadores, npInicio, npFim } = this.state;
  let elements = [];

  if (tipoVertice === 'instituto') {
    let institutos = selectedInstitutos.length > 0 ? selectedInstitutos : this.state.institutos;
    const trabalhosEntreInstitutos = await this.fetchTrabalhosEntreInstitutos();
    institutos.forEach(instituto => {
      let producoesCount = filteredProducoes.filter(p => p.pesquisador?.instituto?.nome === instituto).length;
      elements.push({
        data: {
          id: instituto,
          label: `${instituto} (${producoesCount} produções)`,
          group: 'instituto'
        },
        classes: 'instituto',
        position: { x: 0, y: 0 } // Definindo a posição inicial dos nós de instituto
      });
    });

    // Adicionando arestas entre institutos
    Object.entries(trabalhosEntreInstitutos).forEach(([key, value]) => {
      const [source, target] = key.split('-');
      let color = this.getEdgeColor(value, npInicio, npFim);
      if (institutos.includes(source) && institutos.includes(target)) {
        elements.push({
          data: { id: `${source}-${target}`, source, target, label: `${value}` },
          classes: color
        });
      }
    });

  } else if (tipoVertice === 'pesquisador') {
    let pesquisadores = selectedPesquisadores.length > 0 ? selectedPesquisadores : filteredPesquisadores;
    const trabalhosEntrePesquisadores = await this.fetchTrabalhosEntrePesquisadores();
    pesquisadores.forEach(pesquisador => {
      let producoesCount = filteredProducoes.filter(p => p.pesquisador?.id === pesquisador.id).length;
      elements.push({
        data: {
          id: pesquisador.nome,
          label: `${pesquisador.nome} (${producoesCount} produções)`,
          group: pesquisador.instituto?.nome
        },
        classes: 'pesquisador',
        position: { x: 0, y: 0 } // Definindo a posição inicial dos nós de pesquisador
      });
    });

    // Adicionando arestas entre pesquisadores
    Object.entries(trabalhosEntrePesquisadores).forEach(([key, value]) => {
      const [source, target] = key.split('-');
      let color = this.getEdgeColor(value, npInicio, npFim);
      if (pesquisadores.some(p => p.nome === source) && pesquisadores.some(p => p.nome === target)) {
        elements.push({
          data: { id: `${source}-${target}`, source, target, label: `${value}` },
          classes: color
        });
      }
    });
  }

  this.setState({ elements, showGraphOverlay: true, showBlankScreen: true });
};

 getEdgeColor = (value, npInicio, npFim) => {
    let color = 'verde';
    if (value >= npInicio[2] && value <= npFim[2]) {
      color = 'verde';
    } else if (value >= npInicio[1] && value <= npFim[1]) {
      color = 'amarela';
    } else if (value >= npInicio[0] && value <= npFim[0]) {
      color = 'vermelha';
    }
    return color;
  }


  handleMultipleSelectChange = (event, value, type) => {
    this.setState({ [type]: value }, this.updateFilteredData);
  };

  handleVerticeChange = (event) => {
    this.setState({ tipoVertice: event.target.value });
  };
  handlelayoutChange = (event) => {
    this.setState({ tipolayout: event.target.value });
    return event;
  };

  handleNpFimChange = (index, value) => {
    const { npInicio } = this.state;
    let newNpFim = [...this.state.npFim];
    newNpFim[index] = value;

    // Atualiza npInicio das linhas seguintes se o npFim for alterado
    let newNpInicio = [...npInicio];
    for (let i = index + 1; i < newNpInicio.length; i++) {
      newNpInicio[i] = newNpFim[i - 1] + 1;
      newNpFim[i] = newNpInicio[i];
    }

    // Verifica as regras de validação para npFim
    if (index === 0) {
      newNpFim[0] = Math.min(Math.max(value, 1));
    } else if (index === 1) {
      newNpFim[1] = Math.min(Math.max(value, npInicio[1]));
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
    const { filteredInstitutos,tipos, filteredProducoes, filteredPesquisadores, selectedInstitutos, selectedProducoes, selectedPesquisadores, tipoVertice, npInicio, npFim, showGraphOverlay, showBlankScreen, elements, tipolayout } = this.state;
    const nodeStyles = [
      {
        selector: 'node',
        style: {
          'background-color': '#1a8cff', // Cor de fundo dos nós
          'label': 'data(label)', // Exibir rótulo dos nós
          'text-valign': 'center', // Alinhamento vertical do texto
          'text-wrap': 'wrap', // Quebra de linha automática para o texto
          'text-max-width': '100px', // Largura máxima para o texto
          'width': 'label', // Largura baseada no tamanho do rótulo
          'height': 'label', // Altura baseada no tamanho do rótulo
          'padding': '10px', // Espaçamento interno
          'shape': 'ellipse' // Formato do nó (ellipse = círculo)
        }
      },
      {
        selector: '.instituto',
        style: {
          'background-color': '#ffcc00', // Cor de fundo específica para nós de instituto
          'width': 'label * 1.5', // Aumentar largura dos nós de instituto
          'height': 'label * 1.5' // Aumentar altura dos nós de instituto
        }
      },
      {
        selector: '.pesquisador',
        style: {
          'background-color': '#ff6666', // Cor de fundo específica para nós de pesquisador
          'width': 'label * 1.2', // Aumentar largura dos nós de pesquisador
          'height': 'label * 1.2' // Aumentar altura dos nós de pesquisador
        }
      }
    ];


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
                <TextField {...params} variant="outlined" label="Todos" />
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
              options={tipos}
              getOptionLabel={(option) => option.nome}
              value={selectedProducoes}
              onChange={(event, value) => this.handleMultipleSelectChange(event, value, 'selectedProducoes')}
              renderInput={(params) => (
                <TextField {...params} variant="outlined" label="Todos" />
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
                <TextField {...params} variant="outlined" label="Todos" />
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
                      max: undefined // ajuste máximo para a segunda linha até 5 e sem limite para a terceira linha
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
              <BlankScreen elements={elements} onCancel={() => this.setState({ showGraphOverlay: false, showBlankScreen: false })} />
            </div>
          </div>
        )}
      </div>
    );
  }
}