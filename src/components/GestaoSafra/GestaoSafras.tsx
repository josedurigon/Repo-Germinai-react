import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Package, AlertTriangle, Plus } from 'lucide-react';

type StatusType = 'bom' | 'alerta' | 'critico';

interface Safra {
  id: number;
  cultura: string;
  area: number;
  fase: string;
  diasColheita: number;
  status: StatusType;
  progresso: number;
  icon: string;
}

interface CustoMensal {
  mes: string;
  sementes: number;
  adubos: number;
  custos: number;
}

interface ReceitaMensal {
  mes: string;
  receita: number;
  previsto: number;
}

interface Estoque {
  name: string;
  value: number;
  total: number;
  color: string;
  [key: string]: string | number;
}

const GestaoSafras = () => {
  const navigate = useNavigate();
  
  const [safras, setSafras] = useState<Safra[]>([]);
  const [dadosCustos, setDadosCustos] = useState<CustoMensal[]>([]);
  const [dadosReceita, setDadosReceita] = useState<ReceitaMensal[]>([]);
  const [estoqueData, setEstoqueData] = useState<Estoque[]>([]);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSafras = async () => {
      try {
        setLoading(true);
        
        const response = await fetch('/api/safra', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setSafras(data);
        } else {
          setSafras([
            { id: 1, cultura: 'Milho', area: 2, fase: 'Crescimento', diasColheita: 45, status: 'bom', progresso: 65, icon: '🌽' },
            { id: 2, cultura: 'Soja', area: 112, fase: 'Crescimento', diasColheita: 78, status: 'alerta', progresso: 45, icon: '🌱' },
            { id: 3, cultura: 'Café', area: 5, fase: 'Floração', diasColheita: 120, status: 'bom', progresso: 35, icon: '☕' }
          ]);
        }
      } catch (error) {
        console.error('Erro ao carregar safras:', error);
        setSafras([
          { id: 1, cultura: 'Milho', area: 2, fase: 'Crescimento', diasColheita: 45, status: 'bom', progresso: 65, icon: '🌽' },
          { id: 2, cultura: 'Soja', area: 112, fase: 'Crescimento', diasColheita: 78, status: 'alerta', progresso: 45, icon: '🌱' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSafras();
  }, []);

  useEffect(() => {
    const fetchCustos = async () => {
      try {
        const response = await fetch('/api/custos/mensais', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setDadosCustos(data);
        } else {
          setDadosCustos([
            { mes: 'Jan', sementes: 5000, adubos: 8000, custos: 3000 },
            { mes: 'Fev', sementes: 6000, adubos: 9000, custos: 3500 },
            { mes: 'Mar', sementes: 7000, adubos: 10000, custos: 4200 },
            { mes: 'Abr', sementes: 5500, adubos: 8500, custos: 3800 }
          ]);
        }
      } catch (error) {
        console.error('Erro ao carregar custos:', error);
        setDadosCustos([
          { mes: 'Jan', sementes: 5000, adubos: 8000, custos: 3000 },
          { mes: 'Fev', sementes: 6000, adubos: 9000, custos: 3500 }
        ]);
      }
    };

    fetchCustos();
  }, []);

  useEffect(() => {
    const fetchReceitas = async () => {
      try {
        const response = await fetch('/api/receitas/mensais', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setDadosReceita(data);
        } else {
          setDadosReceita([
            { mes: 'Jan', receita: 15000, previsto: 14000 },
            { mes: 'Fev', receita: 18000, previsto: 17000 },
            { mes: 'Mar', receita: 21000, previsto: 20000 },
            { mes: 'Abr', receita: 19000, previsto: 21000 }
          ]);
        }
      } catch (error) {
        console.error('Erro ao carregar receitas:', error);
        setDadosReceita([
          { mes: 'Jan', receita: 15000, previsto: 14000 },
          { mes: 'Fev', receita: 18000, previsto: 17000 }
        ]);
      }
    };

    fetchReceitas();
  }, []);

  useEffect(() => {
    const fetchEstoque = async () => {
      try {
        const response = await fetch('/api/estoque/insumos', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setEstoqueData(data);
        } else {
          setEstoqueData([
            { name: 'Fossante', value: 50, total: 120, color: '#f59e0b' },
            { name: 'Sobas', value: 50, total: 120, color: '#eab308' },
            { name: 'Defensivos', value: 120, total: 200, color: '#84cc16' },
            { name: 'Mão de obra', value: 0, total: 100, color: '#fb923c' }
          ]);
        }
      } catch (error) {
        console.error('Erro ao carregar estoque:', error);
        setEstoqueData([
          { name: 'Fossante', value: 50, total: 120, color: '#f59e0b' },
          { name: 'Sobas', value: 50, total: 120, color: '#eab308' }
        ]);
      }
    };

    fetchEstoque();
  }, []);

  const statusColor: Record<StatusType, string> = { 
    bom: '#10b981', 
    alerta: '#f59e0b', 
    critico: '#ef4444' 
  };
  
  const statusIcon: Record<StatusType, string> = { 
    bom: '🟢', 
    alerta: '🟡', 
    critico: '🔴' 
  };

  return (
    <div style={{ backgroundColor: '#F7F5E0', minHeight: '100%', padding: '20px' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px 24px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Gestão de Safras</h1>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '4px 0 0 0' }}>Acompanhe o desenvolvimento e custos de suas culturas</p>
        </div>
        <button
          onClick={() => navigate('/application/safras/novo')}
          style={{
            backgroundColor: '#244428',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            fontSize: '0.95rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#1a3320';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#244428';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <Plus size={20} /> Cadastrar Nova Safra
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>Safras Ativas</h2>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
              <p>Carregando safras...</p>
            </div>
          ) : safras.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px', 
              backgroundColor: 'white', 
              borderRadius: '12px',
              border: '2px dashed #d1d5db'
            }}>
              <p style={{ fontSize: '1.1rem', color: '#6b7280', marginBottom: '12px' }}>📋 Nenhuma safra cadastrada</p>
              <p style={{ fontSize: '0.9rem', color: '#9ca3af', marginBottom: '20px' }}>Cadastre suas safras para começar o acompanhamento</p>
              <button
                onClick={() => navigate('/application/safras/novo')}
                style={{
                  backgroundColor: '#244428',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Plus size={20} /> Cadastrar Primeira Safra
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {safras.map((safra) => (
                <div key={safra.id} style={{ 
                  backgroundColor: '#FFF9E6', 
                  borderRadius: '16px', 
                  padding: '24px', 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  border: '2px solid #E8DFC4'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                      <span style={{ fontSize: '3.5rem', marginBottom: '8px' }}>{safra.icon}</span>
                      <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#1f2937', margin: '0 0 4px 0', textAlign: 'center' }}>{safra.cultura}</h3>
                      <p style={{ fontSize: '0.9rem', color: '#6b7280', margin: '2px 0', textAlign: 'center' }}>{safra.fase}</p>
                      <p style={{ fontSize: '0.95rem', fontWeight: '600', color: '#374151', margin: '4px 0 0 0', textAlign: 'center' }}>{safra.area} hectares</p>
                    </div>
                    <span style={{ fontSize: '2rem' }}>{statusIcon[safra.status]}</span>
                  </div>
                  
                  <div style={{ 
                    backgroundColor: 'white', 
                    borderRadius: '10px', 
                    padding: '14px',
                    marginBottom: '14px',
                    border: '1px solid #E8DFC4'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '8px' }}>
                      <span style={{ color: '#6b7280', fontWeight: '500' }}>Fase atual:</span>
                      <span style={{ fontWeight: '600', color: '#1f2937' }}>{safra.fase}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                      <span style={{ color: '#6b7280', fontWeight: '500' }}>Dias até colheita:</span>
                      <span style={{ fontWeight: '700', color: '#16a34a' }}>{safra.diasColheita} dias</span>
                    </div>
                  </div>
                  
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '8px' }}>
                      <span style={{ color: '#6b7280', fontWeight: '600' }}>Progresso</span>
                      <span style={{ fontWeight: '700', color: '#1f2937', fontSize: '1rem' }}>{safra.progresso}%</span>
                    </div>
                    <div style={{ 
                      width: '100%', 
                      backgroundColor: '#E5E7EB', 
                      borderRadius: '9999px', 
                      height: '12px',
                      overflow: 'hidden'
                    }}>
                      <div style={{ 
                        height: '12px', 
                        borderRadius: '9999px', 
                        width: `${safra.progresso}%`,
                        backgroundColor: statusColor[safra.status],
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <TrendingUp style={{ color: '#16a34a' }} size={20} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Custos por Categoria</h3>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={dadosCustos}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '0.85rem' }} />
                <Legend wrapperStyle={{ fontSize: '0.85rem' }} />
                <Bar dataKey="sementes" fill="#f59e0b" name="Sementes" radius={[4, 4, 0, 0]} />
                <Bar dataKey="adubos" fill="#84cc16" name="Adubos" radius={[4, 4, 0, 0]} />
                <Bar dataKey="custos" fill="#ef4444" name="Custos" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#f0fdf4', borderRadius: '8px' }}>
              <p style={{ fontSize: '0.85rem', color: '#166534', margin: 0 }}>
                Total: <strong style={{ fontSize: '1rem' }}>R$ 21.250</strong>
              </p>
            </div>
          </div>

          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <TrendingUp style={{ color: '#2563eb' }} size={20} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Receita x Previsão</h3>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={dadosReceita}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '0.85rem' }} />
                <Legend wrapperStyle={{ fontSize: '0.85rem' }} />
                <Line type="monotone" dataKey="receita" stroke="#10b981" strokeWidth={2.5} name="Receita" dot={{ r: 4 }} />
                <Line type="monotone" dataKey="previsto" stroke="#ef4444" strokeWidth={2.5} strokeDasharray="5 5" name="Previsto" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
            <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
              <div style={{ flex: 1, padding: '10px', backgroundColor: '#dbeafe', borderRadius: '8px' }}>
                <p style={{ fontSize: '0.75rem', color: '#1e40af', margin: 0 }}>Receita: <strong>R$ 73k</strong></p>
              </div>
              <div style={{ flex: 1, padding: '10px', backgroundColor: '#d1fae5', borderRadius: '8px' }}>
                <p style={{ fontSize: '0.75rem', color: '#065f46', margin: 0 }}>Lucro: <strong>R$ 51k</strong></p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Package style={{ color: '#ea580c' }} size={20} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Estoque de Insumos</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px' }}>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={estoqueData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={5} dataKey="value">
                  {estoqueData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center' }}>
              {estoqueData.map((item, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: item.color }} />
                    <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#374151' }}>{item.name}</span>
                  </div>
                  <span style={{ fontSize: '0.85rem', color: '#6b7280', backgroundColor: 'white', padding: '4px 12px', borderRadius: '12px' }}>
                    {item.value}/{item.total} kg
                  </span>
                </div>
              ))}
              <div style={{ marginTop: '8px', padding: '12px', backgroundColor: '#fef2f2', borderLeft: '3px solid #dc2626', borderRadius: '0 8px 8px 0', display: 'flex', gap: '8px' }}>
                <AlertTriangle style={{ color: '#dc2626', flexShrink: 0 }} size={18} />
                <p style={{ fontSize: '0.8rem', color: '#991b1b', margin: 0, lineHeight: 1.4 }}>
                  <strong>Alerta:</strong> NPK abaixo do ideal (Soja)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestaoSafras;