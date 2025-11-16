export interface Fornecedor {
  id: string;
  nome: string;
  endereco?: string;
  cnpj?: string;
  dataCriacao: string;
}

const CHAVE_FORNECEDORES = 'fornecedores';

class FornecedorService {
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

  async listarFornecedores(): Promise<Fornecedor[]> {
    return this.ler<Fornecedor>(CHAVE_FORNECEDORES);
  }

  async criarFornecedor(dados: Omit<Fornecedor, 'id' | 'dataCriacao'>): Promise<Fornecedor> {
    const novo: Fornecedor = { ...dados, id: this.gerarId(), dataCriacao: new Date().toISOString().split('T')[0] } as Fornecedor;
    const lista = this.ler<Fornecedor>(CHAVE_FORNECEDORES);
    lista.push(novo);
    this.salvar(CHAVE_FORNECEDORES, lista);
    return novo;
  }

  async obterFornecedor(id: string): Promise<Fornecedor | undefined> {
    const lista = this.ler<Fornecedor>(CHAVE_FORNECEDORES);
    return lista.find(f => f.id === id);
  }

  async atualizarFornecedor(id: string, dados: Partial<Fornecedor>): Promise<Fornecedor | undefined> {
    const lista = this.ler<Fornecedor>(CHAVE_FORNECEDORES);
    const idx = lista.findIndex(f => f.id === id);
    if (idx === -1) return undefined;
    lista[idx] = { ...lista[idx], ...dados };
    this.salvar(CHAVE_FORNECEDORES, lista);
    return lista[idx];
  }

  async removerFornecedor(id: string): Promise<void> {
    const lista = this.ler<Fornecedor>(CHAVE_FORNECEDORES).filter(f => f.id !== id);
    this.salvar(CHAVE_FORNECEDORES, lista);
  }
}

export default new FornecedorService();
