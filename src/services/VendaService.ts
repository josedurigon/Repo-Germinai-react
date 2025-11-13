// Importar api quando backend estiver pronto
// import { api } from '../api/axios';

export interface Venda {
  id?: number;
  cliente: string;
  produto: string;
  quantidade: number;
  precoUnitario: number;
  total: number;
  data: string;
  statusPagamento: 'Pendente' | 'Pago' | 'Cancelado';
  dataCriacao?: string;
}

// Simular API - substituir por chamadas reais quando backend estiver pronto
const vendasLocalStorage = (): Venda[] => {
  const stored = localStorage.getItem('vendas');
  return stored ? JSON.parse(stored) : [];
};

const salvarVendasLocalStorage = (vendas: Venda[]): void => {
  localStorage.setItem('vendas', JSON.stringify(vendas));
};

export async function criarVenda(venda: Venda): Promise<Venda> {
  try {
    // TODO: Descomentar quando API estiver pronta
    // const { data } = await api.post<Venda>("/vendas", venda);
    // return data;

    // Simulação com localStorage
    const vendas = vendasLocalStorage();
    const novoId = Math.max(...vendas.map(v => v.id || 0), 0) + 1;
    const novaVenda: Venda = {
      ...venda,
      id: novoId,
      dataCriacao: new Date().toISOString(),
    };
    vendas.push(novaVenda);
    salvarVendasLocalStorage(vendas);
    return novaVenda;
  } catch (error: any) {
    if (error.response?.data) throw new Error(error.response.data);
    throw error;
  }
}

export async function listarVendas(): Promise<Venda[]> {
  try {
    // TODO: Descomentar quando API estiver pronta
    // const { data } = await api.get<Venda[]>("/vendas");
    // return data;

    // Simulação com localStorage
    return vendasLocalStorage();
  } catch (error: any) {
    if (error.response?.data) throw new Error(error.response.data);
    throw error;
  }
}

export async function obterVenda(id: number): Promise<Venda> {
  try {
    // TODO: Descomentar quando API estiver pronta
    // const { data } = await api.get<Venda>(`/vendas/${id}`);
    // return data;

    // Simulação com localStorage
    const vendas = vendasLocalStorage();
    const venda = vendas.find(v => v.id === id);
    if (!venda) throw new Error('Venda não encontrada');
    return venda;
  } catch (error: any) {
    if (error.response?.data) throw new Error(error.response.data);
    throw error;
  }
}

export async function atualizarVenda(id: number, venda: Venda): Promise<Venda> {
  try {
    // TODO: Descomentar quando API estiver pronta
    // const { data } = await api.put<Venda>(`/vendas/${id}`, venda);
    // return data;

    // Simulação com localStorage
    const vendas = vendasLocalStorage();
    const index = vendas.findIndex(v => v.id === id);
    if (index === -1) throw new Error('Venda não encontrada');
    vendas[index] = { ...venda, id };
    salvarVendasLocalStorage(vendas);
    return vendas[index];
  } catch (error: any) {
    if (error.response?.data) throw new Error(error.response.data);
    throw error;
  }
}

export async function deletarVenda(id: number): Promise<void> {
  try {
    // TODO: Descomentar quando API estiver pronta
    // await api.delete(`/vendas/${id}`);

    // Simulação com localStorage
    const vendas = vendasLocalStorage();
    const filtered = vendas.filter(v => v.id !== id);
    salvarVendasLocalStorage(filtered);
  } catch (error: any) {
    if (error.response?.data) throw new Error(error.response.data);
    throw error;
  }
}

export async function listarVendasPorPeriodo(dataInicio: string, dataFim: string): Promise<Venda[]> {
  try {
    // TODO: Descomentar quando API estiver pronta
    // const { data } = await api.get<Venda[]>("/vendas/periodo", {
    //   params: { dataInicio, dataFim }
    // });
    // return data;

    // Simulação com localStorage
    const vendas = vendasLocalStorage();
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);
    fim.setHours(23, 59, 59, 999);

    return vendas.filter(v => {
      const dataVenda = new Date(v.data);
      return dataVenda >= inicio && dataVenda <= fim;
    });
  } catch (error: any) {
    if (error.response?.data) throw new Error(error.response.data);
    throw error;
  }
}

export default {
  criarVenda,
  listarVendas,
  obterVenda,
  atualizarVenda,
  deletarVenda,
  listarVendasPorPeriodo,
};
