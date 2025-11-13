import { useEffect, useState } from "react";
import "./RegistroVendasConteudo.css";
import type { Venda } from "../../services/VendaService";
import {
  criarVenda,
  listarVendasPorPeriodo,
  deletarVenda,
} from "../../services/VendaService";

export default function RegistroVendasConteudo() {
  // Estado da aba ativa
  const [abaAtiva, setAbaAtiva] = useState<"nova" | "listar">("nova");

  // Estado do formulário de nova venda
  const [cliente, setCliente] = useState("");
  const [produto, setProduto] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [precoUnitario, setPrecoUnitario] = useState(0);
  const [data, setData] = useState(() => new Date().toISOString().slice(0, 10));
  const [statusPagamento, setStatusPagamento] = useState("Pendente");

  // Estado da listagem de vendas
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [dataInicio, setDataInicio] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().slice(0, 10);
  });
  const [dataFim, setDataFim] = useState(() => new Date().toISOString().slice(0, 10));
  const [statusFiltro, setStatusFiltro] = useState(""); // Filtro de status
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  // Buscar vendas ao mudar de aba ou datas
  useEffect(() => {
    if (abaAtiva === "listar") {
      buscarVendas();
    }
  }, [abaAtiva, dataInicio, dataFim, statusFiltro]);

  const buscarVendas = async () => {
    setCarregando(true);
    setMensagem("");
    try {
      const resultado = await listarVendasPorPeriodo(dataInicio, dataFim);
      // Filtrar por status se selecionado
      const vendasFiltradas = statusFiltro 
        ? resultado.filter(v => v.statusPagamento === statusFiltro)
        : resultado;
      setVendas(vendasFiltradas);
      if (vendasFiltradas.length === 0) {
        setMensagem("Nenhuma venda encontrada para o período e filtros selecionados.");
      }
    } catch (error) {
      setMensagem("Erro ao buscar vendas. Tente novamente.");
      console.error(error);
    } finally {
      setCarregando(false);
    }
  };

  // Calcular total
  const total = quantidade * precoUnitario;

  // Salvar venda
  const salvarVenda = async () => {
    if (!cliente.trim()) {
      setMensagem("Por favor, preencha o nome do cliente.");
      return;
    }
    if (!produto.trim()) {
      setMensagem("Por favor, preencha o nome do produto.");
      return;
    }
    if (quantidade <= 0) {
      setMensagem("A quantidade deve ser maior que zero.");
      return;
    }
    if (precoUnitario <= 0) {
      setMensagem("O preço unitário deve ser maior que zero.");
      return;
    }

    setCarregando(true);
    setMensagem("");
    try {
      const novaVenda: Venda = {
        cliente,
        produto,
        quantidade,
        precoUnitario,
        total,
        data,
        statusPagamento: statusPagamento as "Pendente" | "Pago" | "Cancelado",
      };
      await criarVenda(novaVenda);
      setMensagem("Venda registrada com sucesso!");
      // Limpar formulário
      setCliente("");
      setProduto("");
      setQuantidade(1);
      setPrecoUnitario(0);
      setData(new Date().toISOString().slice(0, 10));
      setStatusPagamento("Pendente");
      // Voltar para listagem
      setAbaAtiva("listar");
    } catch (error) {
      setMensagem("Erro ao registrar venda. Tente novamente.");
      console.error(error);
    } finally {
      setCarregando(false);
    }
  };

  // Deletar venda
  const excluirVenda = async (id: number | undefined) => {
    if (!id || !confirm("Tem certeza que deseja deletar esta venda?")) return;
    try {
      await deletarVenda(id);
      setVendas(vendas.filter((v) => v.id !== id));
      setMensagem("Venda deletada com sucesso!");
    } catch (error) {
      setMensagem("Erro ao deletar venda.");
      console.error(error);
    }
  };

  return (
    <div className="registro-vendas-container">
      {/* Abas */}
      <div className="abas-venda">
        <button
          className={`aba-botao ${abaAtiva === "nova" ? "ativa" : ""}`}
          onClick={() => setAbaAtiva("nova")}
        >
          Nova Venda
        </button>
        <button
          className={`aba-botao ${abaAtiva === "listar" ? "ativa" : ""}`}
          onClick={() => setAbaAtiva("listar")}
        >
          Visualizar Vendas
        </button>
      </div>

      {/* Mensagem (não mostrar aqui mensagens de "nenhuma venda encontrada" para evitar duplicação; essas aparecem abaixo na listagem) */}
      {mensagem && !mensagem.includes("Nenhuma venda encontrada") && (
        <div className={`mensagem ${mensagem.includes("sucesso") ? "sucesso" : "erro"}`}>
          {mensagem}
        </div>
      )}

      {/* Conteúdo das abas */}
      {abaAtiva === "nova" ? (
        <section className="container-venda">
          <h2 className="titulo-secao">Registrar Nova Venda</h2>
          
          <div className="dados-venda">
            <label>
              <span>Cliente</span>
              <input
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
                placeholder="Nome do cliente"
                type="text"
              />
            </label>

            <label>
              <span>Produto</span>
              <input
                value={produto}
                onChange={(e) => setProduto(e.target.value)}
                placeholder="Nome do produto"
                type="text"
              />
            </label>

            <label>
              <span>Quantidade</span>
              <input
                value={quantidade}
                onChange={(e) => setQuantidade(Number(e.target.value))}
                type="number"
                min="0.01"
                step="0.01"
              />
            </label>

            <label>
              <span>Preço Unitário</span>
              <input
                value={precoUnitario}
                onChange={(e) => setPrecoUnitario(Number(e.target.value))}
                type="number"
                min="0"
                step="0.01"
              />
            </label>

            <label>
              <span>Data da Venda</span>
              <input type="date" value={data} onChange={(e) => setData(e.target.value)} />
            </label>

            <label>
              <span>Status do Pagamento</span>
              <select value={statusPagamento} onChange={(e) => setStatusPagamento(e.target.value)}>
                <option>Pendente</option>
                <option>Pago</option>
                <option>Cancelado</option>
              </select>
            </label>
          </div>

          <div className="resumo-venda">
            <div className="item-resumo">
              <span>Quantidade:</span>
              <strong>{quantidade}</strong>
            </div>
            <div className="item-resumo">
              <span>Preço Unit.:</span>
              <strong>R$ {precoUnitario.toFixed(2)}</strong>
            </div>
            <div className="item-resumo total">
              <span>Total:</span>
              <strong>R$ {total.toFixed(2)}</strong>
            </div>
          </div>

          <button className="btn-salvar-venda" onClick={salvarVenda} disabled={carregando}>
            {carregando ? "Registrando..." : "Registrar Venda"}
          </button>
        </section>
      ) : (
        <section className="container-listagem-venda">
          <div className="filtro-periodo-venda">
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
              <span>Status de Pagamento</span>
              <select 
                value={statusFiltro} 
                onChange={(e) => setStatusFiltro(e.target.value)}
              >
                <option value="">Todos</option>
                <option value="Pendente">Pendente</option>
                <option value="Pago">Pago</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </label>
            <button onClick={buscarVendas} disabled={carregando}>
              {carregando ? "Carregando..." : "Filtrar"}
            </button>
          </div>

          {carregando && <div className="carregando">Carregando vendas...</div>}

          {!carregando && vendas.length > 0 && (
            <div className="tabela-scroll-venda">
              <table className="tabela-vendas">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Produto</th>
                    <th>Quantidade</th>
                    <th>Preço Unit.</th>
                    <th>Total</th>
                    <th>Data</th>
                    <th>Pagamento</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {vendas.map((venda) => (
                    <tr key={venda.id}>
                      <td>#{venda.id}</td>
                      <td>{venda.cliente}</td>
                      <td>{venda.produto}</td>
                      <td>{venda.quantidade}</td>
                      <td>R$ {venda.precoUnitario.toFixed(2)}</td>
                      <td className="total-venda">R$ {venda.total.toFixed(2)}</td>
                      <td>{new Date(venda.data).toLocaleDateString("pt-BR")}</td>
                      <td>
                        <span className={`status-pagamento status-${venda.statusPagamento.toLowerCase()}`}>
                          {venda.statusPagamento}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn-deletar-venda"
                          onClick={() => excluirVenda(venda.id)}
                        >
                          Deletar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Resumo totais */}
              <div className="resumo-totais">
                <div className="item-total">
                  <span>Total de Vendas:</span>
                  <strong>{vendas.length}</strong>
                </div>
                <div className="item-total">
                  <span>Quantidade Total:</span>
                  <strong>{vendas.reduce((sum, v) => sum + v.quantidade, 0)}</strong>
                </div>
                <div className="item-total destaque">
                  <span>Valor Total:</span>
                  <strong>R$ {vendas.reduce((sum, v) => sum + v.total, 0).toFixed(2)}</strong>
                </div>
              </div>
            </div>
          )}

          {!carregando && vendas.length === 0 && mensagem && (
            <div className="sem-dados-venda">{mensagem}</div>
          )}
        </section>
      )}
    </div>
  );
}
