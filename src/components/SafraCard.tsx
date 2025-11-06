// src/components/SafraCard.tsx
import { Card } from "primereact/card";
import { ProgressBar } from "primereact/progressbar";
import { Tag } from "primereact/tag";
import type { SafraResponse } from "../services/SafraService";

interface SafraCardProps {
  safra: SafraResponse;
  onClick?: () => void;
}

const SafraCard: React.FC<SafraCardProps> = ({ safra, onClick }) => {
  const getStatusColor = () => {
    if (safra.progresso >= 80) return "success"; // 🟢
    if (safra.progresso >= 40) return "warning"; // 🟡
    return "danger"; // 🔴
  };

  const getStatusIcon = () => {
    if (safra.progresso >= 80) return "🟢";
    if (safra.progresso >= 40) return "🟡";
    return "🔴";
  };

  return (
    <Card
      className="safra-card"
      style={{
        cursor: onClick ? "pointer" : "default",
        marginBottom: "1rem",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}
      onClick={onClick}
    >
      <div className="flex flex-column gap-3">
        {/* Cabeçalho */}
        <div className="flex justify-content-between align-items-center">
          <div className="flex align-items-center gap-2">
            <i className="pi pi-sun" style={{ fontSize: "1.5rem", color: "#4caf50" }}></i>
            <h3 className="m-0">{safra.cultura.nome}</h3>
          </div>
          <span style={{ fontSize: "1.5rem" }}>{getStatusIcon()}</span>
        </div>

        {/* Nome da safra */}
        <div>
          <strong>{safra.nome}</strong>
        </div>

        {/* Informações */}
        <div className="flex flex-column gap-2">
          <div className="flex justify-content-between">
            <span className="text-600">Área plantada:</span>
            <strong>{safra.areaTotalHa} ha</strong>
          </div>

          <div className="flex justify-content-between">
            <span className="text-600">Fase atual:</span>
            <Tag value={safra.status} severity={getStatusColor()} />
          </div>

          <div className="flex justify-content-between">
            <span className="text-600">Dias até colheita:</span>
            <strong style={{
              color: safra.diasAteColheita < 30 ? "#ff9800" : "#4caf50"
            }}>
              {safra.diasAteColheita} dias
            </strong>
          </div>
        </div>

        {/* Progresso */}
        <div>
          <div className="flex justify-content-between mb-2">
            <span className="text-600">Progresso:</span>
            <strong>{safra.progresso}%</strong>
          </div>
          <ProgressBar
            value={safra.progresso}
            showValue={false}
            style={{ height: "8px" }}
            color={
              safra.progresso >= 80 ? "#4caf50" :
              safra.progresso >= 40 ? "#ff9800" :
              "#f44336"
            }
          />
        </div>

        {/* Responsável */}
        <div className="flex align-items-center gap-2 text-sm text-600">
          <i className="pi pi-user"></i>
          <span>Responsável: {safra.responsavel.nome}</span>
        </div>
      </div>
    </Card>
  );
};

export default SafraCard;
