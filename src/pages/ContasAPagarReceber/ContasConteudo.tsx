import { useState, useEffect } from 'react';
import type { Conta, TipoConta, StatusConta } from '../../services/ContasService';
import ContasService from '../../services/ContasService';
import './Contas.css';

const ContasConteudo = () => {
  // Abas
  const [abaAtiva, setAbaAtiva] = useState<'resumo' | 'pagar' | 'receber' | 'cadastro'>('resumo');

  // Contas
  const [contas, setContas] = useState<Conta[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState('');

  // Filtros
  const [dataInicio, setDataInicio] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
  );
  const [dataFim, setDataFim] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [statusFiltro, setStatusFiltro] = useState<StatusConta | ''>('');

  // Resumo
  const [resumo, setResumo] = useState({
    totalAPagar: 0,
    totalAReceber: 0,
    atrasado: 0,
    vencidosProximos7Dias: 0,
  });

  // Form de nova conta
  const [formDados, setFormDados] = useState({
    tipo: 'pagar' as TipoConta,
    descricao: '',
    valor: '',
    dataVencimento: '',
    categoria: 'outros',
    observacoes: '',
  });

  // Categorias dinâmicas
  const categoriasDefault = ['outros', 'folha', 'fornecedores', 'utilidades', 'impostos', 'vendas', 'clientes'];
  const [categorias, setCategorias] = useState<string[]>(categoriasDefault);
  const [mostrarPopupCategoria, setMostrarPopupCategoria] = useState(false);
  const [novaCategoria, setNovaCategoria] = useState('');

  // Busca resumo ao montar
  useEffect(() => {
    buscarResumo();
  }, []);

  // Busca contas quando muda a aba ou filtros
  useEffect(() => {
    if (abaAtiva !== 'cadastro') {
      buscarContas();
    }
  }, [abaAtiva, dataInicio, dataFim, statusFiltro]);

  const buscarResumo = async () => {
    try {
      const novoResumo = await ContasService.obterResumoFinanceiro();
      setResumo(novoResumo);
    } catch (erro) {
      console.error('Erro ao buscar resumo:', erro);
    }
  };

  const buscarContas = async () => {
    setCarregando(true);
    setMensagem('');
    try {
      let resultado: Conta[] = [];

      if (abaAtiva === 'pagar') {
        resultado = await ContasService.listarContasAPagar();
      } else if (abaAtiva === 'receber') {
        resultado = await ContasService.listarContasAReceber();
      }

      // Filtro por período
      const contasFiltradas = resultado.filter(c => {
        const dataVenc = new Date(c.dataVencimento);
        const inicio = new Date(dataInicio);
        const fim = new Date(dataFim);
        return dataVenc >= inicio && dataVenc <= fim;
      });

      // Filtro por status
      const contasFinais = statusFiltro
        ? contasFiltradas.filter(c => c.status === statusFiltro)
        : contasFiltradas;

      setContas(contasFinais);
      if (contasFinais.length === 0) {
        setMensagem('Nenhuma conta encontrada para os filtros selecionados.');
      }
    } catch (erro) {
      console.error('Erro ao buscar contas:', erro);
      setMensagem('Erro ao buscar contas.');
    } finally {
      setCarregando(false);
    }
  };

  const handleCriarConta = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formDados.descricao || !formDados.valor || !formDados.dataVencimento) {
      setMensagem('Preencha todos os campos obrigatórios.');
      return;
    }

    try {
      await ContasService.criarConta({
        tipo: formDados.tipo,
        descricao: formDados.descricao,
        valor: parseFloat(formDados.valor),
        dataVencimento: formDados.dataVencimento,
        categoria: formDados.categoria,
        observacoes: formDados.observacoes,
        status: 'pendente',
      });

      setMensagem('Conta criada com sucesso!');
      setFormDados({
        tipo: 'pagar',
        descricao: '',
        valor: '',
        dataVencimento: '',
        categoria: 'outros',
        observacoes: '',
      });

      // Volta para resumo após criar
      setTimeout(() => {
        setAbaAtiva('resumo');
        buscarResumo();
      }, 1500);
    } catch (erro) {
      console.error('Erro ao criar conta:', erro);
      setMensagem('Erro ao criar conta.');
    }
  };

  const handleAdicionarCategoria = () => {
    if (!novaCategoria.trim()) {
      setMensagem('Digite uma categoria válida.');
      return;
    }

    const categoriaNormalizada = novaCategoria.toLowerCase().trim();
    if (categorias.includes(categoriaNormalizada)) {
      setMensagem('Esta categoria já existe.');
      return;
    }

    setCategorias([...categorias, categoriaNormalizada]);
    setFormDados({ ...formDados, categoria: categoriaNormalizada });
    setNovaCategoria('');
    setMostrarPopupCategoria(false);
    setMensagem('Categoria adicionada com sucesso!');
    
    setTimeout(() => {
      setMensagem('');
    }, 2000);
  };

  const handleMarcarComoPaga = async (id: string) => {
    try {
      const hoje = new Date().toISOString().split('T')[0];
      await ContasService.marcarComoPaga(id, hoje);
      setMensagem('Conta marcada como paga!');
      buscarContas();
      buscarResumo();
    } catch (erro) {
      console.error('Erro ao marcar como paga:', erro);
      setMensagem('Erro ao marcar conta como paga.');
    }
  };

  const handleDeletarConta = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar esta conta?')) {
      try {
        await ContasService.deletarConta(id);
        setMensagem('Conta deletada com sucesso!');
        buscarContas();
        buscarResumo();
      } catch (erro) {
        console.error('Erro ao deletar conta:', erro);
        setMensagem('Erro ao deletar conta.');
      }
    }
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  };

  const obterCor = (status: StatusConta) => {
    switch (status) {
      case 'pago':
        return '#198754';
      case 'pendente':
        return '#ffc107';
      case 'atrasado':
        return '#dc3545';
      case 'cancelado':
        return '#6c757d';
      default:
        return '#0d6efd';
    }
  };

  const obterTextoStatus = (status: StatusConta) => {
    switch (status) {
      case 'pago':
        return 'Pago';
      case 'pendente':
        return 'Pendente';
      case 'atrasado':
        return 'Atrasado';
      case 'cancelado':
        return 'Cancelado';
      default:
        return status;
    }
  };

  return (
    <div className="contas-container">
      {/* Abas */}
      <div className="abas-contas">
        <button
          className={`aba-botao ${abaAtiva === 'resumo' ? 'ativa' : ''}`}
          onClick={() => setAbaAtiva('resumo')}
        >
          📊 Resumo
        </button>
        <button
          className={`aba-botao ${abaAtiva === 'pagar' ? 'ativa' : ''}`}
          onClick={() => setAbaAtiva('pagar')}
        >
          💳 Contas a Pagar
        </button>
        <button
          className={`aba-botao ${abaAtiva === 'receber' ? 'ativa' : ''}`}
          onClick={() => setAbaAtiva('receber')}
        >
          💰 Contas a Receber
        </button>
        <button
          className={`aba-botao ${abaAtiva === 'cadastro' ? 'ativa' : ''}`}
          onClick={() => setAbaAtiva('cadastro')}
        >
          ➕ Cadastrar Conta
        </button>
      </div>

      {/* Mensagem */}
      {mensagem && (
        <div className={`mensagem-contas ${mensagem.includes('sucesso') ? 'sucesso' : 'erro'}`}>
          {mensagem}
        </div>
      )}

      {/* ABA: RESUMO */}
      {abaAtiva === 'resumo' && (
        <section className="secao-resumo">
          <div className="cards-resumo">
            <div className="card-resumo card-a-pagar">
              <h3>Total a Pagar</h3>
              <p className="valor-resumo">{formatarMoeda(resumo.totalAPagar)}</p>
              <span className="subtexto">Contas pendentes</span>
            </div>

            <div className="card-resumo card-a-receber">
              <h3>Total a Receber</h3>
              <p className="valor-resumo">{formatarMoeda(resumo.totalAReceber)}</p>
              <span className="subtexto">Contas pendentes</span>
            </div>

            <div className="card-resumo card-atrasado">
              <h3>Atrasado</h3>
              <p className="valor-resumo">{formatarMoeda(resumo.atrasado)}</p>
              <span className="subtexto">Vencidas</span>
            </div>

            <div className="card-resumo card-proximo">
              <h3>Próximos 7 dias</h3>
              <p className="valor-resumo">{formatarMoeda(resumo.vencidosProximos7Dias)}</p>
              <span className="subtexto">A vencer</span>
            </div>
          </div>
        </section>
      )}

      {/* ABA: CADASTRO */}
      {abaAtiva === 'cadastro' && (
        <section className="secao-cadastro-conta">
          <form onSubmit={handleCriarConta} className="formulario-conta">
            <div className="form-row">
              <label>
                <span>Tipo de Conta *</span>
                <select
                  value={formDados.tipo}
                  onChange={(e) =>
                    setFormDados({ ...formDados, tipo: e.target.value as TipoConta })
                  }
                >
                  <option value="pagar">Conta a Pagar</option>
                  <option value="receber">Conta a Receber</option>
                </select>
              </label>

              <label>
                <span>Descrição *</span>
                <input
                  type="text"
                  placeholder="Ex: Conta de luz"
                  value={formDados.descricao}
                  onChange={(e) =>
                    setFormDados({ ...formDados, descricao: e.target.value })
                  }
                />
              </label>
            </div>

            <div className="form-row">
              <label>
                <span>Valor (R$) *</span>
                <input
                  type="number"
                  placeholder="0,00"
                  step="0.01"
                  min="0"
                  value={formDados.valor}
                  onChange={(e) =>
                    setFormDados({ ...formDados, valor: e.target.value })
                  }
                />
              </label>

              <label>
                <span>Data de Vencimento *</span>
                <input
                  type="date"
                  value={formDados.dataVencimento}
                  onChange={(e) =>
                    setFormDados({ ...formDados, dataVencimento: e.target.value })
                  }
                />
              </label>
            </div>

            <div className="form-row">
              <label>
                <span>Categoria</span>
                <select
                  value={formDados.categoria}
                  onChange={(e) =>
                    setFormDados({ ...formDados, categoria: e.target.value })
                  }
                >
                  {categorias.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, ' ')}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="btn-nova-categoria"
                  onClick={() => setMostrarPopupCategoria(true)}
                >
                  + Nova Categoria
                </button>
              </label>

              <label>
                <span>Observações</span>
                <textarea
                  placeholder="Adicione observações..."
                  value={formDados.observacoes}
                  onChange={(e) =>
                    setFormDados({ ...formDados, observacoes: e.target.value })
                  }
                />
              </label>
            </div>

            <button type="submit" className="btn-salvar-conta">
              Cadastrar Conta
            </button>
          </form>
        </section>
      )}

      {/* ABA: CONTAS A PAGAR ou RECEBER */}
      {(abaAtiva === 'pagar' || abaAtiva === 'receber') && (
        <section className="secao-listagem-contas">
          <div className="filtro-periodo-contas">
            <label>
              <span>Data Início</span>
              <input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
              />
            </label>
            <label>
              <span>Data Fim</span>
              <input
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
              />
            </label>
            <label>
              <span>Status</span>
              <select
                value={statusFiltro}
                onChange={(e) => setStatusFiltro(e.target.value as StatusConta | '')}
              >
                <option value="">Todos</option>
                <option value="pendente">Pendente</option>
                <option value="pago">Pago</option>
                <option value="atrasado">Atrasado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </label>
            <button onClick={buscarContas} disabled={carregando}>
              {carregando ? 'Carregando...' : 'Filtrar'}
            </button>
          </div>

          {contas.length > 0 ? (
            <div className="tabela-contas">
              <table>
                <thead>
                  <tr>
                    <th>Descrição</th>
                    <th>Valor</th>
                    <th>Vencimento</th>
                    <th>Status</th>
                    <th>Categoria</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {contas.map(conta => (
                    <tr key={conta.id}>
                      <td>{conta.descricao}</td>
                      <td className="valor-tabela">{formatarMoeda(conta.valor)}</td>
                      <td>
                        {new Date(conta.dataVencimento).toLocaleDateString('pt-BR')}
                      </td>
                      <td>
                        <span
                          className="badge-status"
                          style={{ backgroundColor: obterCor(conta.status) }}
                        >
                          {obterTextoStatus(conta.status)}
                        </span>
                      </td>
                      <td>{conta.categoria}</td>
                      <td className="acoes-tabela">
                        {conta.status !== 'pago' && conta.status !== 'cancelado' && (
                          <button
                            className="btn-marcar-pago"
                            onClick={() => handleMarcarComoPaga(conta.id)}
                            title="Marcar como pago"
                          >
                            ✓
                          </button>
                        )}
                        <button
                          className="btn-deletar"
                          onClick={() => handleDeletarConta(conta.id)}
                          title="Deletar"
                        >
                          🗑
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mensagem-vazio">{mensagem || 'Nenhuma conta encontrada.'}</div>
          )}
        </section>
      )}

      {/* POPUP: NOVA CATEGORIA */}
      {mostrarPopupCategoria && (
        <div className="overlay-popup">
          <div className="popup-categoria">
            <div className="popup-header">
              <h2>Nova Categoria</h2>
              <button
                type="button"
                className="btn-fechar-popup"
                onClick={() => {
                  setMostrarPopupCategoria(false);
                  setNovaCategoria('');
                }}
              >
                ✕
              </button>
            </div>

            <div className="popup-body">
              <label>
                <span>Digite a nova categoria:</span>
                <input
                  type="text"
                  placeholder="Ex: Manutenção"
                  value={novaCategoria}
                  onChange={(e) => setNovaCategoria(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAdicionarCategoria();
                    }
                  }}
                  autoFocus
                />
              </label>
            </div>

            <div className="popup-footer">
              <button
                type="button"
                className="btn-cancelar"
                onClick={() => {
                  setMostrarPopupCategoria(false);
                  setNovaCategoria('');
                }}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn-confirmar"
                onClick={handleAdicionarCategoria}
              >
                Cadastrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContasConteudo;
