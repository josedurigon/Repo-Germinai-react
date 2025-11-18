import { useEffect, useState } from "react";
import "./PedidoCompraConteudo.css";
import type { PedidoCompra } from "../../services/PedidoCompraService";
import {
  criarPedidoCompra,
  listarPedidosPorPeriodo,
  deletarPedidoCompra,
  atualizarPedidoCompra,
} from "../../services/PedidoCompraService";

export default function PedidoCompraConteudo() {
  // Estado da aba ativa
  const [abaAtiva, setAbaAtiva] = useState<"novo" | "listar">("novo");

  // Estado do formulário de novo pedido
  const [idPedido, setIdPedido] = useState("");
  const [fornecedor, setFornecedor] = useState("");
  const [data, setData] = useState(() => new Date().toISOString().slice(0, 10));
  const [statusElaboracao, setStatusElaboracao] = useState<'Rascunho' | 'Revisado'>("Rascunho");
  const [itens, setItens] = useState([
    { id: 1, descricao: "Parafusos", quantidade: 100, precoUnitario: 0.12 },
    { id: 2, descricao: "Porcas", quantidade: 50, precoUnitario: 0.09 },
  ]);

  // Estado da listagem de pedidos
  const [pedidos, setPedidos] = useState<PedidoCompra[]>([]);
  const [dataInicio, setDataInicio] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().slice(0, 10);
  });
  const [dataFim, setDataFim] = useState(() => new Date().toISOString().slice(0, 10));
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [filtroFornecedorListagem, setFiltroFornecedorListagem] = useState("");
  const [filtroStatusElaboracao, setFiltroStatusElaboracao] = useState("");
  const [filtroStatusAcoes, setFiltroStatusAcoes] = useState("");

  // Estado para edição de pedido
  const [pedidoEditando, setPedidoEditando] = useState<PedidoCompra | null>(null);
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
  const [edicaoFornecedor, setEdicaoFornecedor] = useState("");
  const [edicaoData, setEdicaoData] = useState("");
  const [edicaoStatusElaboracao, setEdicaoStatusElaboracao] = useState<'Rascunho' | 'Revisado'>('Rascunho');
  const [edicaoItens, setEdicaoItens] = useState<any[]>([]);

  // Filtros para aba de novo pedido
  const [filtroFornecedor, setFiltroFornecedor] = useState("");
  const [filtroDataInicio, setFiltroDataInicio] = useState("");
  const [filtroDataFim, setFiltroDataFim] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [pedidosFiltroCk, setPedidosFiltroCk] = useState<PedidoCompra[]>([]);
  const [filtrosAplicados, setFiltrosAplicados] = useState(false);
  const [mensagemFiltro, setMensagemFiltro] = useState("");

  // Buscar pedidos ao mudar de aba ou datas
  useEffect(() => {
    if (abaAtiva === "listar") {
      buscarPedidos();
    } else {
      // Limpar mensagem quando sai da aba de listagem
      setMensagem("");
    }
  }, [abaAtiva, dataInicio, dataFim]);

  const buscarPedidos = async () => {
    setCarregando(true);
    setMensagem("");
    try {
      let pedidosBuscados = await listarPedidosPorPeriodo(dataInicio, dataFim);
      
      // Filtrar por fornecedor se preenchido
      if (filtroFornecedorListagem.trim()) {
        pedidosBuscados = pedidosBuscados.filter(p => 
          p.fornecedor.toLowerCase().includes(filtroFornecedorListagem.toLowerCase())
        );
      }
      
      // Filtrar por status de elaboração se preenchido
      if (filtroStatusElaboracao) {
        pedidosBuscados = pedidosBuscados.filter(p => 
          p.statusElaboracao === filtroStatusElaboracao
        );
      }
      
      // Filtrar por status de ações se preenchido
      if (filtroStatusAcoes) {
        pedidosBuscados = pedidosBuscados.filter(p => 
          p.statusAcoes === filtroStatusAcoes
        );
      }
      
      setPedidos(pedidosBuscados);
      if (pedidosBuscados.length === 0) {
        setMensagem("Nenhum pedido encontrado para o período selecionado.");
      }
    } catch (error) {
      setMensagem("Erro ao buscar pedidos. Tente novamente.");
      console.error(error);
    } finally {
      setCarregando(false);
    }
  };

  const adicionarItem = () => {
    const proximoId = itens.length ? Math.max(...itens.map((i) => i.id)) + 1 : 1;
    setItens([...itens, { id: proximoId, descricao: "", quantidade: 1, precoUnitario: 0 }]);
  };

  const atualizarItem = (id: number, campo: string, valor: unknown) => {
    setItens(itens.map((it) => (it.id === id ? { ...it, [campo]: valor } : it)));
  };

  const removerItem = (id: number) => {
    setItens(itens.filter((it) => it.id !== id));
  };

  const total = itens.reduce((acc, it) => acc + Number(it.quantidade) * Number(it.precoUnitario || 0), 0);

  // Salvar pedido
  const salvarPedido = async () => {
    if (!fornecedor.trim()) {
      setMensagem("Por favor, preencha o nome do fornecedor.");
      return;
    }
    if (itens.length === 0) {
      setMensagem("Adicione pelo menos um item ao pedido.");
      return;
    }

    setCarregando(true);
    setMensagem("");
    try {
      const novoPedido: PedidoCompra = {
        fornecedor,
        data,
        statusElaboracao,
        status: statusElaboracao as any,
        itens: itens.map(({ id, ...rest }) => rest),
      };
      await criarPedidoCompra(novoPedido);
      setMensagem("Pedido salvo com sucesso!");
      // Limpar formulário
      setFornecedor("");
      setData(new Date().toISOString().slice(0, 10));
      setStatusElaboracao("Rascunho");
      setItens([
        { id: 1, descricao: "", quantidade: 1, precoUnitario: 0 },
      ]);
      // Voltar para listagem
      setAbaAtiva("listar");
    } catch (error) {
      setMensagem("Erro ao salvar pedido. Tente novamente.");
      console.error(error);
    } finally {
      setCarregando(false);
    }
  };

  // Deletar pedido
  const excluirPedido = async (id: number | undefined) => {
    if (!id || !confirm("Tem certeza que deseja deletar este pedido?")) return;
    try {
      await deletarPedidoCompra(id);
      setPedidos(pedidos.filter((p) => p.id !== id));
      setMensagem("Pedido deletado com sucesso!");
    } catch (error) {
      setMensagem("Erro ao deletar pedido.");
      console.error(error);
    }
  };

  // Aprovar pedido
  const aprovarPedido = async (id: number) => {
    try {
      const pedido = pedidos.find(p => p.id === id);
      if (!pedido) return;
      
      const pedidoAtualizado = { ...pedido, statusAcoes: "Aprovado" as const };
      await atualizarPedidoCompra(id, pedidoAtualizado);
      setPedidos(pedidos.map(p => p.id === id ? pedidoAtualizado : p));
      setMensagem("Pedido aprovado com sucesso!");
    } catch (error) {
      setMensagem("Erro ao aprovar pedido.");
      console.error(error);
    }
  };

  // Recusar pedido
  const recusarPedido = async (id: number) => {
    try {
      const pedido = pedidos.find(p => p.id === id);
      if (!pedido) return;
      
      const pedidoAtualizado = { ...pedido, statusAcoes: "Recusado" as const };
      await atualizarPedidoCompra(id, pedidoAtualizado);
      setPedidos(pedidos.map(p => p.id === id ? pedidoAtualizado : p));
      setMensagem("Pedido recusado com sucesso!");
    } catch (error) {
      setMensagem("Erro ao recusar pedido.");
      console.error(error);
    }
  };

  // Abrir modal de edição
  const editarPedido = (pedido: PedidoCompra) => {
    setPedidoEditando(pedido);
    setEdicaoFornecedor(pedido.fornecedor);
    setEdicaoData(pedido.data);
    setEdicaoStatusElaboracao(pedido.statusElaboracao || 'Rascunho');
    setEdicaoItens(pedido.itens.map((item, idx) => ({ id: idx + 1, ...item })));
    setModalEdicaoAberto(true);
  };

  // Salvar edição do pedido
  const salvarEdicaoPedido = async () => {
    if (!pedidoEditando || !pedidoEditando.id) return;
    
    if (!edicaoFornecedor.trim()) {
      setMensagem("Por favor, preencha o nome do fornecedor.");
      return;
    }
    if (edicaoItens.length === 0) {
      setMensagem("Adicione pelo menos um item ao pedido.");
      return;
    }

    setCarregando(true);
    try {
      const pedidoAtualizado: PedidoCompra = {
        ...pedidoEditando,
        fornecedor: edicaoFornecedor,
        data: edicaoData,
        statusElaboracao: edicaoStatusElaboracao,
        itens: edicaoItens.map(({ id, ...rest }) => rest),
      };
      
      await atualizarPedidoCompra(pedidoEditando.id, pedidoAtualizado);
      setPedidos(pedidos.map(p => p.id === pedidoEditando.id ? pedidoAtualizado : p));
      setMensagem("Pedido atualizado com sucesso!");
      setModalEdicaoAberto(false);
      setPedidoEditando(null);
    } catch (error) {
      setMensagem("Erro ao atualizar pedido.");
      console.error(error);
    } finally {
      setCarregando(false);
    }
  };

  // Funções para manipular itens na edição
  const adicionarItemEdicao = () => {
    const novoId = edicaoItens.length > 0 ? Math.max(...edicaoItens.map(i => i.id)) + 1 : 1;
    setEdicaoItens([...edicaoItens, { id: novoId, descricao: "", quantidade: 1, precoUnitario: 0 }]);
  };

  const atualizarItemEdicao = (id: number, campo: string, valor: any) => {
    setEdicaoItens(edicaoItens.map(it => it.id === id ? { ...it, [campo]: valor } : it));
  };

  const removerItemEdicao = (id: number) => {
    setEdicaoItens(edicaoItens.filter(it => it.id !== id));
  };

  // Aplicar filtros na aba de novo pedido
  const aplicarFiltrosNovo = async () => {
    setCarregando(true);
    setMensagemFiltro("");
    try {
      let resultado = await listarPedidosPorPeriodo(
        filtroDataInicio || dataInicio,
        filtroDataFim || dataFim
      );

      // Filtrar por fornecedor
      if (filtroFornecedor.trim()) {
        resultado = resultado.filter((p) =>
          p.fornecedor.toLowerCase().includes(filtroFornecedor.toLowerCase())
        );
      }

      // Filtrar por status
      if (filtroStatus) {
        resultado = resultado.filter((p) => p.status === filtroStatus);
      }

      setPedidosFiltroCk(resultado);
      setFiltrosAplicados(true);
      if (resultado.length === 0) {
        setMensagemFiltro("Nenhum pedido encontrado com os filtros aplicados.");
      }
    } catch (error) {
      setMensagemFiltro("Erro ao aplicar filtros.");
      console.error(error);
    } finally {
      setCarregando(false);
    }
  };

  // Limpar filtros
  const limparFiltros = () => {
    setFiltroFornecedor("");
    setFiltroDataInicio("");
    setFiltroDataFim("");
    setFiltroStatus("");
    setPedidosFiltroCk([]);
    setFiltrosAplicados(false);
    setMensagemFiltro("");
  };

  return (
    <div className="pedido-compra-container">
      {/* Abas */}
      <div className="abas-pedido">
        <button
          className={`aba-botao ${abaAtiva === "novo" ? "ativa" : ""}`}
          onClick={() => setAbaAtiva("novo")}
        >
          Novo Pedido
        </button>
        <button
          className={`aba-botao ${abaAtiva === "listar" ? "ativa" : ""}`}
          onClick={() => setAbaAtiva("listar")}
        >
          Visualizar Pedidos
        </button>
      </div>

      {/* Mensagem */}
      {mensagem && (
        <div className={`mensagem ${mensagem.includes("sucesso") ? "sucesso" : "erro"}`}>
          {mensagem}
        </div>
      )}

      {/* Conteúdo das abas */}
      {abaAtiva === "novo" ? (
        <section className="container-pedido">
          <div className="dados-pedido">
            <label>
              <span>ID do Pedido</span>
              <input
                value={idPedido}
                onChange={(e) => setIdPedido(e.target.value)}
                placeholder="Identificação do pedido"
              />
            </label>

            <label>
              <span>Fornecedor</span>
              <input
                value={fornecedor}
                onChange={(e) => setFornecedor(e.target.value)}
                placeholder="Nome do fornecedor"
              />
            </label>

            <label>
              <span>Data</span>
              <input type="date" value={data} onChange={(e) => setData(e.target.value)} />
            </label>

            <label>
              <span>Status de Elaboração</span>
              <select value={statusElaboracao} onChange={(e) => setStatusElaboracao(e.target.value as 'Rascunho' | 'Revisado')}>
                <option>Rascunho</option>
                <option>Revisado</option>
              </select>
            </label>
          </div>

          <div className="tabela-container">
            <div className="cabecalho-itens">
              <h2>Itens do pedido</h2>
              <button onClick={adicionarItem}>Adicionar item</button>
            </div>

            <div className="tabela-scroll">
              <table className="tabela-itens">
                <thead>
                  <tr>
                    <th>Descrição</th>
                    <th>Quantidade</th>
                    <th>Preço unit.</th>
                    <th>Subtotal</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {itens.map((it) => (
                    <tr key={it.id}>
                      <td>
                        <input
                          value={it.descricao}
                          onChange={(e) => atualizarItem(it.id, "descricao", e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          value={it.quantidade}
                          onChange={(e) => atualizarItem(it.id, "quantidade", Number(e.target.value))}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={it.precoUnitario}
                          onChange={(e) => atualizarItem(it.id, "precoUnitario", Number(e.target.value))}
                        />
                      </td>
                      <td>R$ {(it.quantidade * it.precoUnitario).toFixed(2)}</td>
                      <td>
                        <button onClick={() => removerItem(it.id)}>Remover</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="total-e-acoes">
            <div className="total-container">
              <div>Total do pedido</div>
              <div className="total-valor">R$ {total.toFixed(2)}</div>
            </div>
            <button className="btn-salvar-pedido" onClick={salvarPedido} disabled={carregando}>
              {carregando ? "Salvando..." : "Salvar Pedido"}
            </button>
          </div>
        </section>
      ) : (
        <section className="container-listagem">
          <div className="filtro-periodo">
            <label>
              <span>Fornecedor</span>
              <input
                type="text"
                value={filtroFornecedorListagem}
                onChange={(e) => setFiltroFornecedorListagem(e.target.value)}
                placeholder="Nome do fornecedor"
              />
            </label>
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
              <span>Status de Elaboração</span>
              <select
                value={filtroStatusElaboracao}
                onChange={(e) => setFiltroStatusElaboracao(e.target.value)}
              >
                <option value="">Todos</option>
                <option value="Rascunho">Rascunho</option>
                <option value="Revisado">Revisado</option>
              </select>
            </label>
            <label>
              <span>Status de Ações</span>
              <select
                value={filtroStatusAcoes}
                onChange={(e) => setFiltroStatusAcoes(e.target.value)}
              >
                <option value="">Todos</option>
                <option value="Aprovado">Aprovado</option>
                <option value="Recusado">Recusado</option>
              </select>
            </label>
            <button onClick={buscarPedidos} disabled={carregando}>
              {carregando ? "Carregando..." : "Filtrar"}
            </button>
          </div>

          {carregando && <div className="carregando">Carregando pedidos...</div>}

          {!carregando && pedidos.length > 0 && (
            <div className="tabela-scroll">
              <table className="tabela-listagem">
                <thead>
                  <tr>
                    <th style={{ textAlign: 'center' }}>ID</th>
                    <th style={{ textAlign: 'left' }}>Fornecedor</th>
                    <th style={{ textAlign: 'center' }}>Data</th>
                    <th style={{ textAlign: 'center' }}>Status de Elaboração</th>
                    <th style={{ textAlign: 'center' }}>Status de Ações</th>
                    <th style={{ textAlign: 'center' }}>Qtd. Itens</th>
                    <th style={{ textAlign: 'right' }}>Total</th>
                    <th style={{ textAlign: 'center' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.map((pedido) => (
                    <tr key={pedido.id}>
                      <td style={{ textAlign: 'center' }}>{pedido.id}</td>
                      <td style={{ textAlign: 'left' }}>{pedido.fornecedor}</td>
                      <td style={{ textAlign: 'center' }}>{new Date(pedido.data).toLocaleDateString("pt-BR")}</td>
                      <td style={{ textAlign: 'center' }}>
                        <span className={`status-badge status-${(pedido.statusElaboracao || 'Rascunho').toLowerCase()}`}>
                          {pedido.statusElaboracao || 'Rascunho'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {pedido.statusAcoes ? (
                          <span className={`status-badge status-${pedido.statusAcoes.toLowerCase()}`}>
                            {pedido.statusAcoes}
                          </span>
                        ) : (
                          <span style={{ color: '#999' }}>-</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'center' }}>{pedido.itens.length}</td>
                      <td style={{ textAlign: 'right' }}>R$ {(pedido.total || 0).toFixed(2)}</td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button
                            style={{
                              backgroundColor: '#ff9800',
                              color: '#fff',
                              border: 'none',
                              padding: '6px 12px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontWeight: '500'
                            }}
                            onClick={() => editarPedido(pedido)}
                          >
                            Editar
                          </button>
                          <button
                            style={{
                              backgroundColor: '#28a745',
                              color: '#fff',
                              border: 'none',
                              padding: '6px 12px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontWeight: '500'
                            }}
                            onClick={() => aprovarPedido(pedido.id!)}
                            disabled={pedido.statusAcoes === 'Aprovado'}
                          >
                            Aprovar
                          </button>
                          <button
                            style={{
                              backgroundColor: '#d32f2f',
                              color: '#fff',
                              border: 'none',
                              padding: '6px 12px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontWeight: '500'
                            }}
                            onClick={() => recusarPedido(pedido.id!)}
                            disabled={pedido.statusAcoes === 'Recusado'}
                          >
                            Recusar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!carregando && pedidos.length === 0 && mensagem && (
            <div className="sem-dados">{mensagem}</div>
          )}
        </section>
      )}

      {/* Modal de Edição de Pedido */}
      {modalEdicaoAberto && pedidoEditando && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '800px', width: '90%' }}>
            <div className="modal-header">
              <h3>Editar Pedido #{pedidoEditando.id}</h3>
              <button className="modal-close" onClick={() => setModalEdicaoAberto(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="dados-pedido">
                <label>
                  <span>Fornecedor</span>
                  <input
                    value={edicaoFornecedor}
                    onChange={(e) => setEdicaoFornecedor(e.target.value)}
                    placeholder="Nome do fornecedor"
                  />
                </label>

                <label>
                  <span>Data</span>
                  <input type="date" value={edicaoData} onChange={(e) => setEdicaoData(e.target.value)} />
                </label>

                <label>
                  <span>Status de Elaboração</span>
                  <select value={edicaoStatusElaboracao} onChange={(e) => setEdicaoStatusElaboracao(e.target.value as 'Rascunho' | 'Revisado')}>
                    <option>Rascunho</option>
                    <option>Revisado</option>
                  </select>
                </label>
              </div>

              <div className="tabela-container" style={{ marginTop: '20px' }}>
                <div className="cabecalho-itens">
                  <h3>Itens do pedido</h3>
                  <button onClick={adicionarItemEdicao}>Adicionar item</button>
                </div>

                <div className="tabela-scroll">
                  <table className="tabela-itens">
                    <thead>
                      <tr>
                        <th>Descrição</th>
                        <th>Quantidade</th>
                        <th>Preço unit.</th>
                        <th>Subtotal</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {edicaoItens.map((it) => (
                        <tr key={it.id}>
                          <td>
                            <input
                              value={it.descricao}
                              onChange={(e) => atualizarItemEdicao(it.id, "descricao", e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              min="0"
                              value={it.quantidade}
                              onChange={(e) => atualizarItemEdicao(it.id, "quantidade", Number(e.target.value))}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={it.precoUnitario}
                              onChange={(e) => atualizarItemEdicao(it.id, "precoUnitario", Number(e.target.value))}
                            />
                          </td>
                          <td>R$ {(Number(it.quantidade) * Number(it.precoUnitario || 0)).toFixed(2)}</td>
                          <td>
                            <button onClick={() => removerItemEdicao(it.id)}>Remover</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="total-pedido">
                  <strong>Total: R$ {edicaoItens.reduce((acc, it) => acc + Number(it.quantidade) * Number(it.precoUnitario || 0), 0).toFixed(2)}</strong>
                </div>
              </div>

              <div className="modal-actions" style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button 
                  onClick={salvarEdicaoPedido} 
                  disabled={carregando}
                  style={{
                    backgroundColor: '#2196f3',
                    color: '#fff',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  {carregando ? 'Salvando...' : 'Salvar Alterações'}
                </button>
                <button 
                  onClick={() => setModalEdicaoAberto(false)}
                  style={{
                    backgroundColor: '#ccc',
                    color: '#333',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

