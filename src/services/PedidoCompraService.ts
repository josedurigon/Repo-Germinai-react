// Importar api quando backend estiver pronto
// import { api } from '../api/axios';

export interface ItemPedido {
  id?: number;
  descricao: string;
  quantidade: number;
  precoUnitario: number;
}

export interface PedidoCompra {
  id?: number;
  fornecedor: string;
  data: string;
  status: 'Rascunho' | 'Enviado' | 'Aprovado' | 'Cancelado';
  itens: ItemPedido[];
  total?: number;
  dataCriacao?: string;
}

// Simular API - substituir por chamadas reais quando backend estiver pronto
const pedidosLocalStorage = (): PedidoCompra[] => {
  const stored = localStorage.getItem('pedidos_compra');
  return stored ? JSON.parse(stored) : [];
};

const salvarPedidosLocalStorage = (pedidos: PedidoCompra[]): void => {
  localStorage.setItem('pedidos_compra', JSON.stringify(pedidos));
};

export async function criarPedidoCompra(pedido: PedidoCompra): Promise<PedidoCompra> {
  try {
    // TODO: Descomentar quando API estiver pronta
    // const { data } = await api.post<PedidoCompra>("/pedido-compra", pedido);
    // return data;

    // Simulação com localStorage
    const pedidos = pedidosLocalStorage();
    const novoId = Math.max(...pedidos.map(p => p.id || 0), 0) + 1;
    const novoPedido: PedidoCompra = {
      ...pedido,
      id: novoId,
      dataCriacao: new Date().toISOString(),
      total: pedido.itens.reduce((sum, item) => sum + (item.quantidade * item.precoUnitario), 0),
    };
    pedidos.push(novoPedido);
    salvarPedidosLocalStorage(pedidos);
    return novoPedido;
  } catch (error: any) {
    if (error.response?.data) throw new Error(error.response.data);
    throw error;
  }
}

export async function listarPedidosCompra(): Promise<PedidoCompra[]> {
  try {
    // TODO: Descomentar quando API estiver pronta
    // const { data } = await api.get<PedidoCompra[]>("/pedido-compra");
    // return data;

    // Simulação com localStorage
    return pedidosLocalStorage();
  } catch (error: any) {
    if (error.response?.data) throw new Error(error.response.data);
    throw error;
  }
}

export async function obterPedidoCompra(id: number): Promise<PedidoCompra> {
  try {
    // TODO: Descomentar quando API estiver pronta
    // const { data } = await api.get<PedidoCompra>(`/pedido-compra/${id}`);
    // return data;

    // Simulação com localStorage
    const pedidos = pedidosLocalStorage();
    const pedido = pedidos.find(p => p.id === id);
    if (!pedido) throw new Error('Pedido não encontrado');
    return pedido;
  } catch (error: any) {
    if (error.response?.data) throw new Error(error.response.data);
    throw error;
  }
}

export async function atualizarPedidoCompra(id: number, pedido: PedidoCompra): Promise<PedidoCompra> {
  try {
    // TODO: Descomentar quando API estiver pronta
    // const { data } = await api.put<PedidoCompra>(`/pedido-compra/${id}`, pedido);
    // return data;

    // Simulação com localStorage
    const pedidos = pedidosLocalStorage();
    const index = pedidos.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Pedido não encontrado');
    pedidos[index] = { ...pedido, id };
    salvarPedidosLocalStorage(pedidos);
    return pedidos[index];
  } catch (error: any) {
    if (error.response?.data) throw new Error(error.response.data);
    throw error;
  }
}

export async function deletarPedidoCompra(id: number): Promise<void> {
  try {
    // TODO: Descomentar quando API estiver pronta
    // await api.delete(`/pedido-compra/${id}`);

    // Simulação com localStorage
    const pedidos = pedidosLocalStorage();
    const filtered = pedidos.filter(p => p.id !== id);
    salvarPedidosLocalStorage(filtered);
  } catch (error: any) {
    if (error.response?.data) throw new Error(error.response.data);
    throw error;
  }
}

export async function listarPedidosPorPeriodo(dataInicio: string, dataFim: string): Promise<PedidoCompra[]> {
  try {
    // TODO: Descomentar quando API estiver pronta
    // const { data } = await api.get<PedidoCompra[]>("/pedido-compra/periodo", {
    //   params: { dataInicio, dataFim }
    // });
    // return data;

    // Simulação com localStorage
    const pedidos = pedidosLocalStorage();
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);
    fim.setHours(23, 59, 59, 999);

    return pedidos.filter(p => {
      const dataPedido = new Date(p.data);
      return dataPedido >= inicio && dataPedido <= fim;
    });
  } catch (error: any) {
    if (error.response?.data) throw new Error(error.response.data);
    throw error;
  }
}

export default {
  criarPedidoCompra,
  listarPedidosCompra,
  obterPedidoCompra,
  atualizarPedidoCompra,
  deletarPedidoCompra,
  listarPedidosPorPeriodo,
};
