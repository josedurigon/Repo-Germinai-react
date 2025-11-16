export type MovimentoTipo = 'entrada' | 'saida';

export interface ItemEstoque {
  id: string;
  nome: string;
  sku?: string;
  quantidade: number; // quantidade atual
  unidade?: string;
  fornecedorId?: string;
  chaveIdentificacao?: string;
  dataCriacao: string;
}

export interface MovimentoEstoque {
  id: string;
  itemId: string;
  tipo: MovimentoTipo;
  quantidade: number;
  data: string; // DD-MM-AA
  observacoes?: string;
  dataCriacao: string;
}

const CHAVE_ITENS = 'estoque_itens';
const CHAVE_MOVIMENTOS = 'estoque_movimentos';

class EstoqueService {
  private gerarId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }

  private ler<T>(chave: string): T[] {
    try {
      const raw = localStorage.getItem(chave);
      return raw ? JSON.parse(raw) as T[] : [];
    } catch (e) {
      console.error('Erro lendo localStorage', chave, e);
      return [];
    }
  }

  private salvar<T>(chave: string, dados: T[]) {
    try {
      localStorage.setItem(chave, JSON.stringify(dados));
    } catch (e) {
      console.error('Erro salvando localStorage', chave, e);
    }
  }

  // Itens
  async criarItem(dados: Omit<ItemEstoque, 'id' | 'dataCriacao'>): Promise<ItemEstoque> {
    const novo: ItemEstoque = { ...dados, id: this.gerarId(), dataCriacao: new Date().toISOString().split('T')[0] } as ItemEstoque;
    const itens = this.ler<ItemEstoque>(CHAVE_ITENS);
    itens.push(novo);
    this.salvar(CHAVE_ITENS, itens);
    return novo;
  }

  async listarItens(): Promise<ItemEstoque[]> {
    return this.ler<ItemEstoque>(CHAVE_ITENS);
  }

  async obterItem(id: string): Promise<ItemEstoque | undefined> {
    const itens = this.ler<ItemEstoque>(CHAVE_ITENS);
    return itens.find(i => i.id === id);
  }

  async atualizarQuantidadeItem(id: string, delta: number): Promise<ItemEstoque | undefined> {
    const itens = this.ler<ItemEstoque>(CHAVE_ITENS);
    const idx = itens.findIndex(i => i.id === id);
    if (idx === -1) return undefined;
    itens[idx].quantidade = Math.max(0, Number((itens[idx].quantidade || 0) + delta));
    this.salvar(CHAVE_ITENS, itens);
    return itens[idx];
  }

  async removerItem(id: string): Promise<void> {
    const itens = this.ler<ItemEstoque>(CHAVE_ITENS).filter(i => i.id !== id);
    this.salvar(CHAVE_ITENS, itens);
  }

  // Movimentos
  async criarMovimento(dados: Omit<MovimentoEstoque, 'id' | 'dataCriacao'>): Promise<MovimentoEstoque> {
    const novo: MovimentoEstoque = { ...dados, id: this.gerarId(), dataCriacao: new Date().toISOString().split('T')[0] } as MovimentoEstoque;
    const movimentos = this.ler<MovimentoEstoque>(CHAVE_MOVIMENTOS);
    movimentos.push(novo);
    this.salvar(CHAVE_MOVIMENTOS, movimentos);

    // atualiza quantidade do item
    const delta = novo.tipo === 'entrada' ? novo.quantidade : -novo.quantidade;
    await this.atualizarQuantidadeItem(novo.itemId, delta);

    return novo;
  }

  async listarMovimentos(): Promise<MovimentoEstoque[]> {
    return this.ler<MovimentoEstoque>(CHAVE_MOVIMENTOS).sort((a,b) => a.data.localeCompare(b.data));
  }

  async listarMovimentosPorPeriodo(dataInicio: string, dataFim: string, tipo?: MovimentoTipo, itemId?: string): Promise<MovimentoEstoque[]> {
    const movimentos = await this.listarMovimentos();
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);

    return movimentos.filter(m => {
      const d = new Date(m.data);
      if (d < inicio || d > fim) return false;
      if (tipo && m.tipo !== tipo) return false;
      if (itemId && m.itemId !== itemId) return false;
      return true;
    });
  }

  async deletarMovimento(id: string): Promise<void> {
    const movimentos = this.ler<MovimentoEstoque>(CHAVE_MOVIMENTOS).filter(m => m.id !== id);
    this.salvar(CHAVE_MOVIMENTOS, movimentos);
  }

  async resumo(): Promise<{ totalItens: number; totalEntrada: number; totalSaida: number }>{
    const itens = this.ler<ItemEstoque>(CHAVE_ITENS);
    const movimentos = this.ler<MovimentoEstoque>(CHAVE_MOVIMENTOS);
    const totalEntrada = movimentos.filter(m => m.tipo === 'entrada').reduce((s, m) => s + m.quantidade, 0);
    const totalSaida = movimentos.filter(m => m.tipo === 'saida').reduce((s, m) => s + m.quantidade, 0);
    return { totalItens: itens.length, totalEntrada, totalSaida };
  }
}

export default new EstoqueService();
