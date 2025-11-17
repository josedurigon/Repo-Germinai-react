
export interface Cultura {
  id: string;
  nome: string;
  variedade: string;
  ciclo: number;
  epocaPlantio: string;
  epocaColheita: string;
  tipoSolo: string;
  espacamento: string;
  sementesPorHa: number;
  produtividadeMedia: number;
  dataCriacao: string;
}

const STORAGE_KEY = 'culturas';

// Simular localStorage com fallback para API
class CulturaServiceClass {
  private delay(ms: number = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private gerarId(): string {
    return `CULT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  async listar(): Promise<Cultura[]> {
    await this.delay();
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  async obterPorId(id: string): Promise<Cultura | null> {
    await this.delay();
    const culturas = await this.listar();
    return culturas.find(c => c.id === id) || null;
  }

  async criar(cultura: Omit<Cultura, 'id' | 'dataCriacao'>): Promise<Cultura> {
    await this.delay();
    const culturas = await this.listar();
    
    const novaCultura: Cultura = {
      id: this.gerarId(),
      ...cultura,
      dataCriacao: new Date().toISOString(),
    };
    
    culturas.push(novaCultura);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(culturas));
    
    return novaCultura;
  }

  async atualizar(id: string, cultura: Partial<Omit<Cultura, 'id' | 'dataCriacao'>>): Promise<Cultura> {
    await this.delay();
    const culturas = await this.listar();
    const indice = culturas.findIndex(c => c.id === id);
    
    if (indice === -1) {
      throw new Error('Cultura não encontrada');
    }
    
    culturas[indice] = {
      ...culturas[indice],
      ...cultura,
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(culturas));
    return culturas[indice];
  }

  async deletar(id: string): Promise<void> {
    await this.delay();
    let culturas = await this.listar();
    culturas = culturas.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(culturas));
  }

  async pesquisar(termo: string): Promise<Cultura[]> {
    await this.delay();
    const culturas = await this.listar();
    const termoLower = termo.toLowerCase();
    return culturas.filter(
      c =>
        c.nome.toLowerCase().includes(termoLower) ||
        c.epocaPlantio.toLowerCase().includes(termoLower) ||
        c.tipoSolo.toLowerCase().includes(termoLower)
    );
  }
}

export async function listarCulturas(): Promise<Cultura[]> {
  const service = new CulturaServiceClass();
  return service.listar();
}

export async function buscarCulturaPorId(id: string): Promise<Cultura | null> {
  const service = new CulturaServiceClass();
  return service.obterPorId(id);
}

export async function criarCultura(cultura: Omit<Cultura, 'id' | 'dataCriacao'>): Promise<Cultura> {
  const service = new CulturaServiceClass();
  return service.criar(cultura);
}

export async function atualizarCultura(id: string, cultura: Partial<Omit<Cultura, 'id' | 'dataCriacao'>>): Promise<Cultura> {
  const service = new CulturaServiceClass();
  return service.atualizar(id, cultura);
}

export async function deletarCultura(id: string): Promise<void> {
  const service = new CulturaServiceClass();
  return service.deletar(id);
}

export async function pesquisarCulturas(termo: string): Promise<Cultura[]> {
  const service = new CulturaServiceClass();
  return service.pesquisar(termo);
}

export default new CulturaServiceClass();
