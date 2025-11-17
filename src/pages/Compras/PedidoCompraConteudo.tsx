import { useEffect, useState } from "react";
import "./PedidoCompraConteudo.css";
import type { PedidoCompra } from "../../services/PedidoCompraService";
import {
  criarPedidoCompra,
  listarPedidosPorPeriodo,
  deletarPedidoCompra,
} from "../../services/PedidoCompraService";

export default function PedidoCompraConteudo() {
  // Estado da aba ativa
  const [abaAtiva, setAbaAtiva] = useState<"novo" | "listar">("novo");

  // Estado do formulário de novo pedido
  const [fornecedor, setFornecedor] = useState("");
  const [data, setData] = useState(() => new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState("Rascunho");
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

  // Filtros para aba de novo pedido
  const [filtroFornecedor, setFiltroFornecedor] = useState("");
  const [filtroDataInicio, setFiltroDataInicio] = useState("");
  const [filtroDataFim, setFiltroDataFim] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [pedidosFiltroCk, setPedidosFiltroCk] = useState<PedidoCompra[]>([]);
  const [filtrosAplicados, setFiltrosAplicados] = useState(false);

  // Buscar pedidos ao mudar de aba ou datas
  useEffect(() => {
    if (abaAtiva === "listar") {
      buscarPedidos();
    }
  }, [abaAtiva, dataInicio, dataFim]);

  const buscarPedidos = async () => {
    setCarregando(true);
    setMensagem("");
    try {
      const resultado = await listarPedidosPorPeriodo(dataInicio, dataFim);
      setPedidos(resultado);
      if (resultado.length === 0) {
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
        status: status as "Rascunho" | "Enviado" | "Aprovado" | "Cancelado",
        itens: itens.map(({ id, ...rest }) => rest),
      };
      await criarPedidoCompra(novoPedido);
      setMensagem("Pedido salvo com sucesso!");
      // Limpar formulário
      setFornecedor("");
      setData(new Date().toISOString().slice(0, 10));
      setStatus("Rascunho");
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

  // Aplicar filtros na aba de novo pedido
  const aplicarFiltrosNovo = async () => {
    setCarregando(true);
    setMensagem("");
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
        setMensagem("Nenhum pedido encontrado com os filtros aplicados.");
      }
    } catch (error) {
      setMensagem("Erro ao aplicar filtros.");
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
    setMensagem("");
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
              <span>Status</span>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option>Rascunho</option>
                <option>Enviado</option>
                <option>Aprovado</option>
                <option>Cancelado</option>
              </select>
            </label>
          </div>

          {/* Filtros */}
          <div className="filtro-periodo" style={{ marginTop: "20px", marginBottom: "20px" }}>
            <h3>Filtrar Pedidos Existentes</h3>
            <label>
              <span>Fornecedor</span>
              <input
                value={filtroFornecedor}
                onChange={(e) => setFiltroFornecedor(e.target.value)}
                placeholder="Nome do fornecedor"
              />
            </label>
            <label>
              <span>Data Início</span>
              <input
                type="date"
                value={filtroDataInicio}
                onChange={(e) => setFiltroDataInicio(e.target.value)}
              />
            </label>
            <label>
              <span>Data Fim</span>
              <input
                type="date"
                value={filtroDataFim}
                onChange={(e) => setFiltroDataFim(e.target.value)}
              />
            </label>
            <label>
              <span>Status</span>
              <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
                <option value="">Todos</option>
                <option>Rascunho</option>
                <option>Enviado</option>
                <option>Aprovado</option>
                <option>Cancelado</option>
              </select>
            </label>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={aplicarFiltrosNovo} disabled={carregando}>
                {carregando ? "Filtrando..." : "Filtrar"}
              </button>
              <button onClick={limparFiltros} style={{ backgroundColor: "#ccc", color: "#333" }}>
                Limpar
              </button>
            </div>
          </div>

          {/* Resultado dos filtros */}
          {filtrosAplicados && pedidosFiltroCk.length > 0 && (
            <div className="tabela-scroll" style={{ marginBottom: "20px" }}>
              <h3>Resultados da Busca</h3>
              <table className="tabela-listagem">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Fornecedor</th>
                    <th>Data</th>
                    <th>Status</th>
                    <th>Qtd. Itens</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidosFiltroCk.map((pedido) => (
                    <tr key={pedido.id}>
                      <td>#{pedido.id}</td>
                      <td>{pedido.fornecedor}</td>
                      <td>{new Date(pedido.data).toLocaleDateString("pt-BR")}</td>
                      <td>
                        <span className={`status-badge status-${pedido.status.toLowerCase()}`}>
                          {pedido.status}
                        </span>
                      </td>
                      <td>{pedido.itens.length}</td>
                      <td>R$ {(pedido.total || 0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

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
                    <th>ID</th>
                    <th>Fornecedor</th>
                    <th>Data</th>
                    <th>Status</th>
                    <th>Qtd. Itens</th>
                    <th>Total</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.map((pedido) => (
                    <tr key={pedido.id}>
                      <td>#{pedido.id}</td>
                      <td>{pedido.fornecedor}</td>
                      <td>{new Date(pedido.data).toLocaleDateString("pt-BR")}</td>
                      <td>
                        <span className={`status-badge status-${pedido.status.toLowerCase()}`}>
                          {pedido.status}
                        </span>
                      </td>
                      <td>{pedido.itens.length}</td>
                      <td>R$ {(pedido.total || 0).toFixed(2)}</td>
                      <td>
                        <button
                          className="btn-deletar"
                          onClick={() => excluirPedido(pedido.id)}
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

          {!carregando && pedidos.length === 0 && mensagem && (
            <div className="sem-dados">{mensagem}</div>
          )}
        </section>
      )}
    </div>
  );
}

