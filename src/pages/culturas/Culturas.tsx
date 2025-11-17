import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listarCulturas, pesquisarCulturas, deletarCultura } from '../../services/CulturaService';
import type { Cultura } from '../../services/CulturaService';
import './Culturas.css';

export default function Culturas() {
  const navigate = useNavigate();
  const [culturas, setCulturas] = useState<Cultura[]>([]);
  const [termo, setTermo] = useState('');
  const [loading, setLoading] = useState(true);
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    carregarCulturas();
  }, []);

  const carregarCulturas = async () => {
    try {
      setLoading(true);
      const dados = await listarCulturas();
      setCulturas(dados);
      setMensagem('');
    } catch (error) {
      setMensagem('Erro ao carregar culturas');
    } finally {
      setLoading(false);
    }
  };

  const handlePesquisa = async () => {
    if (termo.trim() === '') {
      carregarCulturas();
    } else {
      try {
        const resultados = await pesquisarCulturas(termo);
        setCulturas(resultados);
      } catch (error) {
        setMensagem('Erro ao pesquisar');
      }
    }
  };

  const handleDeletar = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar esta cultura?')) {
      try {
        await deletarCultura(id);
        setMensagem('Cultura deletada com sucesso!');
        carregarCulturas();
        setTimeout(() => setMensagem(''), 3000);
      } catch (error) {
        setMensagem('Erro ao deletar cultura');
      }
    }
  };

  return (
    <div className="culturas-container">
      <div className="culturas-header">
        <h1>Gestão de Culturas</h1>
        <button 
          className="btn-nova-cultura"
          onClick={() => navigate('/application/culturas/novo')}
        >
          + Nova Cultura
        </button>
      </div>

      <div className="culturas-filtro">
        <input
          type="text"
          placeholder="Pesquise por nome de cultura..."
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handlePesquisa()}
          className="input-pesquisa"
        />
        <button 
          className="btn-pesquisar"
          onClick={handlePesquisa}
        >
          Pesquisar
        </button>
      </div>

      {mensagem && (
        <div className={`mensagem-culturas ${mensagem.includes('sucesso') ? 'sucesso' : 'erro'}`}>
          {mensagem}
        </div>
      )}

      {loading ? (
        <div className="loading">Carregando...</div>
      ) : culturas.length === 0 ? (
        <div className="sem-dados">
          Nenhuma cultura registrada. <br />
          <button 
            className="link-button"
            onClick={() => navigate('/application/culturas/novo')}
          >
            Criar uma nova cultura
          </button>
        </div>
      ) : (
        <div className="tabela-wrapper">
          <table className="tabela-culturas">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Variedade</th>
                <th>Ciclo (dias)</th>
                <th>Época de Plantio</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {culturas.map((cultura) => (
                <tr key={cultura.id}>
                  <td>{cultura.nome}</td>
                  <td>{cultura.variedade || '-'}</td>
                  <td>{cultura.ciclo}</td>
                  <td>{cultura.epocaPlantio}</td>
                  <td className="acoes">
                    <button
                      className="btn-editar"
                      onClick={() => navigate(`/application/culturas/editar/${cultura.id}`)}
                      title="Editar"
                    >
                      ✎
                    </button>
                    <button
                      className="btn-excluir"
                      onClick={() => handleDeletar(cultura.id)}
                      title="Excluir"
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
