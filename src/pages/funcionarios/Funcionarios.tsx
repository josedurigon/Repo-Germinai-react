import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listarFuncionarios, pesquisarFuncionarios, deletarFuncionario } from '../../services/FuncionarioService';
import type { Funcionario } from '../../services/FuncionarioService';
import './Funcionarios.css';

export default function Funcionarios() {
  const navigate = useNavigate();
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [termo, setTermo] = useState('');
  const [loading, setLoading] = useState(true);
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    carregarFuncionarios();
  }, []);

  const carregarFuncionarios = async () => {
    try {
      setLoading(true);
      const dados = await listarFuncionarios();
      setFuncionarios(dados);
      setMensagem('');
    } catch (error) {
      setMensagem('Erro ao carregar funcionários');
    } finally {
      setLoading(false);
    }
  };

  const handlePesquisa = async () => {
    if (termo.trim() === '') {
      carregarFuncionarios();
    } else {
      try {
        const resultados = await pesquisarFuncionarios(termo);
        setFuncionarios(resultados);
      } catch (error) {
        setMensagem('Erro ao pesquisar');
      }
    }
  };

  const handleDeletar = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar este funcionário?')) {
      try {
        await deletarFuncionario(id);
        setMensagem('Funcionário deletado com sucesso!');
        carregarFuncionarios();
        setTimeout(() => setMensagem(''), 3000);
      } catch (error) {
        setMensagem('Erro ao deletar funcionário');
      }
    }
  };

  return (
    <div className="funcionarios-container">
      <div className="funcionarios-header">
        <h1>Gestão de Funcionários</h1>
        <button 
          className="btn-novo-funcionario"
          onClick={() => navigate('/application/funcionarios/novo')}
        >
          + Novo Funcionário
        </button>
      </div>

      <div className="funcionarios-filtro">
        <input
          type="text"
          placeholder="Pesquise por nome ou cargo..."
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
        <div className={`mensagem-funcionarios ${mensagem.includes('sucesso') ? 'sucesso' : 'erro'}`}>
          {mensagem}
        </div>
      )}

      {loading ? (
        <div className="loading">Carregando...</div>
      ) : funcionarios.length === 0 ? (
        <div className="sem-dados">
          Nenhum funcionário registrado. <br />
          <button 
            className="link-button"
            onClick={() => navigate('/application/funcionarios/novo')}
          >
            Criar um novo funcionário
          </button>
        </div>
      ) : (
        <div className="tabela-wrapper">
          <table className="tabela-funcionarios">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Cargo</th>
                <th>Tipo de Contratação</th>
                <th>Carga Horária</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {funcionarios.map((funcionario) => (
                <tr key={funcionario.id}>
                  <td>{funcionario.nome}</td>
                  <td>{funcionario.cargo}</td>
                  <td>
                    <span className={`badge badge-${funcionario.tipoContratacao.toLowerCase()}`}>
                      {funcionario.tipoContratacao}
                    </span>
                  </td>
                  <td>{funcionario.cargaHoraria}h/semana</td>
                  <td className="acoes">
                    <button
                      className="btn-editar"
                      onClick={() => navigate(`/application/funcionarios/editar/${funcionario.id}`)}
                      title="Editar"
                    >
                      ✎
                    </button>
                    <button
                      className="btn-excluir"
                      onClick={() => handleDeletar(funcionario.id)}
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
