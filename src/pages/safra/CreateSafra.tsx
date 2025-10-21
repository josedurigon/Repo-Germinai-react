import { useState, useEffect, useMemo } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { criarSafra } from "../../services/SafraService";
import type { TalhaoSafraRequest } from "../../services/SafraService";
import { listarCulturas } from "../../services/CulturaService";
import type { Cultura } from "../../services/CulturaService";
import { listarTalhoes } from "../../services/TalhaoService";
import type { Talhao } from "../../services/TalhaoService";
import { listarFuncionarios } from "../../services/FuncionarioService";
import type { Funcionario } from "../../services/FuncionarioService";
import { useNavigate } from "react-router-dom";

const CreateSafra: React.FC = () => {
  const navigate = useNavigate();

  // Form fields
  const [nome, setNome] = useState("");
  const [culturaId, setCulturaId] = useState<number | null>(null);
  const [responsavelId, setResponsavelId] = useState<number | null>(null);
  const [dataInicio, setDataInicio] = useState<Date | null>(null);
  const [areaTotalHa, setAreaTotalHa] = useState<number | null>(null);

  // Meta fields
  const [produtividadeAlvo, setProdutividadeAlvo] = useState<number | null>(null);
  const [custoEstimadoTotal, setCustoEstimadoTotal] = useState<number | null>(null);

  // Valores estimados
  const [receitaEstimada, setReceitaEstimada] = useState<number | null>(null);
  const [lucroPrevisto, setLucroPrevisto] = useState<number | null>(null);

  // Talhões
  const [talhaoSelecionado, setTalhaoSelecionado] = useState<number | null>(null);
  const [areaUtilizada, setAreaUtilizada] = useState<number | null>(null);
  const [talhoesSafra, setTalhoesSafra] = useState<TalhaoSafraRequest[]>([]);

  // Options
  const [culturas, setCulturas] = useState<Cultura[]>([]);
  const [talhoes, setTalhoes] = useState<Talhao[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);

  // State
  const [loadingData, setLoadingData] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      setLoadingData(true);
      const [culturasData, talhoesData, funcionariosData] = await Promise.all([
        listarCulturas(),
        listarTalhoes(),
        listarFuncionarios()
      ]);
      setCulturas(culturasData || []);
      setTalhoes(talhoesData || []);
      setFuncionarios(funcionariosData || []);
      setError(null);
    } catch (err: any) {
      console.error("Erro ao carregar dados:", err);
      setError("Erro ao carregar dados iniciais. Verifique se o backend está rodando.");
      setCulturas([]);
      setTalhoes([]);
      setFuncionarios([]);
    } finally {
      setLoadingData(false);
    }
  }

  function adicionarTalhao() {
    if (!talhaoSelecionado || !areaUtilizada) {
      setError("Selecione um talhão e informe a área utilizada");
      return;
    }

    const talhao = talhoes.find(t => t.id === talhaoSelecionado);
    if (!talhao) return;

    if (areaUtilizada > talhao.areaHa) {
      setError(`Área utilizada não pode ser maior que a área total do talhão (${talhao.areaHa} ha)`);
      return;
    }

    const jaAdicionado = talhoesSafra.find(t => t.talhaoId === talhaoSelecionado);
    if (jaAdicionado) {
      setError("Este talhão já foi adicionado");
      return;
    }

    setTalhoesSafra([...talhoesSafra, { talhaoId: talhaoSelecionado, areaUtilizadaHa: areaUtilizada }]);
    setTalhaoSelecionado(null);
    setAreaUtilizada(null);
    setError(null);
  }

  function removerTalhao(talhaoId: number) {
    setTalhoesSafra(talhoesSafra.filter(t => t.talhaoId !== talhaoId));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!culturaId || !responsavelId || !dataInicio || !areaTotalHa) {
      setError("Preencha todos os campos obrigatórios");
      return;
    }

    setLoading(true);

    try {
      const request = {
        nome,
        culturaId,
        responsavelId,
        dataInicio: dataInicio.toISOString().split('T')[0],
        areaTotalHa,
        talhoes: talhoesSafra.length > 0 ? talhoesSafra : undefined,
        meta: produtividadeAlvo && custoEstimadoTotal ? {
          produtividadeAlvo,
          custoEstimadoTotal
        } : undefined,
        receitaEstimada: receitaEstimada || undefined,
        lucroPrevisto: lucroPrevisto || undefined
      };

      await criarSafra(request);
      setSuccess("Safra cadastrada com sucesso!");

      // Limpar formulário
      setTimeout(() => {
        navigate("/application/safras");
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao cadastrar safra");
    } finally {
      setLoading(false);
    }
  }

  const getTalhaoNome = (talhaoId: number) => {
    return talhoes.find(t => t.id === talhaoId)?.nome || "";
  };

  // Memoized options to prevent re-render issues
  const culturasOptions = useMemo(() => {
    return Array.isArray(culturas) ? culturas.map(c => ({ label: c.nome, value: c.id })) : [];
  }, [culturas]);

  const funcionariosOptions = useMemo(() => {
    return Array.isArray(funcionarios) ? funcionarios.map(f => ({ label: f.nome, value: f.id })) : [];
  }, [funcionarios]);

  const talhoesOptions = useMemo(() => {
    return Array.isArray(talhoes) ? talhoes.map(t => ({ label: `${t.nome} (${t.areaHa} ha)`, value: t.id })) : [];
  }, [talhoes]);

  if (loadingData) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
        <div style={{ textAlign: "center" }}>
          <i className="pi pi-spin pi-spinner" style={{ fontSize: "2rem", marginBottom: "1rem" }}></i>
          <p>Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <Card title="Cadastrar Nova Safra">
        <form onSubmit={handleSubmit} className="p-fluid">
          {/* Informações Básicas */}
          <div className="formgrid grid">
            <div className="field col-12">
              <label htmlFor="nome">Nome da Safra *</label>
              <InputText
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Safra de Milho 2024"
                required
              />
            </div>

            <div className="field col-6">
              <label htmlFor="cultura">Cultura *</label>
              <Dropdown
                id="cultura"
                value={culturaId}
                options={culturasOptions}
                onChange={(e) => setCulturaId(e.value)}
                placeholder="Selecione a cultura"
                required
              />
            </div>

            <div className="field col-6">
              <label htmlFor="responsavel">Responsável *</label>
              <Dropdown
                id="responsavel"
                value={responsavelId}
                options={funcionariosOptions}
                onChange={(e) => setResponsavelId(e.value)}
                placeholder="Selecione o responsável"
                required
              />
            </div>

            <div className="field col-6">
              <label htmlFor="dataInicio">Data de Início *</label>
              <Calendar
                id="dataInicio"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.value as Date)}
                dateFormat="dd/mm/yy"
                showIcon
                required
              />
            </div>

            <div className="field col-6">
              <label htmlFor="areaTotalHa">Área Total (ha) *</label>
              <InputNumber
                id="areaTotalHa"
                value={areaTotalHa}
                onValueChange={(e) => setAreaTotalHa(e.value || null)}
                minFractionDigits={2}
                maxFractionDigits={2}
                required
              />
            </div>
          </div>

          {/* Talhões */}
          <Card title="Talhões" className="mt-4">
            <div className="formgrid grid">
              <div className="field col-6">
                <label htmlFor="talhao">Talhão</label>
                <Dropdown
                  id="talhao"
                  value={talhaoSelecionado}
                  options={talhoesOptions}
                  onChange={(e) => setTalhaoSelecionado(e.value)}
                  placeholder="Selecione um talhão"
                />
              </div>

              <div className="field col-4">
                <label htmlFor="areaUtilizada">Área Utilizada (ha)</label>
                <InputNumber
                  id="areaUtilizada"
                  value={areaUtilizada}
                  onValueChange={(e) => setAreaUtilizada(e.value || null)}
                  minFractionDigits={2}
                  maxFractionDigits={2}
                />
              </div>

              <div className="field col-2" style={{ display: "flex", alignItems: "flex-end" }}>
                <Button
                  type="button"
                  label="Adicionar"
                  icon="pi pi-plus"
                  onClick={adicionarTalhao}
                  className="w-full"
                />
              </div>
            </div>

            {talhoesSafra.length > 0 && (
              <DataTable value={talhoesSafra} className="mt-3">
                <Column
                  field="talhaoId"
                  header="Talhão"
                  body={(row) => getTalhaoNome(row.talhaoId)}
                />
                <Column field="areaUtilizadaHa" header="Área (ha)" />
                <Column
                  header="Ações"
                  body={(row) => (
                    <Button
                      icon="pi pi-trash"
                      className="p-button-danger p-button-sm"
                      onClick={() => removerTalhao(row.talhaoId)}
                    />
                  )}
                />
              </DataTable>
            )}
          </Card>

          {/* Metas */}
          <Card title="Metas (Opcional)" className="mt-4">
            <div className="formgrid grid">
              <div className="field col-6">
                <label htmlFor="produtividadeAlvo">Produtividade Alvo (ton/ha)</label>
                <InputNumber
                  id="produtividadeAlvo"
                  value={produtividadeAlvo}
                  onValueChange={(e) => setProdutividadeAlvo(e.value || null)}
                  minFractionDigits={2}
                  maxFractionDigits={2}
                />
              </div>

              <div className="field col-6">
                <label htmlFor="custoEstimadoTotal">Custo Estimado Total (R$)</label>
                <InputNumber
                  id="custoEstimadoTotal"
                  value={custoEstimadoTotal}
                  onValueChange={(e) => setCustoEstimadoTotal(e.value || null)}
                  mode="currency"
                  currency="BRL"
                  locale="pt-BR"
                />
              </div>
            </div>
          </Card>

          {/* Valores Estimados */}
          <Card title="Valores Estimados (Opcional)" className="mt-4">
            <div className="formgrid grid">
              <div className="field col-6">
                <label htmlFor="receitaEstimada">Receita Estimada (R$)</label>
                <InputNumber
                  id="receitaEstimada"
                  value={receitaEstimada}
                  onValueChange={(e) => setReceitaEstimada(e.value || null)}
                  mode="currency"
                  currency="BRL"
                  locale="pt-BR"
                />
              </div>

              <div className="field col-6">
                <label htmlFor="lucroPrevisto">Lucro Previsto (R$)</label>
                <InputNumber
                  id="lucroPrevisto"
                  value={lucroPrevisto}
                  onValueChange={(e) => setLucroPrevisto(e.value || null)}
                  mode="currency"
                  currency="BRL"
                  locale="pt-BR"
                />
              </div>
            </div>
          </Card>

          {success && <Message severity="success" text={success} className="mt-3" />}
          {error && <Message severity="error" text={error} className="mt-3" />}

          <div className="flex gap-2 mt-4">
            <Button
              type="submit"
              label={loading ? "Salvando..." : "Cadastrar Safra"}
              icon="pi pi-check"
              disabled={loading}
            />
            <Button
              type="button"
              label="Cancelar"
              icon="pi pi-times"
              className="p-button-secondary"
              onClick={() => navigate("/application/safras")}
            />
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateSafra;
