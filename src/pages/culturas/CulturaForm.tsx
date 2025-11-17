import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  buscarCulturaPorId, 
  criarCultura, 
  atualizarCultura
} from '../../services/CulturaService';
import './CulturaForm.css';

export default function CulturaForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const [loading, setLoading] = useState(!!id);
  const [submitting, setSubmitting] = useState(false);
  const [mensagem, setMensagem] = useState('');
  
  const [formData, setFormData] = useState({
    nome: '',
    variedade: '',
    ciclo: 0,
    epocaPlantio: '',
    epocaColheita: '',
    tipoSolo: '',
    espacamento: '',
    sementesPorHa: 0,
    produtividadeMedia: 0,
  });

  useEffect(() => {
    if (id) {
      carregarCultura();
    }
  }, [id]);

  const carregarCultura = async () => {
    try {
      const cultura = await buscarCulturaPorId(id!);
      if (cultura) {
        setFormData({
          nome: cultura.nome,
          variedade: cultura.variedade,
          ciclo: cultura.ciclo,
          epocaPlantio: cultura.epocaPlantio,
          epocaColheita: cultura.epocaColheita,
          tipoSolo: cultura.tipoSolo,
          espacamento: cultura.espacamento,
          sementesPorHa: cultura.sementesPorHa,
          produtividadeMedia: cultura.produtividadeMedia,
        });
      }
    } catch (error) {
      setMensagem('Erro ao carregar cultura');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    if (formData.ciclo <= 0) {
      setMensagem('Ciclo deve ser maior que 0');
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
        await atualizarCultura(id, formData);
        setMensagem('Cultura atualizada com sucesso!');
      } else {
        await criarCultura(formData);
        setMensagem('Cultura criada com sucesso!');
      }

      setTimeout(() => {
        navigate('/application/culturas');
      }, 1500);
    } catch (error) {
      setMensagem('Erro ao salvar cultura');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="cultura-form-container">
      <div className="cultura-form-header">
        <h1>{id ? 'Editar Cultura' : 'Nova Cultura'}</h1>
      </div>

      {mensagem && (
        <div className={`mensagem-form ${mensagem.includes('sucesso') ? 'sucesso' : 'erro'}`}>
          {mensagem}
        </div>
      )}

      <form onSubmit={handleSubmit} className="cultura-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="nome">Nome *</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Ex: Milho, Soja"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="variedade">Variedade de Cultura</label>
            <input
              type="text"
              id="variedade"
              name="variedade"
              value={formData.variedade}
              onChange={handleChange}
              placeholder="Ex: Variedade x do Milho"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="ciclo">Ciclo (dias) *</label>
            <input
              type="number"
              id="ciclo"
              name="ciclo"
              value={formData.ciclo}
              onChange={handleChange}
              min="1"
              placeholder="120"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="epocaPlantio">Época de Plantio</label>
            <input
              type="text"
              id="epocaPlantio"
              name="epocaPlantio"
              value={formData.epocaPlantio}
              onChange={handleChange}
              placeholder="Ex: Setembro a Outubro"
            />
          </div>

          <div className="form-group">
            <label htmlFor="epocaColheita">Época de Colheita</label>
            <input
              type="text"
              id="epocaColheita"
              name="epocaColheita"
              value={formData.epocaColheita}
              onChange={handleChange}
              placeholder="Ex: Janeiro a Fevereiro"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="tipoSolo">Tipo de Solo</label>
            <input
              type="text"
              id="tipoSolo"
              name="tipoSolo"
              value={formData.tipoSolo}
              onChange={handleChange}
              placeholder="Ex: Argiloso, Arenoso"
            />
          </div>

          <div className="form-group">
            <label htmlFor="espacamento">Espaçamento</label>
            <input
              type="text"
              id="espacamento"
              name="espacamento"
              value={formData.espacamento}
              onChange={handleChange}
              placeholder="Ex: 0,5 x 0,8 m"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="sementesPorHa">Sementes por Hectare</label>
            <input
              type="number"
              id="sementesPorHa"
              name="sementesPorHa"
              value={formData.sementesPorHa}
              onChange={handleChange}
              min="0"
              placeholder="0"
            />
          </div>

          <div className="form-group">
            <label htmlFor="produtividadeMedia">Produtividade Média (kg/ha)</label>
            <input
              type="number"
              id="produtividadeMedia"
              name="produtividadeMedia"
              value={formData.produtividadeMedia}
              onChange={handleChange}
              min="0"
              placeholder="0"
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
            onClick={() => navigate('/application/culturas')}
            disabled={submitting}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
