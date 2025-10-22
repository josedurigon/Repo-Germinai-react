import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateSafraSimple: React.FC = () => {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");

  return (
    <div style={{ padding: "20px" }}>
      <h1>Cadastrar Nova Safra</h1>
      <p>Teste básico da página</p>

      <div style={{ marginBottom: "10px" }}>
        <label>Nome da Safra:</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          style={{ marginLeft: "10px", padding: "5px" }}
        />
      </div>

      <button
        onClick={() => navigate("/application/safras")}
        style={{ padding: "10px 20px", marginRight: "10px" }}
      >
        Voltar
      </button>

      <button
        onClick={() => alert("Formulário completo em desenvolvimento")}
        style={{ padding: "10px 20px" }}
      >
        Salvar
      </button>
    </div>
  );
};

export default CreateSafraSimple;
