import React, { useState, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import BoxShadowPadrao from '../../components/box-shadow/BoxShadowPadrao';
import './PrevisaoPreco.css';

const PrevisaoPreco = () => {

  const [commodity, setCommodity] = useState("soja");
  const [dataset, setDataset] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_URL = "http://localhost:8080/api/previsao";

  const carregarPrevisao = () => {
    setLoading(true);
    fetch(`${API_URL}/${commodity}/15`)
      .then(res => res.json())
      .then(json => {

        const historico = json.historico;
        const previsao = json.previsao;

        const ultimoHist = historico[historico.length - 1].preco;

        const merged = [
          ...historico.map(h => ({
            data: h.data,
            precoHist: h.preco,
            precoPrev: null
          })),
          ...previsao.map((p, idx) => ({
            data: p.data,
            precoHist: idx === 0 ? ultimoHist : null,
            precoPrev: p.preco
          }))
        ];

        setDataset(merged);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    carregarPrevisao();
  }, [commodity]);


  return (
    <div className="pagina-container-pai">
      <main className="conteudo-previsao">
        <h1>Previsão de Preço – {commodity.toUpperCase()}</h1>

        <BoxShadowPadrao>

          {/* SELEÇÃO DA COMMODITY */}
          <div style={{ marginBottom: "20px" }}>
            <label><strong>Selecione a Commodity: </strong></label>
            <select
              value={commodity}
              onChange={(e) => setCommodity(e.target.value)}
              style={{ padding: "6px 10px", marginLeft: "8px" }}
            >
              <option value="soja">Soja</option>
              <option value="milho">Milho</option>
            </select>
          </div>

          {loading && <p>Carregando gráfico...</p>}

          {!loading && dataset.length > 0 && (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={dataset}>
                <XAxis dataKey="data" />
                <YAxis domain={["auto", "auto"]} />
                <Tooltip formatter={(v) => `R$ ${v.toFixed(2)}`} />
                <Legend />

                <Line
                  type="monotone"
                  dataKey="precoHist"
                  stroke="#0041a8"
                  strokeWidth={3}
                  dot={false}
                  name="Histórico"
                  connectNulls
                />

                <Line
                  type="monotone"
                  dataKey="precoPrev"
                  stroke="#ff7300"
                  strokeWidth={3}
                  dot={true}
                  name="Previsão"
                  connectNulls
                  strokeDasharray="6 4"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </BoxShadowPadrao>
      </main>
    </div>
  );
};

export default PrevisaoPreco;
