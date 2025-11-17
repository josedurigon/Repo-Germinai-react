import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  buscarTalhaoPorId, 
  criarTalhao, 
  atualizarTalhao
} from '../../services/TalhaoService';
import './TalhaoForm.css';

export default function TalhaoForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const [loading, setLoading] = useState(!!id);
  const [submitting, setSubmitting] = useState(false);
  const [mensagem, setMensagem] = useState('');
  
  const [formData, setFormData] = useState({
    nome: '',
    codigoInterno: '',
    areaTotal: 0,
    areaUtil: 0,
    fazenda: '',
    tipoSolo: '',
    analiseSolo: '',
    status: 'Ativo' as 'Ativo' | 'Inativo',
  });

  useEffect(() => {
    if (id) {
      carregarTalhao();
    }
  }, [id]);

  const carregarTalhao = async () => {
    try {
      const talhao = await buscarTalhaoPorId(id!);
      if (talhao) {
        setFormData({
          nome: talhao.nome,
          codigoInterno: talhao.codigoInterno,
          areaTotal: talhao.areaTotal,
          areaUtil: talhao.areaUtil,
          fazenda: talhao.fazenda,
          tipoSolo: talhao.tipoSolo,
          analiseSolo: talhao.analiseSolo,
          status: talhao.status,
        });
      }
    } catch (error) {
      setMensagem('Erro ao carregar talhão');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
    if (formData.areaTotal <= 0) {
      setMensagem('Área total deve ser maior que 0');
      return false;
    }
    if (formData.areaUtil < 0) {
      setMensagem('Área útil não pode ser negativa');
      return false;
    }
    if (formData.areaUtil > formData.areaTotal) {
      setMensagem('Área útil não pode ser maior que área total');
      return false;
    }
    if (!formData.fazenda.trim()) {
      setMensagem('Fazenda/Propriedade é obrigatória');
      return false;
    }
    if (!formData.tipoSolo.trim()) {
      setMensagem('Tipo de solo é obrigatório');
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
        await atualizarTalhao(id, formData);
        setMensagem('Talhão atualizado com sucesso!');
      } else {
        await criarTalhao(formData);
        setMensagem('Talhão criado com sucesso!');
      }

      setTimeout(() => {
        navigate('/application/talhoes');
      }, 1500);
    } catch (error) {
      setMensagem('Erro ao salvar talhão');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="talhao-form-container">
      <div className="talhao-form-header">
        <h1>{id ? 'Editar Talhão' : 'Novo Talhão'}</h1>
      </div>

      {mensagem && (
        <div className={`mensagem-form ${mensagem.includes('sucesso') ? 'sucesso' : 'erro'}`}>
          {mensagem}
        </div>
      )}

      <form onSubmit={handleSubmit} className="talhao-form">
        {/* Identificação do Talhão */}
        <div className="form-section">
          <h2 className="section-title">1. Identificação do Talhão</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nome">Nome *</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Ex: Talhão 01, Talhão Norte"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="codigoInterno">Código Interno</label>
              <input
                type="text"
                id="codigoInterno"
                name="codigoInterno"
                value={formData.codigoInterno}
                onChange={handleChange}
                placeholder="Ex: T-001, NORTE-A"
              />
            </div>
          </div>
        </div>

        {/* Dados Geográficos */}
        <div className="form-section">
          <h2 className="section-title">2. Dados Geográficos</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="areaTotal">Área Total (ha) *</label>
              <input
                type="number"
                id="areaTotal"
                name="areaTotal"
                value={formData.areaTotal}
                onChange={handleChange}
                min="0.01"
                step="0.01"
                placeholder="10.50"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="areaUtil">Área Útil (ha)</label>
              <input
                type="number"
                id="areaUtil"
                name="areaUtil"
                value={formData.areaUtil}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="9.80"
              />
              <small className="field-hint">Descontando APP e áreas improdutivas</small>
            </div>
          </div>
        </div>

        {/* Propriedade / Fazenda */}
        <div className="form-section">
          <h2 className="section-title">3. Propriedade / Fazenda</h2>
          
          <div className="form-row">
            <div className="form-group form-group-full">
              <label htmlFor="fazenda">Fazenda / Propriedade *</label>
              <input
                type="text"
                id="fazenda"
                name="fazenda"
                value={formData.fazenda}
                onChange={handleChange}
                placeholder="Ex: Fazenda Santa Clara, Sítio Boa Vista"
                required
              />
              <small className="field-hint">Futuramente este campo será um seletor de fazendas cadastradas</small>
            </div>
          </div>
        </div>

        {/* Tipo de Solo */}
        <div className="form-section">
          <h2 className="section-title">4. Tipo de Solo</h2>
          
          <div className="form-row">
            <div className="form-group form-group-full">
              <label htmlFor="tipoSolo">Tipo de Solo *</label>
              <input
                type="text"
                id="tipoSolo"
                name="tipoSolo"
                value={formData.tipoSolo}
                onChange={handleChange}
                placeholder="Ex: Arenoso, Argiloso, Misto, Latossolo, Cambissolo"
                required
              />
              <small className="field-hint">Informe o tipo predominante: Arenoso, Argiloso, Misto, Latossolo, Cambissolo, etc.</small>
            </div>
          </div>
        </div>

        {/* Análise de Solo */}
        <div className="form-section">
          <h2 className="section-title">5. Análise de Solo</h2>
          
          <div className="form-group">
            <label htmlFor="analiseSolo">Histórico e Características</label>
            <textarea
              id="analiseSolo"
              name="analiseSolo"
              value={formData.analiseSolo}
              onChange={handleChange}
              placeholder="Histórico de safras, características químicas e físicas do solo, recomendações técnicas..."
              rows={5}
            />
          </div>
        </div>

        {/* Status */}
        <div className="form-section">
          <h2 className="section-title">6. Status</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status">Status do Talhão *</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </select>
            </div>
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
            onClick={() => navigate('/application/talhoes')}
            disabled={submitting}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
