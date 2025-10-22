import { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { ProgressBar } from "primereact/progressbar";
import { Message } from "primereact/message";
import { ProgressSpinner } from "primereact/progressspinner";
import { listarSafras, deletarSafra } from "../../services/SafraService";
import type { SafraResponse } from "../../services/SafraService";
import { useNavigate } from "react-router-dom";
import { confirmDialog } from "primereact/confirmdialog";
import { ConfirmDialog } from "primereact/confirmdialog";

const ListSafras: React.FC = () => {
  const navigate = useNavigate();
  const [safras, setSafras] = useState<SafraResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    carregarSafras();
  }, []);

  async function carregarSafras() {
    try {
      setLoading(true);
      const data = await listarSafras();
      setSafras(data);
      setError(null);
    } catch (err: any) {
      setError("Erro ao carregar safras");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    confirmDialog({
      message: "Tem certeza que deseja deletar esta safra?",
      header: "Confirmação",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Sim",
      rejectLabel: "Não",
      accept: async () => {
        try {
          await deletarSafra(id);
          await carregarSafras();
        } catch (err: any) {
          setError("Erro ao deletar safra");
        }
      }
    });
  }

  const statusTemplate = (rowData: SafraResponse) => {
    let severity: "success" | "warning" | "info" = "info";

    if (rowData.status === "Ativa") severity = "success";
    else if (rowData.status === "Planejada") severity = "warning";

    return <Tag value={rowData.status} severity={severity} />;
  };

  const progressoTemplate = (rowData: SafraResponse) => {
    return (
      <div>
        <ProgressBar value={rowData.progresso} style={{ height: "8px" }} />
        <small>{rowData.progresso}%</small>
      </div>
    );
  };

  const diasColheitaTemplate = (rowData: SafraResponse) => {
    const dias = rowData.diasAteColheita;
    let color = "green";

    if (dias < 30) color = "orange";
    if (dias < 15) color = "red";

    return <span style={{ color, fontWeight: "bold" }}>{dias} dias</span>;
  };

  const acoesTemplate = (rowData: SafraResponse) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-eye"
          className="p-button-info p-button-sm"
          tooltip="Visualizar"
          tooltipOptions={{ position: "top" }}
          onClick={() => navigate(`/application/safra/${rowData.id}`)}
        />
        <Button
          icon="pi pi-pencil"
          className="p-button-warning p-button-sm"
          tooltip="Editar"
          tooltipOptions={{ position: "top" }}
          onClick={() => navigate(`/application/safra/editar/${rowData.id}`)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-danger p-button-sm"
          tooltip="Deletar"
          tooltipOptions={{ position: "top" }}
          onClick={() => handleDelete(rowData.id)}
        />
      </div>
    );
  };

  const dataInicioTemplate = (rowData: SafraResponse) => {
    return new Date(rowData.dataInicio).toLocaleDateString("pt-BR");
  };

  const dataFimTemplate = (rowData: SafraResponse) => {
    return new Date(rowData.dataFim).toLocaleDateString("pt-BR");
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <div>
      <ConfirmDialog />

      <Card
        title="Gestão de Safras"
        subTitle="Visualize e gerencie todas as safras cadastradas"
      >
        <div className="flex justify-content-between mb-3">
          <Button
            label="Nova Safra"
            icon="pi pi-plus"
            onClick={() => navigate("/application/safra/criar")}
          />
          <Button
            label="Atualizar"
            icon="pi pi-refresh"
            className="p-button-secondary"
            onClick={carregarSafras}
          />
        </div>

        {error && <Message severity="error" text={error} className="mb-3" />}

        {safras.length === 0 ? (
          <Message
            severity="info"
            text="Nenhuma safra cadastrada. Clique em 'Nova Safra' para começar."
          />
        ) : (
          <DataTable
            value={safras}
            paginator
            rows={10}
            responsiveLayout="scroll"
            stripedRows
          >
            <Column field="id" header="ID" style={{ width: "80px" }} />
            <Column field="nome" header="Nome" />
            <Column
              field="cultura.nome"
              header="Cultura"
              body={(row) => row.cultura.nome}
            />
            <Column
              field="responsavel.nome"
              header="Responsável"
              body={(row) => row.responsavel.nome}
            />
            <Column
              field="areaTotalHa"
              header="Área (ha)"
              body={(row) => `${row.areaTotalHa} ha`}
            />
            <Column
              field="dataInicio"
              header="Início"
              body={dataInicioTemplate}
            />
            <Column
              field="dataFim"
              header="Previsão Colheita"
              body={dataFimTemplate}
            />
            <Column
              field="diasAteColheita"
              header="Dias p/ Colheita"
              body={diasColheitaTemplate}
            />
            <Column field="status" header="Status" body={statusTemplate} />
            <Column
              field="progresso"
              header="Progresso"
              body={progressoTemplate}
              style={{ width: "150px" }}
            />
            <Column header="Ações" body={acoesTemplate} style={{ width: "150px" }} />
          </DataTable>
        )}
      </Card>
    </div>
  );
};

export default ListSafras;
