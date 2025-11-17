import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  buscarSafraPorId, 
  criarSafra, 
  atualizarSafra
} from '../../services/SafraService';
import type { SafraCreateRequest } from '../../services/SafraService';
import { listarCulturas } from '../../services/CulturaService';
import { listarFuncionarios } from '../../services/FuncionarioService';
import type { Cultura } from '../../services/CulturaService';
import type { Funcionario } from '../../services/FuncionarioService';
import './SafraForm.css';

export default function SafraForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const [loading, setLoading] = useState(!!id);
  const [submitting, setSubmitting] = useState(false);
  const [mensagem, setMensagem] = useState('');
  
  const [culturas, setCulturas] = useState<Cultura[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  
  // Estados para equipe de funcionários
  interface FuncionarioSafra {
    funcionarioId: string;
    funcao: string;
  }
  const [equipe, setEquipe] = useState<FuncionarioSafra[]>([{ funcionarioId: '', funcao: '' }]);
  
  const [formData, setFormData] = useState<SafraCreateRequest>({
    codigoSafra: '',
    nome: '',
    culturaId: 0,
    responsavelId: 0 as number | string,
    dataInicio: '',
    dataFim: '',
    areaTotalHa: 0,
    receitaEstimada: 0,
    lucroPrevisto: 0,
  });

  useEffect(() => {
    carregarDados();
    if (id) {
      carregarSafra();
    }
  }, [id]);

  const carregarDados = async () => {
    try {
      const [culturasData, funcionariosData] = await Promise.all([
        listarCulturas(),
        listarFuncionarios()
      ]);
      setCulturas(culturasData);
      setFuncionarios(funcionariosData);
    } catch (error) {
      setMensagem('Erro ao carregar dados');
    }
  };

  const carregarSafra = async () => {
    try {
      const safra = await buscarSafraPorId(id!);
      if (safra) {
        setFormData({
          codigoSafra: safra.codigoSafra || '',
          nome: safra.nome,
          culturaId: safra.cultura.id,
          responsavelId: safra.responsavel.id,
          dataInicio: safra.dataInicio,
          dataFim: safra.dataFim || '',
          areaTotalHa: safra.areaTotalHa,
          receitaEstimada: safra.receitaEstimada || 0,
          lucroPrevisto: safra.lucroPrevisto || 0,
        });
      }
    } catch (error) {
      setMensagem('Erro ao carregar safra');
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

  const handleAdicionarCampoFuncionario = () => {
    setEquipe([...equipe, { funcionarioId: '', funcao: '' }]);
  };

  const handleRemoverCampoFuncionario = (index: number) => {
    if (equipe.length > 1) {
      const novaEquipe = equipe.filter((_, i) => i !== index);
      setEquipe(novaEquipe);
    }
  };

  const handleChangeFuncionario = (index: number, field: 'funcionarioId' | 'funcao', value: string) => {
    const novaEquipe = [...equipe];
    novaEquipe[index][field] = value;
    setEquipe(novaEquipe);
  };

  const validar = (): boolean => {
    if (!formData.nome.trim()) {
      setMensagem('Nome é obrigatório');
      return false;
    }
    if (!formData.culturaId || formData.culturaId === 0) {
      setMensagem('Cultura é obrigatória');
      return false;
    }
    if (!formData.responsavelId || formData.responsavelId === 0 || formData.responsavelId === '') {
      setMensagem('Responsável é obrigatório');
      return false;
    }
    if (!formData.dataInicio) {
      setMensagem('Data de início é obrigatória');
      return false;
    }
    if (formData.areaTotalHa <= 0) {
      setMensagem('Área total deve ser maior que 0');
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
        await atualizarSafra(id, formData);
        setMensagem('Safra atualizada com sucesso!');
      } else {
        await criarSafra(formData);
        setMensagem('Safra criada com sucesso!');
      }

      setTimeout(() => {
        navigate('/application/safras');
      }, 1500);
    } catch (error) {
      setMensagem('Erro ao salvar safra');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="safra-form-container">
      <div className="safra-form-header">
        <h1>{id ? 'Editar Safra' : 'Nova Safra'}</h1>
      </div>

      {mensagem && (
        <div className={`mensagem-form ${mensagem.includes('sucesso') ? 'sucesso' : 'erro'}`}>
          {mensagem}
        </div>
      )}

      <form onSubmit={handleSubmit} className="safra-form">
        {/* Identificação da Safra */}
        <div className="form-section">
          <h2 className="section-title">1. Identificação da Safra</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="codigoSafra">Código/ID da Safra</label>
              <input
                type="text"
                id="codigoSafra"
                name="codigoSafra"
                value={formData.codigoSafra}
                onChange={handleChange}
                placeholder="Ex: SAFRA-2024-001"
              />
            </div>

            <div className="form-group">
              <label htmlFor="nome">Nome da Safra *</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Ex: Safra Milho 2024/2025"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="culturaId">Cultura *</label>
              <select
                id="culturaId"
                name="culturaId"
                value={formData.culturaId}
                onChange={handleChange}
                required
              >
                <option value="0">Selecione uma cultura</option>
                {culturas.map((cultura) => (
                  <option key={cultura.id} value={cultura.id}>
                    {cultura.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="responsavelId">Responsável Administrativo *</label>
              <select
                id="responsavelId"
                name="responsavelId"
                value={formData.responsavelId}
                onChange={handleChange}
                required
              >
                <option value="0">Selecione o responsável administrativo</option>
                {funcionarios.map((funcionario) => (
                  <option key={funcionario.id} value={funcionario.id}>
                    {funcionario.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Funcionários da Safra */}
        <div className="form-section">
          <h2 className="section-title">2. Funcionários da Safra</h2>
          <p className="section-description">Adicione os funcionários que trabalharão nesta safra e suas respectivas funções.</p>
          
          {equipe.map((func, index) => (
            <div key={index} className="funcionario-row">
              <div className="funcionario-campos">
                <div className="form-group">
                  <label htmlFor={`funcionario-${index}`}>Funcionário</label>
                  <select
                    id={`funcionario-${index}`}
                    value={func.funcionarioId}
                    onChange={(e) => handleChangeFuncionario(index, 'funcionarioId', e.target.value)}
                  >
                    <option value="">Selecione um funcionário</option>
                    {funcionarios
                      .filter(f => f.id !== formData.responsavelId)
                      .map((funcionario) => (
                        <option key={funcionario.id} value={funcionario.id}>
                          {funcionario.nome}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor={`funcao-${index}`}>Função na Safra</label>
                  <input
                    type="text"
                    id={`funcao-${index}`}
                    value={func.funcao}
                    onChange={(e) => handleChangeFuncionario(index, 'funcao', e.target.value)}
                    placeholder="Ex: Operador de colheitadeira"
                  />
                </div>
              </div>

              <div className="funcionario-acoes">
                {equipe.length > 1 && (
                  <button
                    type="button"
                    className="btn-remover-campo"
                    onClick={() => handleRemoverCampoFuncionario(index)}
                    title="Remover este funcionário"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          ))}
          
          <button
            type="button"
            className="btn-adicionar-campo"
            onClick={handleAdicionarCampoFuncionario}
          >
            + Adicionar Funcionário
          </button>
        </div>

        {/* Período */}
        <div className="form-section">
          <h2 className="section-title">3. Período</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dataInicio">Data de Início *</label>
              <input
                type="date"
                id="dataInicio"
                name="dataInicio"
                value={formData.dataInicio}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="dataFim">Data de Fim (Prevista)</label>
              <input
                type="date"
                id="dataFim"
                name="dataFim"
                value={formData.dataFim}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Área */}
        <div className="form-section">
          <h2 className="section-title">4. Área</h2>
          
          <div className="form-group">
            <label htmlFor="areaTotalHa">Área Total (ha) *</label>
            <input
              type="number"
              id="areaTotalHa"
              name="areaTotalHa"
              value={formData.areaTotalHa}
              onChange={handleChange}
              min="0.01"
              step="0.01"
              placeholder="Ex: 50.00"
              required
            />
          </div>
        </div>

        {/* Financeiro */}
        <div className="form-section">
          <h2 className="section-title">5. Estimativas Financeiras</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="receitaEstimada">Receita Estimada (R$)</label>
              <input
                type="number"
                id="receitaEstimada"
                name="receitaEstimada"
                value={formData.receitaEstimada}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="Ex: 250000.00"
              />
            </div>

            <div className="form-group">
              <label htmlFor="lucroPrevisto">Lucro Previsto (R$)</label>
              <input
                type="number"
                id="lucroPrevisto"
                name="lucroPrevisto"
                value={formData.lucroPrevisto}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="Ex: 80000.00"
              />
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
            onClick={() => navigate('/application/safras')}
            disabled={submitting}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
