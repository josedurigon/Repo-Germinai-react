import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  buscarRecursoPorId, 
  criarRecurso, 
  atualizarRecurso
} from '../../services/RecursoService';
import type { Recurso } from '../../services/RecursoService';
import './RecursoForm.css';

export default function RecursoForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const [loading, setLoading] = useState(!!id);
  const [submitting, setSubmitting] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [novoTipo, setNovoTipo] = useState('');
  const [tiposPersonalizados, setTiposPersonalizados] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    nome: '',
    tipo: 'Semente' as Recurso['tipo'],
    unidade: 'kg' as Recurso['unidade'],
  });

  useEffect(() => {
    if (id) {
      carregarRecurso();
    }
    // Carregar tipos personalizados do localStorage
    const tiposSalvos = localStorage.getItem('tiposRecursosPersonalizados');
    if (tiposSalvos) {
      setTiposPersonalizados(JSON.parse(tiposSalvos));
    }
  }, [id]);

  const carregarRecurso = async () => {
    try {
      const recurso = await buscarRecursoPorId(id!);
      if (recurso) {
        setFormData({
          nome: recurso.nome,
          tipo: recurso.tipo,
          unidade: recurso.unidade,
        });
      }
    } catch (error) {
      setMensagem('Erro ao carregar recurso');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSalvarNovoTipo = () => {
    if (!novoTipo.trim()) {
      alert('Por favor, digite um nome para o tipo de recurso');
      return;
    }
    
    const tiposAtualizados = [...tiposPersonalizados, novoTipo.trim()];
    setTiposPersonalizados(tiposAtualizados);
    localStorage.setItem('tiposRecursosPersonalizados', JSON.stringify(tiposAtualizados));
    
    // Selecionar o novo tipo no formulário
    setFormData({
      ...formData,
      tipo: novoTipo.trim() as Recurso['tipo'],
    });
    
    setNovoTipo('');
    setShowPopup(false);
  };

  const validar = (): boolean => {
    if (!formData.nome.trim()) {
      setMensagem('Nome é obrigatório');
      return false;
    }
    if (!formData.tipo) {
      setMensagem('Tipo é obrigatório');
      return false;
    }
    if (!formData.unidade) {
      setMensagem('Unidade de medida é obrigatória');
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
        await atualizarRecurso(id, formData);
        setMensagem('Recurso atualizado com sucesso!');
      } else {
        await criarRecurso(formData);
        setMensagem('Recurso criado com sucesso!');
      }

      setTimeout(() => {
        navigate('/application/recursos');
      }, 1500);
    } catch (error) {
      setMensagem('Erro ao salvar recurso');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="recurso-form-container">
      <div className="recurso-form-header">
        <h1>{id ? 'Editar Recurso' : 'Novo Recurso'}</h1>
      </div>

      {mensagem && (
        <div className={`mensagem-form ${mensagem.includes('sucesso') ? 'sucesso' : 'erro'}`}>
          {mensagem}
        </div>
      )}

      <form onSubmit={handleSubmit} className="recurso-form">
        <div className="form-group">
          <label htmlFor="nome">Nome *</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            placeholder="Ex: Adubo NPK, Inseticida XYZ"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="tipo">Tipo *</label>
            <div className="field-with-button">
              <select
                id="tipo"
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                required
              >
                <option value="Semente">Sementes</option>
                <option value="Fertilizante">Fertilizantes</option>
                <option value="Defensivo">Defensivos</option>
                <option value="Outro">Outro</option>
                {tiposPersonalizados.map((tipo) => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
              <button
                type="button"
                className="btn-novo-item"
                onClick={() => setShowPopup(true)}
                title="Adicionar novo tipo"
              >
                Novo Tipo
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="unidade">Unidade de Medida *</label>
            <select
              id="unidade"
              name="unidade"
              value={formData.unidade}
              onChange={handleChange}
              required
            >
              <option value="kg">Kilogramos (kg)</option>
              <option value="L">Litros (L)</option>
              <option value="sc">Sacas (sc)</option>
              <option value="ton">Toneladas (ton)</option>
            </select>
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
            onClick={() => navigate('/application/recursos')}
            disabled={submitting}
          >
            Cancelar
          </button>
        </div>
      </form>

      {/* Popup para adicionar novo tipo */}
      {showPopup && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h2>Novo Tipo de Recurso</h2>
            <div className="popup-form">
              <label htmlFor="novoTipo">Nome do Tipo *</label>
              <input
                type="text"
                id="novoTipo"
                value={novoTipo}
                onChange={(e) => setNovoTipo(e.target.value)}
                placeholder="Ex: Herbicida, Adubo Orgânico"
                autoFocus
                onKeyPress={(e) => e.key === 'Enter' && handleSalvarNovoTipo()}
              />
            </div>
            <div className="popup-buttons">
              <button
                type="button"
                className="btn-salvar"
                onClick={handleSalvarNovoTipo}
              >
                Salvar
              </button>
              <button
                type="button"
                className="btn-cancelar"
                onClick={() => {
                  setNovoTipo('');
                  setShowPopup(false);
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
