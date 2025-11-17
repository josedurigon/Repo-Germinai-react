import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listarTalhoes, pesquisarTalhoes, deletarTalhao } from '../../services/TalhaoService';
import type { Talhao } from '../../services/TalhaoService';
import './Talhoes.css';

export default function Talhoes() {
  const navigate = useNavigate();
  const [talhoes, setTalhoes] = useState<Talhao[]>([]);
  const [termo, setTermo] = useState('');
  const [loading, setLoading] = useState(true);
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    carregarTalhoes();
  }, []);

  const carregarTalhoes = async () => {
    try {
      setLoading(true);
      const dados = await listarTalhoes();
      setTalhoes(dados);
      setMensagem('');
    } catch (error) {
      setMensagem('Erro ao carregar talhões');
    } finally {
      setLoading(false);
    }
  };

  const handlePesquisa = async () => {
    if (termo.trim() === '') {
      carregarTalhoes();
    } else {
      try {
        const resultados = await pesquisarTalhoes(termo);
        setTalhoes(resultados);
      } catch (error) {
        setMensagem('Erro ao pesquisar');
      }
    }
  };

  const handleDeletar = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar este talhão?')) {
      try {
        await deletarTalhao(id);
        setMensagem('Talhão deletado com sucesso!');
        carregarTalhoes();
        setTimeout(() => setMensagem(''), 3000);
      } catch (error) {
        setMensagem('Erro ao deletar talhão');
      }
    }
  };

  return (
    <div className="talhoes-container">
      <div className="talhoes-header">
        <h1>Gestão de Talhões</h1>
        <button 
          className="btn-novo-talhao"
          onClick={() => navigate('/application/talhoes/novo')}
        >
          + Novo Talhão
        </button>
      </div>

      <div className="talhoes-filtro">
        <input
          type="text"
          placeholder="Pesquise por nome, código, fazenda, tipo de solo..."
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
        <div className={`mensagem-talhoes ${mensagem.includes('sucesso') ? 'sucesso' : 'erro'}`}>
          {mensagem}
        </div>
      )}

      {loading ? (
        <div className="loading">Carregando...</div>
      ) : talhoes.length === 0 ? (
        <div className="sem-dados">
          Nenhum talhão registrado. <br />
          <button 
            className="link-button"
            onClick={() => navigate('/application/talhoes/novo')}
          >
            Criar um novo talhão
          </button>
        </div>
      ) : (
        <div className="tabela-wrapper">
          <table className="tabela-talhoes">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Código</th>
                <th>Área Total (ha)</th>
                <th>Área Útil (ha)</th>
                <th>Fazenda</th>
                <th>Tipo de Solo</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {talhoes.map((talhao) => (
                <tr key={talhao.id}>
                  <td>{talhao.nome}</td>
                  <td>{talhao.codigoInterno || '-'}</td>
                  <td>{talhao.areaTotal.toFixed(2)}</td>
                  <td>{talhao.areaUtil ? talhao.areaUtil.toFixed(2) : '-'}</td>
                  <td>{talhao.fazenda}</td>
                  <td>{talhao.tipoSolo}</td>
                  <td>
                    <span className={`badge-status badge-${talhao.status.toLowerCase()}`}>
                      {talhao.status}
                    </span>
                  </td>
                  <td className="acoes">
                    <button
                      className="btn-editar"
                      onClick={() => navigate(`/application/talhoes/editar/${talhao.id}`)}
                      title="Editar"
                    >
                      ✎
                    </button>
                    <button
                      className="btn-excluir"
                      onClick={() => handleDeletar(talhao.id)}
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
