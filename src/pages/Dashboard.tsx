import { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";
import { Message } from "primereact/message";
import { Button } from "primereact/button";
import { listarSafrasAtivas } from "../services/SafraService";
import type { SafraResponse } from "../services/SafraService";
import SafraCard from "../components/SafraCard";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [safrasAtivas, setSafrasAtivas] = useState<SafraResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    carregarDashboard();
  }, []);

  async function carregarDashboard() {
    try {
      setLoading(true);
      const safras = await listarSafrasAtivas();
      setSafrasAtivas(safras);
      setError(null);
    } catch (err: any) {
      setError("Erro ao carregar dashboard");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <div>
      {/* Cabeçalho */}
      <div className="flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="m-0 mb-2">Dashboard - Visão Geral</h1>
          <p className="text-600 m-0">Acompanhe suas safras ativas e métricas principais</p>
        </div>
        <Button
          label="Nova Safra"
          icon="pi pi-plus"
          onClick={() => navigate("/application/safra/criar")}
        />
      </div>

      {error && <Message severity="error" text={error} className="mb-3" />}

      {/* Safras Ativas */}
      <Card title="Safras Ativas" className="mb-4">
        {safrasAtivas.length === 0 ? (
          <Message
            severity="info"
            text="Nenhuma safra ativa no momento. Cadastre uma nova safra para começar."
          />
        ) : (
          <div className="grid">
            {safrasAtivas.map((safra) => (
              <div key={safra.id} className="col-12 md:col-6 lg:col-4">
                <SafraCard
                  safra={safra}
                  onClick={() => navigate(`/application/safra/${safra.id}`)}
                />
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Ações Rápidas */}
      <Card title="Ações Rápidas" className="mb-4">
        <div className="grid">
          <div className="col-12 md:col-6 lg:col-3">
            <Button
              label="Registrar Atividade"
              icon="pi pi-plus-circle"
              className="w-full p-button-outlined"
              onClick={() => navigate("/application/atividades")}
            />
          </div>
          <div className="col-12 md:col-6 lg:col-3">
            <Button
              label="Ver Calendário"
              icon="pi pi-calendar"
              className="w-full p-button-outlined"
              onClick={() => navigate("/application/calendario")}
            />
          </div>
          <div className="col-12 md:col-6 lg:col-3">
            <Button
              label="Relatórios"
              icon="pi pi-chart-line"
              className="w-full p-button-outlined"
              onClick={() => navigate("/application/reports")}
            />
          </div>
          <div className="col-12 md:col-6 lg:col-3">
            <Button
              label="Gerenciar Estoque"
              icon="pi pi-box"
              className="w-full p-button-outlined"
              onClick={() => navigate("/application/estoque")}
            />
          </div>
        </div>
      </Card>

      {/* Painel de Custos e Receitas - Placeholder */}
      <Card title="Custos & Receita" className="mb-4">
        <div className="grid">
          <div className="col-12 md:col-4">
            <div className="text-center p-3 border-round" style={{ backgroundColor: "#fff3cd" }}>
              <div className="text-600 mb-2">Total Investido</div>
              <div className="text-2xl font-bold text-900">R$ --</div>
            </div>
          </div>
          <div className="col-12 md:col-4">
            <div className="text-center p-3 border-round" style={{ backgroundColor: "#d1ecf1" }}>
              <div className="text-600 mb-2">Receita Estimada</div>
              <div className="text-2xl font-bold text-900">R$ --</div>
            </div>
          </div>
          <div className="col-12 md:col-4">
            <div className="text-center p-3 border-round" style={{ backgroundColor: "#d4edda" }}>
              <div className="text-600 mb-2">Lucro Previsto</div>
              <div className="text-2xl font-bold text-900">R$ --</div>
            </div>
          </div>
        </div>
        <div className="text-center mt-3 text-600">
          <small>* Os valores serão calculados conforme atividades e custos forem registrados</small>
        </div>
      </Card>

      {/* Estoque - Placeholder */}
      <Card title="Estoque de Insumos" className="mb-4">
        <Message
          severity="info"
          text="O controle de estoque será implementado em breve. Por enquanto, gerencie os insumos manualmente."
        />
      </Card>
    </div>
  );
};

export default Dashboard;
