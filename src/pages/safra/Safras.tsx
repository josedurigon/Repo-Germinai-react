import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listarSafras, deletarSafra } from '../../services/SafraService';
import type { SafraResponse } from '../../services/SafraService';
import './Safras.css';

export default function Safras() {
  const navigate = useNavigate();
  const [safras, setSafras] = useState<SafraResponse[]>([]);
  const [safrasFiltradas, setSafrasFiltradas] = useState<SafraResponse[]>([]);
  const [termoPesquisa, setTermoPesquisa] = useState('');
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
      setSafrasFiltradas(dados);
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

  const handlePesquisa = () => {
    if (!termoPesquisa.trim()) {
      setSafrasFiltradas(safras);
      return;
    }

    const termo = termoPesquisa.toLowerCase();
    const filtradas = safras.filter(safra =>
      safra.nome.toLowerCase().includes(termo) ||
      safra.codigoSafra?.toLowerCase().includes(termo) ||
      safra.cultura.nome.toLowerCase().includes(termo) ||
      safra.responsavel.nome.toLowerCase().includes(termo) ||
      formatarStatus(safra.status).toLowerCase().includes(termo)
    );
    setSafrasFiltradas(filtradas);
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
        <h1>Cadastro de Safras</h1>
        <button 
          className="btn-nova-safra"
          onClick={() => navigate('/application/safras/novo')}
        >
          + Nova Safra
        </button>
      </div>

      <div className="filtro-container">
        <input
          type="text"
          placeholder="Pesquisar por nome, código, cultura, responsável ou status..."
          value={termoPesquisa}
          onChange={(e) => setTermoPesquisa(e.target.value)}
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
        <div className={`mensagem-safras ${mensagem.includes('sucesso') ? 'sucesso' : 'erro'}`}>
          {mensagem}
        </div>
      )}

      {loading ? (
        <div className="loading">Carregando...</div>
      ) : safrasFiltradas.length === 0 ? (
        <div className="sem-dados">
          {termoPesquisa ? (
            <>
              Nenhuma safra encontrada para "{termoPesquisa}". <br />
              <button 
                className="link-button"
                onClick={() => {
                  setTermoPesquisa('');
                  setSafrasFiltradas(safras);
                }}
              >
                Limpar pesquisa
              </button>
            </>
          ) : (
            <>
              Nenhuma safra registrada. <br />
              <button 
                className="link-button"
                onClick={() => navigate('/application/safras/novo')}
              >
                Criar uma nova safra
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="tabela-wrapper">
          <table className="tabela-safras">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Cultura</th>
                <th>Responsável</th>
                <th>Área Total (ha)</th>
                <th>Data Início</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {safrasFiltradas.map((safra) => (
                <tr key={safra.id}>
                  <td>{safra.codigoSafra || safra.id}</td>
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
