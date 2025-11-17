import React, { useEffect, useState } from 'react';
import BoxShadowPadrao from '../../components/box-shadow/BoxShadowPadrao';
import AtividadeService from '../../services/AtividadeService';
import type { Atividade, TipoAtividade, StatusAtividade } from '../../services/AtividadeService';
import './Atividades.css';

const Atividades = () => {
  // Abas
  const [abaAtiva, setAbaAtiva] = useState<'historico' | 'kanban'>('historico');

  // Atividades
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState('');

  // Filtros - valores temporários (inputs) separados por aba
  // Histórico
  const [filtroTipoHist, setFiltroTipoHist] = useState<TipoAtividade | ''>('');
  const [filtroStatusHist, setFiltroStatusHist] = useState<StatusAtividade | ''>('');
  const [filtroDataInicioHist, setFiltroDataInicioHist] = useState('');
  const [filtroDataFimHist, setFiltroDataFimHist] = useState('');
  const [filtroCulturaHist, setFiltroCulturaHist] = useState('');
  const [filtroBuscaHist, setFiltroBuscaHist] = useState(''); // busca por código ou título (histórico)
  // Kanban
  const [filtroTipoKan, setFiltroTipoKan] = useState<TipoAtividade | ''>('');
  const [filtroStatusKan, setFiltroStatusKan] = useState<StatusAtividade | ''>('');
  const [filtroDataInicioKan, setFiltroDataInicioKan] = useState('');
  const [filtroDataFimKan, setFiltroDataFimKan] = useState('');
  const [filtroCulturaKan, setFiltroCulturaKan] = useState('');
  const [filtroBuscaKan, setFiltroBuscaKan] = useState(''); // busca por código ou título (kanban)

  // Filtros aplicados - valores que realmente filtram (separados por aba)
  const [filtrosAplicadosHist, setFiltrosAplicadosHist] = useState({
    tipo: '' as TipoAtividade | '',
    status: '' as StatusAtividade | '',
    dataInicio: '',
    dataFim: '',
    cultura: '',
    busca: '',
  });
  const [filtrosAplicadosKan, setFiltrosAplicadosKan] = useState({
    tipo: '' as TipoAtividade | '',
    status: '' as StatusAtividade | '',
    dataInicio: '',
    dataFim: '',
    cultura: '',
    busca: '',
  });

  // Modal Nova Atividade
  const [modalAberto, setModalAberto] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [atividadeEmEdicao, setAtividadeEmEdicao] = useState<string | null>(null);
  const [novaAtividadeTitulo, setNovaAtividadeTitulo] = useState('');
  const [novaAtividadeDescricao, setNovaAtividadeDescricao] = useState('');
  const [novaAtividadeTipo, setNovaAtividadeTipo] = useState<TipoAtividade>('plantio');
  const [novaAtividadeStatus, setNovaAtividadeStatus] = useState<StatusAtividade>('planejada');
  const [novaAtividadeData, setNovaAtividadeData] = useState(() => new Date().toISOString().split('T')[0]);
  const [novaAtividadeDataVencimento, setNovaAtividadeDataVencimento] = useState('');
  const [novaAtividadeCultura, setNovaAtividadeCultura] = useState('');
  const [novaAtividadeCusto, setNovaAtividadeCusto] = useState(0);
  const [novaAtividadeResponsavel, setNovaAtividadeResponsavel] = useState('');
  const [novaAtividadeNotas, setNovaAtividadeNotas] = useState('');
  const [novaAtividadeTipoOutro, setNovaAtividadeTipoOutro] = useState('');
  const [novaAtividadeCodigoIdentificacao, setNovaAtividadeCodigoIdentificacao] = useState('');
  const [erroCamposModal, setErroCamposModal] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Carregar atividades ao montar
  useEffect(() => {
    carregarAtividades();
  }, []);

  // Recarregar ao mudar de aba ou filtros aplicados de qualquer aba
  useEffect(() => {
    carregarAtividades();
  }, [abaAtiva, filtrosAplicadosHist, filtrosAplicadosKan]);

  // Aplicar filtros por aba (historico | kanban)
  const aplicarFiltros = (aba: 'historico' | 'kanban' = abaAtiva) => {
    if (aba === 'historico') {
      setFiltrosAplicadosHist({
        tipo: filtroTipoHist,
        status: filtroStatusHist,
        dataInicio: filtroDataInicioHist,
        dataFim: filtroDataFimHist,
        cultura: filtroCulturaHist,
        busca: filtroBuscaHist,
      });
    } else {
      setFiltrosAplicadosKan({
        tipo: filtroTipoKan,
        status: filtroStatusKan,
        dataInicio: filtroDataInicioKan,
        dataFim: filtroDataFimKan,
        cultura: filtroCulturaKan,
        busca: filtroBuscaKan,
      });
    }
  };

  // Limpar filtros por aba
  const limparFiltros = (aba: 'historico' | 'kanban' = abaAtiva) => {
    if (aba === 'historico') {
      setFiltroTipoHist('');
      setFiltroStatusHist('');
      setFiltroDataInicioHist('');
      setFiltroDataFimHist('');
      setFiltroCulturaHist('');
      setFiltroBuscaHist('');
      setFiltrosAplicadosHist({ tipo: '', status: '', dataInicio: '', dataFim: '', cultura: '', busca: '' });
    } else {
      setFiltroTipoKan('');
      setFiltroStatusKan('');
      setFiltroDataInicioKan('');
      setFiltroDataFimKan('');
      setFiltroCulturaKan('');
      setFiltroBuscaKan('');
      setFiltrosAplicadosKan({ tipo: '', status: '', dataInicio: '', dataFim: '', cultura: '', busca: '' });
    }
  };

  const carregarAtividades = async () => {
    setCarregando(true);
    try {
      let lista;
      const applied = abaAtiva === 'historico' ? filtrosAplicadosHist : filtrosAplicadosKan;

      // Se tem busca aplicada, buscar e então aplicar filtros locais (tipo/status/data/cultura)
      if (applied.busca && applied.busca.trim()) {
        const resultados = await AtividadeService.buscar(applied.busca);
        lista = resultados.filter(a => {
          if (applied.tipo && a.tipo !== applied.tipo) return false;
          if (applied.status && a.status !== applied.status) return false;
          if (applied.cultura && !(a.cultura || '').toLowerCase().includes(applied.cultura.toLowerCase())) return false;
          if (applied.dataInicio && applied.dataFim) {
            const inicio = new Date(applied.dataInicio);
            const fim = new Date(applied.dataFim);
            const d = new Date(a.data);
            if (isNaN(d.getTime())) return false;
            if (d < inicio || d > fim) return false;
          }
          return true;
        });
      } else {
        const tipo = applied.tipo || undefined;
        const status = applied.status || undefined;
        lista = await AtividadeService.listarComFiltros(
          tipo as TipoAtividade | undefined,
          status as StatusAtividade | undefined,
          applied.dataInicio,
          applied.dataFim,
          applied.cultura
        );
      }
      
      setAtividades(lista);
      if (lista.length === 0 && Object.values(applied).some(v => v)) {
        setMensagem('Nenhuma atividade encontrada com os filtros selecionados.');
      } else {
        setMensagem('');
      }
    } catch (error) {
      setMensagem('Erro ao carregar atividades.');
      console.error(error);
    } finally {
      setCarregando(false);
    }
  };

  const salvarAtividade = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErroCamposModal([]);
    setMensagem('');

    try {
      // Validação
      const faltando: string[] = [];
      if (!novaAtividadeTitulo.trim()) faltando.push('titulo');
      if (!novaAtividadeData) faltando.push('data');
      if (novaAtividadeTipo === 'outro' && !novaAtividadeTipoOutro.trim()) faltando.push('tipoOutro');

      if (faltando.length > 0) {
        setErroCamposModal(faltando);
        const labels = faltando.map(f => {
          if (f === 'titulo') return 'Título';
          if (f === 'data') return 'Data';
          if (f === 'tipoOutro') return 'Tipo de Atividade';
          return f;
        });
        if (labels.length === 1) setMensagem(`${labels[0]} é obrigatório.`);
        else setMensagem(`${labels.join(', ')} são obrigatórios.`);
        return;
      }

      // Validação adicional: dataVencimento não deve ser anterior à data da atividade
      if (novaAtividadeDataVencimento) {
        const dData = new Date(novaAtividadeData);
        const dVenc = new Date(novaAtividadeDataVencimento);
        if (!isNaN(dData.getTime()) && !isNaN(dVenc.getTime()) && dVenc < dData) {
          setErroCamposModal(['dataVencimento']);
          setMensagem('Data de vencimento não pode ser anterior à data da atividade.');
          return;
        }
      }

      // Criar atividade ou editar
      let descricaoFinal = novaAtividadeDescricao.trim();
      if (novaAtividadeTipo === 'outro' && novaAtividadeTipoOutro.trim()) {
        descricaoFinal = `Tipo: ${novaAtividadeTipoOutro}\n${descricaoFinal}`.trim();
      }

      if (modoEdicao && atividadeEmEdicao) {
        // Editar atividade
        await AtividadeService.atualizarAtividade(atividadeEmEdicao, {
          titulo: novaAtividadeTitulo.trim(),
          descricao: descricaoFinal || undefined,
          tipo: novaAtividadeTipo,
          status: novaAtividadeStatus,
          data: novaAtividadeData,
          dataVencimento: novaAtividadeDataVencimento || undefined,
          cultura: novaAtividadeCultura.trim() || undefined,
          custo: novaAtividadeCusto > 0 ? novaAtividadeCusto : undefined,
          responsavel: novaAtividadeResponsavel.trim() || undefined,
          notas: novaAtividadeNotas.trim() || undefined,
        });
        setMensagem('Atividade atualizada com sucesso!');
      } else {
        // Criar atividade
        const criado = await AtividadeService.criarAtividade({
          titulo: novaAtividadeTitulo.trim(),
          descricao: descricaoFinal || undefined,
          tipo: novaAtividadeTipo,
          status: novaAtividadeStatus,
          data: novaAtividadeData,
          dataVencimento: novaAtividadeDataVencimento || undefined,
          cultura: novaAtividadeCultura.trim() || undefined,
          custo: novaAtividadeCusto > 0 ? novaAtividadeCusto : undefined,
          responsavel: novaAtividadeResponsavel.trim() || undefined,
          notas: novaAtividadeNotas.trim() || undefined,
        });
        setMensagem(`Atividade criada com sucesso! Código: ${criado.codigoIdentificacao}`);
      }

      // Limpar formulário
      setNovaAtividadeTitulo('');
      setNovaAtividadeDescricao('');
      setNovaAtividadeTipo('plantio');
      setNovaAtividadeTipoOutro('');
      setNovaAtividadeStatus('planejada');
        setNovaAtividadeData(new Date().toISOString().split('T')[0]);
        setNovaAtividadeDataVencimento('');
        // limpar código local da modal (serviço gera o código definitivo)
        setNovaAtividadeCodigoIdentificacao('');
      setNovaAtividadeCultura('');
      setNovaAtividadeCusto(0);
      setNovaAtividadeResponsavel('');
      setNovaAtividadeNotas('');
      setModalAberto(false);

      // Recarregar atividades
      await carregarAtividades();
    } catch (error) {
      setMensagem('Erro ao criar atividade.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const atualizarStatus = async (id: string, novoStatus: StatusAtividade) => {
    try {
      await AtividadeService.atualizarAtividade(id, { status: novoStatus });
      setMensagem('Status atualizado com sucesso!');
      await carregarAtividades();
    } catch (error) {
      setMensagem('Erro ao atualizar status.');
      console.error(error);
    }
  };

  const deletarAtividade = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar esta atividade?')) return;
    try {
      await AtividadeService.deletarAtividade(id);
      setMensagem('Atividade deletada com sucesso!');
      await carregarAtividades();
    } catch (error) {
      setMensagem('Erro ao deletar atividade.');
      console.error(error);
    }
  };

  const abrirModalNovaAtividade = () => {
    // o serviço atribui o código definitivo ao criar
    setModoEdicao(false);
    setAtividadeEmEdicao(null);
    setNovaAtividadeCodigoIdentificacao('');
    setNovaAtividadeTitulo('');
    setNovaAtividadeDescricao('');
    setNovaAtividadeTipo('plantio');
    setNovaAtividadeTipoOutro('');
    setNovaAtividadeStatus('planejada');
    const hojeStr = new Date().toISOString().split('T')[0];
    setNovaAtividadeData(hojeStr);
    setNovaAtividadeDataVencimento('');
    setNovaAtividadeCultura('');
    setNovaAtividadeCusto(0);
    setNovaAtividadeResponsavel('');
    setNovaAtividadeNotas('');
    setModalAberto(true);
  };

  const abrirModalEdicaoAtividade = (atividade: Atividade) => {
    setModoEdicao(true);
    setAtividadeEmEdicao(atividade.id);
    setNovaAtividadeCodigoIdentificacao(atividade.codigoIdentificacao);
    setNovaAtividadeTitulo(atividade.titulo);
    setNovaAtividadeDescricao(atividade.descricao || '');
    setNovaAtividadeTipo(atividade.tipo);
    setNovaAtividadeTipoOutro('');
    setNovaAtividadeStatus(atividade.status);
  setNovaAtividadeData(atividade.data);
  setNovaAtividadeDataVencimento((atividade as any).dataVencimento || '');
    setNovaAtividadeCultura(atividade.cultura || '');
    setNovaAtividadeCusto(atividade.custo || 0);
    setNovaAtividadeResponsavel(atividade.responsavel || '');
    setNovaAtividadeNotas(atividade.notas || '');
    setModalAberto(true);
  };

  const formatarData = (d?: string) => {
    if (!d) return '-';
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return '-';
    return dt.toLocaleDateString('pt-BR');
  };

  const getCorStatus = (status: StatusAtividade) => {
    switch (status) {
      case 'planejada':
        return '#6c757d';
      case 'em_progresso':
        return '#ffc107';
      case 'concluida':
        return '#28a745';
      case 'cancelada':
        return '#dc3545';
      default:
        return '#000';
    }
  };

  const getNomeStatus = (status: StatusAtividade) => {
    switch (status) {
      case 'planejada':
        return 'Planejada';
      case 'em_progresso':
        return 'Em Progresso';
      case 'concluida':
        return 'Concluída';
      case 'cancelada':
        return 'Cancelada';
      default:
        return status;
    }
  };

  const getNomeTipo = (tipo: TipoAtividade) => {
    const mapa: Record<TipoAtividade, string> = {
      plantio: 'Plantio',
      irrigacao: 'Irrigação',
      adubacao: 'Adubação',
      praga: 'Controle de Pragas',
      colheita: 'Colheita',
      manutencao: 'Manutenção',
      outro: 'Outro',
    };
    return mapa[tipo] || tipo;
  };

  // Agrupar para Kanban
  const atividadesPorStatus = {
    planejada: atividades.filter(a => a.status === 'planejada'),
    em_progresso: atividades.filter(a => a.status === 'em_progresso'),
    concluida: atividades.filter(a => a.status === 'concluida'),
    cancelada: atividades.filter(a => a.status === 'cancelada'),
  };

  return (
    <div className="pagina-container-pai">
      <main className="conteudo-atividades">
        <h1>Atividades</h1>

        <BoxShadowPadrao>
          {/* Abas */}
          <div className="abas-atividades">
            <button
              className={`aba-botao ${abaAtiva === 'historico' ? 'ativa' : ''}`}
              onClick={() => setAbaAtiva('historico')}
            >
              Histórico
            </button>
            <button
              className={`aba-botao ${abaAtiva === 'kanban' ? 'ativa' : ''}`}
              onClick={() => setAbaAtiva('kanban')}
            >
              Kanban
            </button>
          </div>

          {/* Mensagem */}
          {mensagem && (
            <div className={`mensagem-atividades ${mensagem.includes('sucesso') ? 'sucesso' : 'erro'}`}>
              {mensagem}
            </div>
          )}

          {/* Aba: Histórico */}
          {abaAtiva === 'historico' && (
            <section className="secao-historico">
              <h2 className="titulo-secao">Todas as Atividades</h2>

              <div className="header-historico">
                <input
                  type="text"
                  placeholder="Buscar por código (AT-...) ou título"
                  value={filtroBuscaHist}
                  onChange={e => setFiltroBuscaHist(e.target.value)}
                  className="filtro-busca-historico"
                />
                <button className="btn-nova-atividade" onClick={() => abrirModalNovaAtividade()}>
                  + Nova Atividade
                </button>
              </div>

              {/* Filtros */}
              <div className="filtros-atividades">
                <label>
                  <span>Tipo</span>
                  <select value={filtroTipoHist} onChange={e => setFiltroTipoHist(e.target.value as any)}>
                    <option value="">Todos</option>
                    <option value="plantio">Plantio</option>
                    <option value="irrigacao">Irrigação</option>
                    <option value="adubacao">Adubação</option>
                    <option value="praga">Controle de Pragas</option>
                    <option value="colheita">Colheita</option>
                    <option value="manutencao">Manutenção</option>
                    <option value="outro">Outro</option>
                  </select>
                </label>

                <label>
                  <span>Status</span>
                  <select value={filtroStatusHist} onChange={e => setFiltroStatusHist(e.target.value as any)}>
                    <option value="">Todos</option>
                    <option value="planejada">Planejada</option>
                    <option value="em_progresso">Em Progresso</option>
                    <option value="concluida">Concluída</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </label>

                <label>
                  <span>Data Início</span>
                  <input
                    type="date"
                    value={filtroDataInicioHist}
                    onChange={e => setFiltroDataInicioHist(e.target.value)}
                  />
                </label>

                <label>
                  <span>Data Fim</span>
                  <input
                    type="date"
                    value={filtroDataFimHist}
                    onChange={e => setFiltroDataFimHist(e.target.value)}
                  />
                </label>

                <label>
                  <span>Cultura</span>
                  <input
                    type="text"
                    placeholder="Ex: Milho, Soja"
                    value={filtroCulturaHist}
                    onChange={e => setFiltroCulturaHist(e.target.value)}
                  />
                </label>

                <div className="botoes-filtros">
                  <button className="btn-pesquisar" onClick={() => aplicarFiltros('historico')}>
                    🔍 Pesquisar
                  </button>
                  <button className="btn-limpar" onClick={() => limparFiltros('historico')}>
                    ✕ Limpar
                  </button>
                </div>
              </div>

              {/* Tabela de atividades */}
              {carregando ? (
                <p>Carregando atividades...</p>
              ) : atividades.length === 0 ? (
                <p className="sem-dados">{mensagem || 'Nenhuma atividade cadastrada.'}</p>
              ) : (
                <div className="tabela-scroll">
                  <table className="tabela-atividades">
                    <thead>
                      <tr>
                        <th>Título</th>
                        <th>Tipo</th>
                        <th>Cultura</th>
                        <th>Registro</th>
                        <th>Vencimento</th>
                        <th>Status</th>
                        <th>Custo</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {atividades.map(ativ => (
                        <tr key={ativ.id}>
                          <td>{ativ.titulo}</td>
                          <td>{getNomeTipo(ativ.tipo)}</td>
                          <td>{ativ.cultura || '-'}</td>
                          <td>{formatarData(ativ.dataRegistro || ativ.data)}</td>
                          <td>{ativ.dataVencimento ? formatarData(ativ.dataVencimento) : '-'}</td>
                          <td>
                            <span
                              className="badge-status"
                              style={{ backgroundColor: getCorStatus(ativ.status) }}
                            >
                              {getNomeStatus(ativ.status)}
                            </span>
                          </td>
                          <td>{ativ.custo ? `R$ ${ativ.custo.toFixed(2)}` : '-'}</td>
                          <td className="acoes-atividade">
                            <select
                              value={ativ.status}
                              onChange={e => atualizarStatus(ativ.id, e.target.value as StatusAtividade)}
                              className="select-status-rapido"
                            >
                              <option value="planejada">Planejada</option>
                              <option value="em_progresso">Em Progresso</option>
                              <option value="concluida">Concluída</option>
                              <option value="cancelada">Cancelada</option>
                            </select>
                            <button
                              className="btn-editar-atividade"
                              onClick={() => abrirModalEdicaoAtividade(ativ)}
                            >
                              Editar
                            </button>
                            <button
                              className="btn-deletar-atividade"
                              onClick={() => deletarAtividade(ativ.id)}
                            >
                              Deletar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          {/* Aba: Kanban */}
          {abaAtiva === 'kanban' && (
            <section className="secao-kanban">
              <h2 className="titulo-secao">Kanban de Atividades</h2>

              <div className="header-kanban">
                <input
                  type="text"
                  placeholder="Buscar por código (AT-...) ou título"
                  value={filtroBuscaKan}
                  onChange={e => setFiltroBuscaKan(e.target.value)}
                  className="filtro-busca-kanban"
                />
                <button className="btn-pesquisar-kanban" onClick={() => aplicarFiltros('kanban')}>
                  🔍 Pesquisar
                </button>
                <button className="btn-limpar-kanban" onClick={() => limparFiltros('kanban')}>
                  ✕ Limpar
                </button>
                <button className="btn-nova-atividade" onClick={() => abrirModalNovaAtividade()}>
                  + Nova Atividade
                </button>
              </div>

              <div className="kanban-container">
                {(['planejada', 'em_progresso', 'concluida', 'cancelada'] as StatusAtividade[]).map(status => (
                  <div key={status} className="kanban-coluna">
                    <div
                      className="kanban-header"
                      style={{ backgroundColor: getCorStatus(status) }}
                    >
                      <h3>{getNomeStatus(status)}</h3>
                      <span className="kanban-count">{atividadesPorStatus[status].length}</span>
                    </div>
                    <div className="kanban-cards">
                      {atividadesPorStatus[status].map(ativ => (
                        <div key={ativ.id} className="kanban-card">
                          <div className="card-header">
                            <h4>{ativ.titulo}</h4>
                            <button
                              className="btn-close-card"
                              onClick={() => deletarAtividade(ativ.id)}
                            >
                              ×
                            </button>
                          </div>
                          <p className="card-codigo">{ativ.codigoIdentificacao}</p>
                          <p className="card-tipo">{getNomeTipo(ativ.tipo)}</p>
                          {ativ.cultura && <p className="card-cultura"> {ativ.cultura}</p>}
                          {ativ.custo && <p className="card-custo">R$ {ativ.custo.toFixed(2)}</p>}
                          <p className="card-data">Venc.: {ativ.dataVencimento ? formatarData(ativ.dataVencimento) : '-'}</p>
                          <p className="card-registro">Reg.: {formatarData(ativ.dataRegistro || ativ.data)}</p>
                          {ativ.descricao && <p className="card-descricao">{ativ.descricao}</p>}
                          <div className="card-actions">
                            <select
                              value={ativ.status}
                              onChange={e => atualizarStatus(ativ.id, e.target.value as StatusAtividade)}
                              className="select-status-card"
                            >
                              <option value="planejada">Planejada</option>
                              <option value="em_progresso">Em Progresso</option>
                              <option value="concluida">Concluída</option>
                              <option value="cancelada">Cancelada</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </BoxShadowPadrao>

        {/* Modal: Nova Atividade */}
        {modalAberto && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3>{modoEdicao ? 'Editar Atividade' : 'Nova Atividade'}</h3>
                <button className="modal-close" onClick={() => setModalAberto(false)}>
                  ×
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={salvarAtividade} className="form-atividade">
                  <label>
                    <span>Título</span>
                    <input
                      className={erroCamposModal.includes('titulo') ? 'campo-erro' : ''}
                      value={novaAtividadeTitulo}
                      onChange={e => setNovaAtividadeTitulo(e.target.value)}
                      placeholder="Ex: Plantio de Milho"
                    />
                    {erroCamposModal.includes('titulo') && (
                      <small className="campo-erro-msg">Título é obrigatório.</small>
                    )}
                  </label>

                  <label>
                    <span>Código de Identificação</span>
                    <input
                      type="text"
                      value={novaAtividadeCodigoIdentificacao}
                      readOnly
                      className="campo-readonly"
                      placeholder="Gerado automaticamente"
                    />
                    <small className="campo-info">Código gerado automaticamente</small>
                  </label>

                  <label>
                    <span>Descrição</span>
                    <textarea
                      value={novaAtividadeDescricao}
                      onChange={e => setNovaAtividadeDescricao(e.target.value)}
                      placeholder="Descrição detalhada (opcional)"
                      rows={3}
                    />
                  </label>

                  <label>
                    <span>Tipo</span>
                    <select value={novaAtividadeTipo} onChange={e => setNovaAtividadeTipo(e.target.value as TipoAtividade)}>
                      <option value="plantio">Plantio</option>
                      <option value="irrigacao">Irrigação</option>
                      <option value="adubacao">Adubação</option>
                      <option value="praga">Controle de Pragas</option>
                      <option value="colheita">Colheita</option>
                      <option value="manutencao">Manutenção</option>
                      <option value="outro">Outro</option>
                    </select>
                  </label>

                  {novaAtividadeTipo === 'outro' && (
                    <label>
                      <span>Especifique o tipo de atividade</span>
                      <input
                        type="text"
                        value={novaAtividadeTipoOutro}
                        onChange={e => setNovaAtividadeTipoOutro(e.target.value)}
                        placeholder="Ex: Limpeza de equipamentos"
                        className={erroCamposModal.includes('tipoOutro') ? 'erroInput' : ''}
                      />
                    </label>
                  )}

                  <label>
                    <span>Status</span>
                    <select value={novaAtividadeStatus} onChange={e => setNovaAtividadeStatus(e.target.value as StatusAtividade)}>
                      <option value="planejada">Planejada</option>
                      <option value="em_progresso">Em Progresso</option>
                      <option value="concluida">Concluída</option>
                      <option value="cancelada">Cancelada</option>
                    </select>
                  </label>

                  <label>
                    <span>Data</span>
                    <input
                      className={erroCamposModal.includes('data') ? 'campo-erro' : ''}
                      type="date"
                      value={novaAtividadeData}
                      onChange={e => setNovaAtividadeData(e.target.value)}
                    />
                    {erroCamposModal.includes('data') && (
                      <small className="campo-erro-msg">Data é obrigatória.</small>
                    )}
                  </label>

                  <label>
                    <span>Data de Vencimento</span>
                    <input
                      type="date"
                      value={novaAtividadeDataVencimento}
                      onChange={e => setNovaAtividadeDataVencimento(e.target.value)}
                    />
                    <small className="campo-info">Opcional — data de vencimento/entrega da atividade</small>
                  </label>

                  <label>
                    <span>Cultura</span>
                    <input
                      value={novaAtividadeCultura}
                      onChange={e => setNovaAtividadeCultura(e.target.value)}
                      placeholder="Ex: Milho, Soja"
                    />
                  </label>

                  <label>
                    <span>Custo Estimado (R$)</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={novaAtividadeCusto}
                      onChange={e => setNovaAtividadeCusto(Number(e.target.value))}
                    />
                  </label>

                  <label>
                    <span>Responsável</span>
                    <input
                      value={novaAtividadeResponsavel}
                      onChange={e => setNovaAtividadeResponsavel(e.target.value)}
                      placeholder="Nome do responsável"
                    />
                  </label>

                  <label>
                    <span>Notas</span>
                    <textarea
                      value={novaAtividadeNotas}
                      onChange={e => setNovaAtividadeNotas(e.target.value)}
                      placeholder="Notas adicionais"
                      rows={2}
                    />
                  </label>

                  <div className="modal-actions">
                    <button type="submit" className={`btn-acao ${isSubmitting ? 'ativa' : ''}`} disabled={isSubmitting}>
                      {isSubmitting ? 'Salvando...' : 'Salvar Atividade'}
                    </button>
                    <button type="button" className="btn-sec" onClick={() => setModalAberto(false)}>
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};


export default Atividades;
