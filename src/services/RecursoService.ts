export interface Recurso {
  id: string;
  nome: string;
  tipo: 'Semente' | 'Fertilizante' | 'Defensivo' | 'Outro';
  unidade: 'kg' | 'L' | 'sc' | 'ton';
  dataCriacao: string;
}

const STORAGE_KEY = 'recursos';

class RecursoServiceClass {
  private delay(ms: number = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private gerarId(): string {
    return `REC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  async listar(): Promise<Recurso[]> {
    await this.delay();
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  async obterPorId(id: string): Promise<Recurso | null> {
    await this.delay();
    const recursos = await this.listar();
    return recursos.find(r => r.id === id) || null;
  }

  async criar(recurso: Omit<Recurso, 'id' | 'dataCriacao'>): Promise<Recurso> {
    await this.delay();
    const recursos = await this.listar();
    
    const novoRecurso: Recurso = {
      id: this.gerarId(),
      ...recurso,
      dataCriacao: new Date().toISOString(),
    };
    
    recursos.push(novoRecurso);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recursos));
    
    return novoRecurso;
  }

  async atualizar(id: string, recurso: Partial<Omit<Recurso, 'id' | 'dataCriacao'>>): Promise<Recurso> {
    await this.delay();
    const recursos = await this.listar();
    const indice = recursos.findIndex(r => r.id === id);
    
    if (indice === -1) {
      throw new Error('Recurso não encontrado');
    }
    
    recursos[indice] = {
      ...recursos[indice],
      ...recurso,
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recursos));
    return recursos[indice];
  }

  async deletar(id: string): Promise<void> {
    await this.delay();
    let recursos = await this.listar();
    recursos = recursos.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recursos));
  }

  async pesquisar(termo: string): Promise<Recurso[]> {
    await this.delay();
    const recursos = await this.listar();
    const termoLower = termo.toLowerCase();
    return recursos.filter(r =>
      r.nome.toLowerCase().includes(termoLower)
    );
  }

  async filtrarPorTipo(tipo: Recurso['tipo']): Promise<Recurso[]> {
    await this.delay();
    const recursos = await this.listar();
    return recursos.filter(r => r.tipo === tipo);
  }
}

export async function listarRecursos(): Promise<Recurso[]> {
  const service = new RecursoServiceClass();
  return service.listar();
}

export async function buscarRecursoPorId(id: string): Promise<Recurso | null> {
  const service = new RecursoServiceClass();
  return service.obterPorId(id);
}

export async function criarRecurso(recurso: Omit<Recurso, 'id' | 'dataCriacao'>): Promise<Recurso> {
  const service = new RecursoServiceClass();
  return service.criar(recurso);
}

export async function atualizarRecurso(id: string, recurso: Partial<Omit<Recurso, 'id' | 'dataCriacao'>>): Promise<Recurso> {
  const service = new RecursoServiceClass();
  return service.atualizar(id, recurso);
}

export async function deletarRecurso(id: string): Promise<void> {
  const service = new RecursoServiceClass();
  return service.deletar(id);
}

export async function pesquisarRecursos(termo: string): Promise<Recurso[]> {
  const service = new RecursoServiceClass();
  return service.pesquisar(termo);
}

export async function filtrarRecursosPorTipo(tipo: Recurso['tipo']): Promise<Recurso[]> {
  const service = new RecursoServiceClass();
  return service.filtrarPorTipo(tipo);
}

export default new RecursoServiceClass();
