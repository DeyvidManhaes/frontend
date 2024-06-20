import React, { Component } from 'react';
import { Button } from '@mui/material';
import '../home/Home.css';
import ZingChart from 'zingchart-react';
import 'zingchart/es6';


class Home extends Component {
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
      chartConfigPie: {
        type: 'pie',
        series: [],
        plot: {
          tooltip: {
            text: '%v %t'
          },
          'slice_click': (event) => {
            this.props.history.push('/producao');
          }
        }
      }
    };
  }

  componentDidMount() {
    this.fetchTrabalhos();
    this.fetchPesquisadores();
  }

  fetchTrabalhos = () => {
    const url = window.servidor + "/trabalho/exibir";
    fetch(url)
      .then(response => response.json())
      .then(data => {
        this.setState({ trabalhos: data, filteredTrabalhos: data, contador: data.length }, this.updatePieChart);
      })
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

    this.setState({ filteredTrabalhos: trabalhosFiltrados, currentPage: 1, contador: trabalhosFiltrados.length }, this.updateChart);
  }

  updateChart = () => {
  const { filteredTrabalhos } = this.state;
  const chartData = filteredTrabalhos.reduce((acc, trabalho) => {
    const ano = trabalho.ano;
    if (!acc[ano]) acc[ano] = 0;
    acc[ano]++;
    return acc;
  }, {});

  const chartConfigbar = {
    type: 'bar',
    series: [{
      values: Object.values(chartData)
    }],
    scaleX: {
      labels: Object.keys(chartData)
    },
    plot: {
      barWidth: '50%',
      tooltip: {
        text: '%v trabalhos em %kt'
      },
      'bar_click': (event) => {
        const ano = event.scaletext;
        const { buscainstituto, buscapesquisador, buscatipoproducao } = this.state;
        this.props.history.push(`/producao?dataInicio=${ano}&dataFim=${ano}&buscainstituto=${buscainstituto}&buscapesquisador=${buscapesquisador}&buscatipoproducao=${buscatipoproducao}`);
      }
    }
  };

  this.setState({ chartConfigbar });
}

  updatePieChart = () => {
    const { trabalhos } = this.state;
    const articleCount = trabalhos.filter(trabalho => trabalho.tipo && trabalho.tipo.nome === 'Artigo Publicado').length;
    const bookCount = trabalhos.filter(trabalho => trabalho.tipo && trabalho.tipo.nome === 'Livro Publicado').length;

    const chartConfigPie = {
      type: 'ring',
      series: [
        { text: 'Artigos', values: [articleCount] },
        { text: 'Livros', values: [bookCount] }
      ],
      plot: {
        tooltip: {
          text: '%v %t'
        },
        'slice_click': () => {
          this.props.history.push('/producao');
        }
      }
    };

    this.setState({ chartConfigPie });
  }

  render() {
    const { pesquisadores, dataInicio, dataFim, buscainstituto, buscapesquisador, buscatipoproducao, filteredTrabalhos, chartConfigbar, chartConfigPie, institutos } = this.state;
    const anosTrabalhos = [...new Set(filteredTrabalhos.map(trabalho => trabalho.ano))];
    const anosFiltradosInicio = anosTrabalhos.filter(ano => !dataFim || ano <= dataFim).sort((a, b) => b - a);
    const anosFiltradosFim = anosTrabalhos.filter(ano => !dataInicio || ano >= dataInicio).sort((a, b) => b - a);
    const pesquisadoresFiltrados = buscainstituto ? pesquisadores.filter(p => p.instituto.nome === buscainstituto) : pesquisadores;

    return (
      <div>
        {/* Título na parte superior da página */}
        <div className="title-container">
          <hr /> {/* Linha horizontal */}
          <br /> {/* Espaço extra */}
          <br /> {/* Espaço extra */}
          <h2>Painel Principal</h2>
        </div>

        {/* Seção de pesquisa */}
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
                {pesquisadoresFiltrados.map(pesquisador => (
                  <option key={pesquisador.id} value={pesquisador.id}>{pesquisador.nome}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label><h5>Tipo de Produção:</h5></label>
              <select name="buscatipoproducao" value={buscatipoproducao} onChange={this.handleFilterChange} className="form-control">
                <option value="">Todos</option>
                {filteredTrabalhos.reduce((acc, trabalho) => {
                  if (trabalho.tipo && trabalho.tipo.nome && !acc.includes(trabalho.tipo.nome)) {
                    acc.push(trabalho.tipo.nome);
                  }
                  return acc;
                }, []).map((tipo, index) => (
                  <option key={index} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Estrutura do gráfico visível sempre */}
        <div className="chart-container">
          <ZingChart data={chartConfigbar} />
        </div>

        {/* Retângulos abaixo do gráfico principal */}
        <div className="row mt-4">
          <div className="col-md-3">
            <div className="info-box"onClick={() => this.props.navigate('/producao')}>
              <h5 className='mt-1'>Total Produção</h5>
              <div className="chart--container">
                <ZingChart data={chartConfigPie} height='195' width='100%' />
              </div>
              <div className="legend-left">
                <span className="legend-item"><span className="color-box" style={{ backgroundColor: '#FF6384' }}></span> Artigos </span>
                <span className="legend-item"><span className="color-box" style={{ backgroundColor: '#36A2EB' }}></span> Livros</span>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="info-box" onClick={() => this.props.navigate('/instituto')}>
              <h5>Institutos</h5>
              <div className="badge text-bg-primary text-wrap"><h1>{institutos.length}</h1></div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="info-box"onClick={() => this.props.navigate('/pesquisador')}>
              <h5>Pesquisadores</h5>
              <div className="badge text-bg-primary text-wrap"><h1>{pesquisadores.length}</h1></div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="info-box" onClick={() => this.props.navigate('/grafo')}>
              <h5>Grafo</h5>
              <div className="img-container">
                <img src="https://ims.tech/wp-content/uploads/2020/06/icon_graph.svg" alt="Gráfico Indicativo" className="img-fluid" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
