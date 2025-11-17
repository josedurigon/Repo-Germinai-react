import { useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingUp, Package, AlertTriangle, Plus, Filter, X, Save } from 'lucide-react';

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

const GestaoSafras = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNewActivityModal, setShowNewActivityModal] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    tipo: '',
    status: '',
    cultura: ''
  });

  const safras: Safra[] = [
    { id: 1, cultura: 'Milho', area: 2, fase: 'Crescimento', diasColheita: 45, status: 'bom', progresso: 65, icon: '🌽' },
    { id: 2, cultura: 'Soja', area: 112, fase: 'Crescimento', diasColheita: 78, status: 'alerta', progresso: 45, icon: '🌱' },
    { id: 3, cultura: 'Café', area: 5, fase: 'Floração', diasColheita: 120, status: 'bom', progresso: 35, icon: '☕' }
  ];

  const dadosCustos = [
    { mes: 'Jan', sementes: 5000, adubos: 8000, custos: 3000 },
    { mes: 'Fev', sementes: 6000, adubos: 9000, custos: 3500 },
    { mes: 'Mar', sementes: 7000, adubos: 10000, custos: 4200 },
    { mes: 'Abr', sementes: 5500, adubos: 8500, custos: 3800 }
  ];

  const dadosReceita = [
    { mes: 'Jan', receita: 15000, previsto: 14000 },
    { mes: 'Fev', receita: 18000, previsto: 17000 },
    { mes: 'Mar', receita: 21000, previsto: 20000 },
    { mes: 'Abr', receita: 19000, previsto: 21000 }
  ];

  const estoqueData = [
    { name: 'Fossante', value: 50, total: 120, color: '#f59e0b' },
    { name: 'Sobas', value: 50, total: 120, color: '#eab308' },
    { name: 'Defensivos', value: 120, total: 200, color: '#84cc16' },
    { name: 'Mão de obra', value: 0, total: 100, color: '#fb923c' }
  ];

  const atividades = [
    { id: 1, tipo: 'Plantio', cultura: 'Milho', data: '2025-01-15', status: 'Concluída', insumos: 'Sementes: 50kg', area: '2ha' },
    { id: 2, tipo: 'Irrigação', cultura: 'Soja', data: '2025-02-20', status: 'Concluída', insumos: 'Água: 5000L', area: '112ha' },
    { id: 3, tipo: 'Adubação', cultura: 'Café', data: '2025-03-10', status: 'Pendente', insumos: 'NPK: 200kg', area: '5ha' },
    { id: 4, tipo: 'Aplicação', cultura: 'Soja', data: '2025-03-25', status: 'Concluída', insumos: 'Defensivo: 30L', area: '112ha' }
  ];

  const [newActivity, setNewActivity] = useState({
    tipo: '', cultura: '', data: '', descricao: '', insumos: '', quantidade: '', area: ''
  });

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
  
  const tiposAtividade = [
    { value: 'plantio', label: 'Plantio', icon: '🌱' },
    { value: 'irrigacao', label: 'Irrigação', icon: '💧' },
    { value: 'adubacao', label: 'Adubação', icon: '🌾' },
    { value: 'colheita', label: 'Colheita', icon: '🌽' }
  ];

  const handleSaveActivity = () => {
    console.log('Nova atividade:', newActivity);
    setShowNewActivityModal(false);
    setNewActivity({ tipo: '', cultura: '', data: '', descricao: '', insumos: '', quantidade: '', area: '' });
  };

  return (
    <div style={{ backgroundColor: '#F7F5E0', minHeight: '100%', padding: '20px' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px 24px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Gestão de Safras</h1>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '4px 0 0 0' }}>Acompanhe o desenvolvimento e custos de suas culturas</p>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '0 24px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', gap: '32px' }}>
          <button
            onClick={() => setActiveTab('dashboard')}
            style={{
              padding: '12px 8px',
              fontSize: '0.9rem',
              fontWeight: '600',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              borderBottom: activeTab === 'dashboard' ? '2px solid #244428' : '2px solid transparent',
              color: activeTab === 'dashboard' ? '#244428' : '#6b7280'
            }}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('atividades')}
            style={{
              padding: '12px 8px',
              fontSize: '0.9rem',
              fontWeight: '600',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              borderBottom: activeTab === 'atividades' ? '2px solid #244428' : '2px solid transparent',
              color: activeTab === 'atividades' ? '#244428' : '#6b7280'
            }}
          >
            Atividades
          </button>
        </div>
      </div>

      {activeTab === 'dashboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>Safras Ativas</h2>
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

          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar style={{ color: '#16a34a' }} size={20} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Progresso de Atividades</h3>
              </div>
              <button
                onClick={() => setShowNewActivityModal(true)}
                style={{
                  backgroundColor: '#244428',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Plus size={18} /> Nova Atividade
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              {tiposAtividade.map((tipo, index) => (
                <div key={index} style={{ textAlign: 'center', padding: '16px', backgroundColor: '#f0fdf4', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
                  <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '8px' }}>{tipo.icon}</span>
                  <p style={{ fontWeight: '600', color: '#166534', margin: '0 0 4px 0', fontSize: '0.9rem' }}>{tipo.label}</p>
                  <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: '0 0 8px 0' }}>{Math.floor(Math.random() * 100)}%</p>
                  <div style={{ width: '100%', backgroundColor: '#e5e7eb', borderRadius: '9999px', height: '6px' }}>
                    <div style={{ backgroundColor: '#16a34a', height: '6px', borderRadius: '9999px', width: `${Math.floor(Math.random() * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'atividades' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Histórico de Atividades</h2>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #d1d5db',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#374151'
                }}
              >
                <Filter size={18} /> Filtros
              </button>
              <button
                onClick={() => setShowNewActivityModal(true)}
                style={{
                  backgroundColor: '#244428',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Plus size={18} /> Nova Atividade
              </button>
            </div>
          </div>

          {filterOpen && (
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>Filtrar Atividades</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Tipo</label>
                  <select value={filters.tipo} onChange={(e) => setFilters({...filters, tipo: e.target.value})} style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.875rem' }}>
                    <option value="">Todos</option>
                    {tiposAtividade.map((tipo) => <option key={tipo.value} value={tipo.value}>{tipo.label}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Status</label>
                  <select value={filters.status} onChange={(e) => setFilters({...filters, status: e.target.value})} style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.875rem' }}>
                    <option value="">Todos</option>
                    <option value="concluida">Concluída</option>
                    <option value="pendente">Pendente</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Cultura</label>
                  <select value={filters.cultura} onChange={(e) => setFilters({...filters, cultura: e.target.value})} style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.875rem' }}>
                    <option value="">Todas</option>
                    <option value="milho">Milho</option>
                    <option value="soja">Soja</option>
                    <option value="cafe">Café</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <div style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#244428', color: 'white' }}>
                <tr>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '700' }}>Tipo</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '700' }}>Cultura</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '700' }}>Data</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '700' }}>Insumos</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '700' }}>Área</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '700' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {atividades.map((ativ, idx) => (
                  <tr key={ativ.id} style={{ borderBottom: idx < atividades.length - 1 ? '1px solid #e5e7eb' : 'none', backgroundColor: idx % 2 === 0 ? 'white' : '#f9fafb' }}>
                    <td style={{ padding: '12px 16px', fontSize: '0.875rem', fontWeight: '600', color: '#1f2937' }}>{ativ.tipo}</td>
                    <td style={{ padding: '12px 16px', fontSize: '0.875rem', color: '#6b7280' }}>{ativ.cultura}</td>
                    <td style={{ padding: '12px 16px', fontSize: '0.875rem', color: '#6b7280' }}>{new Date(ativ.data).toLocaleDateString('pt-BR')}</td>
                    <td style={{ padding: '12px 16px', fontSize: '0.875rem', color: '#6b7280' }}>{ativ.insumos}</td>
                    <td style={{ padding: '12px 16px', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>{ativ.area}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        backgroundColor: ativ.status === 'Concluída' ? '#d1fae5' : '#fef3c7',
                        color: ativ.status === 'Concluída' ? '#065f46' : '#92400e'
                      }}>
                        {ativ.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showNewActivityModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 50 }}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ backgroundColor: '#244428', color: 'white', padding: '20px 24px', borderRadius: '16px 16px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0 }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>Nova Atividade</h2>
              <button onClick={() => setShowNewActivityModal(false)} style={{ backgroundColor: 'transparent', border: 'none', color: 'white', cursor: 'pointer', padding: '4px' }}>
                <X size={24} />
              </button>
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', color: '#374151', marginBottom: '6px' }}>Tipo de Atividade *</label>
                <select value={newActivity.tipo} onChange={(e) => setNewActivity({...newActivity, tipo: e.target.value})} style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.875rem' }}>
                  <option value="">Selecione...</option>
                  {tiposAtividade.map((tipo) => <option key={tipo.value} value={tipo.value}>{tipo.icon} {tipo.label}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', color: '#374151', marginBottom: '6px' }}>Cultura *</label>
                <select value={newActivity.cultura} onChange={(e) => setNewActivity({...newActivity, cultura: e.target.value})} style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.875rem' }}>
                  <option value="">Selecione...</option>
                  <option value="milho">🌽 Milho</option>
                  <option value="soja">🌱 Soja</option>
                  <option value="cafe">☕ Café</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', color: '#374151', marginBottom: '6px' }}>Data *</label>
                  <input type="date" value={newActivity.data} onChange={(e) => setNewActivity({...newActivity, data: e.target.value})} style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.875rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', color: '#374151', marginBottom: '6px' }}>Área (ha) *</label>
                  <input type="number" value={newActivity.area} onChange={(e) => setNewActivity({...newActivity, area: e.target.value})} placeholder="Ex: 2.5" style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.875rem' }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', color: '#374151', marginBottom: '6px' }}>Insumos</label>
                  <input type="text" value={newActivity.insumos} onChange={(e) => setNewActivity({...newActivity, insumos: e.target.value})} placeholder="Ex: Fertilizante NPK" style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.875rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', color: '#374151', marginBottom: '6px' }}>Qtd (kg/L)</label>
                  <input type="number" value={newActivity.quantidade} onChange={(e) => setNewActivity({...newActivity, quantidade: e.target.value})} placeholder="50" style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.875rem' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', color: '#374151', marginBottom: '6px' }}>Observações</label>
                <textarea value={newActivity.descricao} onChange={(e) => setNewActivity({...newActivity, descricao: e.target.value})} rows={3} placeholder="Observações sobre a atividade..." style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.875rem', resize: 'none' }} />
              </div>
              <div style={{ padding: '12px', backgroundColor: '#dbeafe', borderLeft: '3px solid #2563eb', borderRadius: '0 8px 8px 0' }}>
                <p style={{ fontSize: '0.8rem', color: '#1e40af', margin: 0, lineHeight: 1.5 }}>
                  <strong>💡 Importante:</strong> Após salvar, estoque, custos e calendário serão atualizados automaticamente.
                </p>
              </div>
            </div>
            <div style={{ padding: '16px 24px', backgroundColor: '#f9fafb', borderRadius: '0 0 16px 16px', display: 'flex', justifyContent: 'flex-end', gap: '12px', position: 'sticky', bottom: 0 }}>
              <button onClick={() => setShowNewActivityModal(false)} style={{ padding: '8px 20px', border: '2px solid #d1d5db', backgroundColor: 'white', borderRadius: '8px', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer', color: '#374151' }}>
                Cancelar
              </button>
              <button onClick={handleSaveActivity} style={{ padding: '8px 20px', border: 'none', backgroundColor: '#244428', color: 'white', borderRadius: '8px', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Save size={18} /> Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestaoSafras;