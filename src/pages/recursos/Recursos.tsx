import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listarRecursos, pesquisarRecursos, filtrarRecursosPorTipo, deletarRecurso } from '../../services/RecursoService';
import type { Recurso } from '../../services/RecursoService';
import './Recursos.css';

export default function Recursos() {
  const navigate = useNavigate();
  const [recursos, setRecursos] = useState<Recurso[]>([]);
  const [termo, setTermo] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<Recurso['tipo'] | ''>('');
  const [loading, setLoading] = useState(true);
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    carregarRecursos();
  }, []);

  const carregarRecursos = async () => {
    try {
      setLoading(true);
      const dados = await listarRecursos();
      setRecursos(dados);
      setMensagem('');
    } catch (error) {
      setMensagem('Erro ao carregar recursos');
    } finally {
      setLoading(false);
    }
  };

  const handlePesquisa = async () => {
    if (termo.trim() === '') {
      if (filtroTipo) {
        aplicarFiltroTipo(filtroTipo);
      } else {
        carregarRecursos();
      }
    } else {
      try {
        const resultados = await pesquisarRecursos(termo);
        setRecursos(resultados);
      } catch (error) {
        setMensagem('Erro ao pesquisar');
      }
    }
  };

  const aplicarFiltroTipo = async (tipo: Recurso['tipo'] | '') => {
    try {
      setFiltroTipo(tipo);
      if (tipo === '') {
        carregarRecursos();
      } else {
        const resultados = await filtrarRecursosPorTipo(tipo);
        setRecursos(resultados);
      }
    } catch (error) {
      setMensagem('Erro ao filtrar');
    }
  };

  const handleDeletar = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar este recurso?')) {
      try {
        await deletarRecurso(id);
        setMensagem('Recurso deletado com sucesso!');
        carregarRecursos();
        setTimeout(() => setMensagem(''), 3000);
      } catch (error) {
        setMensagem('Erro ao deletar recurso');
      }
    }
  };

  return (
    <div className="recursos-container">
      <div className="recursos-header">
        <h1>Gestão de Recursos (Insumos)</h1>
        <button 
          className="btn-novo-recurso"
          onClick={() => navigate('/application/recursos/novo')}
        >
          + Novo Recurso
        </button>
      </div>

      <div className="recursos-filtros">
        <div className="filtro-pesquisa">
          <input
            type="text"
            placeholder="Pesquise por nome do recurso..."
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

        <div className="filtro-tipo">
          <select 
            value={filtroTipo}
            onChange={(e) => aplicarFiltroTipo(e.target.value as Recurso['tipo'] | '')}
            className="select-tipo"
          >
            <option value="">Todos os Tipos</option>
            <option value="Semente">Sementes</option>
            <option value="Fertilizante">Fertilizantes</option>
            <option value="Defensivo">Defensivos</option>
            <option value="Outro">Outro</option>
          </select>
        </div>
      </div>

      {mensagem && (
        <div className={`mensagem-recursos ${mensagem.includes('sucesso') ? 'sucesso' : 'erro'}`}>
          {mensagem}
        </div>
      )}

      {loading ? (
        <div className="loading">Carregando...</div>
      ) : recursos.length === 0 ? (
        <div className="sem-dados">
          Nenhum recurso registrado. <br />
          <button 
            className="link-button"
            onClick={() => navigate('/application/recursos/novo')}
          >
            Criar um novo recurso
          </button>
        </div>
      ) : (
        <div className="tabela-wrapper">
          <table className="tabela-recursos">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Tipo</th>
                <th>Unidade de Medida</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {recursos.map((recurso) => (
                <tr key={recurso.id}>
                  <td>{recurso.nome}</td>
                  <td>
                    <span className={`badge badge-${recurso.tipo.toLowerCase()}`}>
                      {recurso.tipo}
                    </span>
                  </td>
                  <td>{recurso.unidade}</td>
                  <td className="acoes">
                    <button
                      className="btn-editar"
                      onClick={() => navigate(`/application/recursos/editar/${recurso.id}`)}
                      title="Editar"
                    >
                      ✎
                    </button>
                    <button
                      className="btn-excluir"
                      onClick={() => handleDeletar(recurso.id)}
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
