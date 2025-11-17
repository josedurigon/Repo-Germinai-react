import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  buscarFuncionarioPorId, 
  criarFuncionario, 
  atualizarFuncionario
} from '../../services/FuncionarioService';
import type { Funcionario } from '../../services/FuncionarioService';
import './FuncionarioForm.css';

export default function FuncionarioForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const [loading, setLoading] = useState(!!id);
  const [submitting, setSubmitting] = useState(false);
  const [mensagem, setMensagem] = useState('');
  
  const [formData, setFormData] = useState({
    nome: '',
    cargo: '',
    tipoContratacao: 'Permanente' as Funcionario['tipoContratacao'],
    cargaHoraria: 40,
  });

  useEffect(() => {
    if (id) {
      carregarFuncionario();
    }
  }, [id]);

  const carregarFuncionario = async () => {
    try {
      const funcionario = await buscarFuncionarioPorId(id!);
      if (funcionario) {
        setFormData({
          nome: funcionario.nome,
          cargo: funcionario.cargo,
          tipoContratacao: funcionario.tipoContratacao,
          cargaHoraria: funcionario.cargaHoraria,
        });
      }
    } catch (error) {
      setMensagem('Erro ao carregar funcionário');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    });
  };

  const validar = (): boolean => {
    if (!formData.nome.trim()) {
      setMensagem('Nome é obrigatório');
      return false;
    }
    if (!formData.cargo.trim()) {
      setMensagem('Cargo é obrigatório');
      return false;
    }
    if (formData.cargaHoraria <= 0) {
      setMensagem('Carga horária deve ser maior que 0');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validar()) return;

    try {
      setSubmitting(true);
      
      if (id) {
        await atualizarFuncionario(id, formData);
        setMensagem('Funcionário atualizado com sucesso!');
      } else {
        await criarFuncionario(formData);
        setMensagem('Funcionário criado com sucesso!');
      }

      setTimeout(() => {
        navigate('/application/funcionarios');
      }, 1500);
    } catch (error) {
      setMensagem('Erro ao salvar funcionário');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="funcionario-form-container">
      <div className="funcionario-form-header">
        <h1>{id ? 'Editar Funcionário' : 'Novo Funcionário'}</h1>
      </div>

      {mensagem && (
        <div className={`mensagem-form ${mensagem.includes('sucesso') ? 'sucesso' : 'erro'}`}>
          {mensagem}
        </div>
      )}

      <form onSubmit={handleSubmit} className="funcionario-form">
        <div className="form-group">
          <label htmlFor="nome">Nome Completo *</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            placeholder="Ex: João da Silva"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="cargo">Cargo *</label>
          <input
            type="text"
            id="cargo"
            name="cargo"
            value={formData.cargo}
            onChange={handleChange}
            placeholder="Ex: Operador de Trator, Técnico Agrícola"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="tipoContratacao">Tipo de Contratação *</label>
            <select
              id="tipoContratacao"
              name="tipoContratacao"
              value={formData.tipoContratacao}
              onChange={handleChange}
              required
            >
              <option value="Permanente">Permanente</option>
              <option value="Temporário">Temporário</option>
              <option value="Terceirizado">Terceirizado</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="cargaHoraria">Carga Horária (horas/semana) *</label>
            <input
              type="number"
              id="cargaHoraria"
              name="cargaHoraria"
              value={formData.cargaHoraria}
              onChange={handleChange}
              min="1"
              max="168"
              placeholder="40"
              required
            />
          </div>
        </div>

        <div className="form-buttons">
          <button 
            type="submit" 
            className="btn-salvar"
            disabled={submitting}
          >
            {submitting ? 'Salvando...' : 'Salvar'}
          </button>
          <button 
            type="button" 
            className="btn-cancelar"
            onClick={() => navigate('/application/funcionarios')}
            disabled={submitting}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
