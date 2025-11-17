import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listarSafras, deletarSafra } from '../../services/SafraService';
import type { SafraResponse } from '../../services/SafraService';
import './Safras.css';

export default function Safras() {
  const navigate = useNavigate();
  const [safras, setSafras] = useState<SafraResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    carregarSafras();
  }, []);

  const carregarSafras = async () => {
    try {
      setLoading(true);
      const dados = await listarSafras();
      setSafras(dados);
      setMensagem('');
    } catch (error) {
      setMensagem('Erro ao carregar safras');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletar = async (id: number) => {
    if (confirm('Tem certeza que deseja deletar esta safra?')) {
      try {
        await deletarSafra(id);
        setMensagem('Safra deletada com sucesso!');
        carregarSafras();
        setTimeout(() => setMensagem(''), 3000);
      } catch (error) {
        setMensagem('Erro ao deletar safra');
      }
    }
  };

  const getStatusBadgeClass = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'PLANEJAMENTO': 'badge-planejamento',
      'EM_ANDAMENTO': 'badge-em-andamento',
      'COLHEITA': 'badge-colheita',
      'FINALIZADA': 'badge-finalizada',
      'CANCELADA': 'badge-cancelada'
    };
    return statusMap[status] || 'badge-default';
  };

  const formatarStatus = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'PLANEJAMENTO': 'Planejamento',
      'EM_ANDAMENTO': 'Em Andamento',
      'COLHEITA': 'Colheita',
      'FINALIZADA': 'Finalizada',
      'CANCELADA': 'Cancelada'
    };
    return statusMap[status] || status;
  };

  return (
    <div className="safras-container">
      <div className="safras-header">
        <h1>Gestão de Safras</h1>
        <button 
          className="btn-nova-safra"
          onClick={() => navigate('/application/safras/novo')}
        >
          + Nova Safra
        </button>
      </div>

      {mensagem && (
        <div className={`mensagem-safras ${mensagem.includes('sucesso') ? 'sucesso' : 'erro'}`}>
          {mensagem}
        </div>
      )}

      {loading ? (
        <div className="loading">Carregando...</div>
      ) : safras.length === 0 ? (
        <div className="sem-dados">
          Nenhuma safra registrada. <br />
          <button 
            className="link-button"
            onClick={() => navigate('/application/safras/novo')}
          >
            Criar uma nova safra
          </button>
        </div>
      ) : (
        <div className="tabela-wrapper">
          <table className="tabela-safras">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Cultura</th>
                <th>Responsável</th>
                <th>Área Total (ha)</th>
                <th>Data Início</th>
                <th>Status</th>
                <th>Progresso</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {safras.map((safra) => (
                <tr key={safra.id}>
                  <td>{safra.nome}</td>
                  <td>{safra.cultura.nome}</td>
                  <td>{safra.responsavel.nome}</td>
                  <td>{safra.areaTotalHa.toFixed(2)}</td>
                  <td>{new Date(safra.dataInicio).toLocaleDateString('pt-BR')}</td>
                  <td>
                    <span className={`badge-status ${getStatusBadgeClass(safra.status)}`}>
                      {formatarStatus(safra.status)}
                    </span>
                  </td>
                  <td>
                    <div className="progresso-bar">
                      <div 
                        className="progresso-fill" 
                        style={{ width: `${safra.progresso}%` }}
                      />
                      <span className="progresso-text">{safra.progresso}%</span>
                    </div>
                  </td>
                  <td className="acoes">
                    <button
                      className="btn-editar"
                      onClick={() => navigate(`/application/safras/editar/${safra.id}`)}
                      title="Editar"
                    >
                      ✎
                    </button>
                    <button
                      className="btn-excluir"
                      onClick={() => handleDeletar(safra.id)}
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
