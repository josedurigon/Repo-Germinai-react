
export interface Talhao {
  id: string;
  nome: string;
  codigoInterno: string;
  areaTotal: number;
  areaUtil: number;
  fazenda: string;
  tipoSolo: string;
  analiseSolo: string;
  status: 'Ativo' | 'Inativo';
  dataCriacao: string;
}

const STORAGE_KEY = 'talhoes';

class TalhaoServiceClass {
  private delay(ms: number = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private gerarId(): string {
    return `TALH-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  async listar(): Promise<Talhao[]> {
    await this.delay();
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  async obterPorId(id: string): Promise<Talhao | null> {
    await this.delay();
    const talhoes = await this.listar();
    return talhoes.find(t => t.id === id) || null;
  }

  async criar(talhao: Omit<Talhao, 'id' | 'dataCriacao'>): Promise<Talhao> {
    await this.delay();
    const talhoes = await this.listar();
    
    const novoTalhao: Talhao = {
      id: this.gerarId(),
      ...talhao,
      dataCriacao: new Date().toISOString(),
    };
    
    talhoes.push(novoTalhao);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(talhoes));
    
    return novoTalhao;
  }

  async atualizar(id: string, talhao: Partial<Omit<Talhao, 'id' | 'dataCriacao'>>): Promise<Talhao> {
    await this.delay();
    const talhoes = await this.listar();
    const indice = talhoes.findIndex(t => t.id === id);
    
    if (indice === -1) {
      throw new Error('Talhão não encontrado');
    }
    
    talhoes[indice] = {
      ...talhoes[indice],
      ...talhao,
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(talhoes));
    return talhoes[indice];
  }

  async deletar(id: string): Promise<void> {
    await this.delay();
    let talhoes = await this.listar();
    talhoes = talhoes.filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(talhoes));
  }

  async pesquisar(termo: string): Promise<Talhao[]> {
    await this.delay();
    const talhoes = await this.listar();
    const termoLower = termo.toLowerCase();
    return talhoes.filter(t =>
      t.nome.toLowerCase().includes(termoLower) ||
      t.codigoInterno.toLowerCase().includes(termoLower) ||
      t.fazenda.toLowerCase().includes(termoLower) ||
      t.tipoSolo.toLowerCase().includes(termoLower) ||
      t.analiseSolo.toLowerCase().includes(termoLower)
    );
  }
}

export async function listarTalhoes(): Promise<Talhao[]> {
  const service = new TalhaoServiceClass();
  return service.listar();
}

export async function buscarTalhaoPorId(id: string): Promise<Talhao | null> {
  const service = new TalhaoServiceClass();
  return service.obterPorId(id);
}

export async function criarTalhao(talhao: Omit<Talhao, 'id' | 'dataCriacao'>): Promise<Talhao> {
  const service = new TalhaoServiceClass();
  return service.criar(talhao);
}

export async function atualizarTalhao(id: string, talhao: Partial<Omit<Talhao, 'id' | 'dataCriacao'>>): Promise<Talhao> {
  const service = new TalhaoServiceClass();
  return service.atualizar(id, talhao);
}

export async function deletarTalhao(id: string): Promise<void> {
  const service = new TalhaoServiceClass();
  return service.deletar(id);
}

export async function pesquisarTalhoes(termo: string): Promise<Talhao[]> {
  const service = new TalhaoServiceClass();
  return service.pesquisar(termo);
}

export default new TalhaoServiceClass();
