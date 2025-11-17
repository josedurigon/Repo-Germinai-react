export interface Funcionario {
  id: string;
  nome: string;
  cargo: string;
  tipoContratacao: 'Permanente' | 'Temporário' | 'Terceirizado' | 'Diarista' | 'Folguista' | 'Outro';
  regimeTrabalho?: 'Horas/Semana' | 'Diárias' | 'Mensal' | 'Tempo de Plantio';
  cargaHoraria: number;
  endereco?: string;
  telefone?: string;
  registroId?: string;
  observacoes?: string;
  dataCriacao: string;
}

const STORAGE_KEY = 'funcionarios';

class FuncionarioServiceClass {
  private delay(ms: number = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private gerarId(): string {
    return `FUNC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  async listar(): Promise<Funcionario[]> {
    await this.delay();
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  async obterPorId(id: string): Promise<Funcionario | null> {
    await this.delay();
    const funcionarios = await this.listar();
    return funcionarios.find(f => f.id === id) || null;
  }

  async criar(funcionario: Omit<Funcionario, 'id' | 'dataCriacao'>): Promise<Funcionario> {
    await this.delay();
    const funcionarios = await this.listar();
    
    const novoFuncionario: Funcionario = {
      id: this.gerarId(),
      ...funcionario,
      dataCriacao: new Date().toISOString(),
    };
    
    funcionarios.push(novoFuncionario);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(funcionarios));
    
    return novoFuncionario;
  }

  async atualizar(id: string, funcionario: Partial<Omit<Funcionario, 'id' | 'dataCriacao'>>): Promise<Funcionario> {
    await this.delay();
    const funcionarios = await this.listar();
    const indice = funcionarios.findIndex(f => f.id === id);
    
    if (indice === -1) {
      throw new Error('Funcionário não encontrado');
    }
    
    funcionarios[indice] = {
      ...funcionarios[indice],
      ...funcionario,
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(funcionarios));
    return funcionarios[indice];
  }

  async deletar(id: string): Promise<void> {
    await this.delay();
    let funcionarios = await this.listar();
    funcionarios = funcionarios.filter(f => f.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(funcionarios));
  }

  async pesquisar(termo: string): Promise<Funcionario[]> {
    await this.delay();
    const funcionarios = await this.listar();
    const termoLower = termo.toLowerCase();
    return funcionarios.filter(f =>
      f.nome.toLowerCase().includes(termoLower) ||
      f.cargo.toLowerCase().includes(termoLower)
    );
  }
}

export async function listarFuncionarios(): Promise<Funcionario[]> {
  const service = new FuncionarioServiceClass();
  return service.listar();
}

export async function buscarFuncionarioPorId(id: string): Promise<Funcionario | null> {
  const service = new FuncionarioServiceClass();
  return service.obterPorId(id);
}

export async function criarFuncionario(funcionario: Omit<Funcionario, 'id' | 'dataCriacao'>): Promise<Funcionario> {
  const service = new FuncionarioServiceClass();
  return service.criar(funcionario);
}

export async function atualizarFuncionario(id: string, funcionario: Partial<Omit<Funcionario, 'id' | 'dataCriacao'>>): Promise<Funcionario> {
  const service = new FuncionarioServiceClass();
  return service.atualizar(id, funcionario);
}

export async function deletarFuncionario(id: string): Promise<void> {
  const service = new FuncionarioServiceClass();
  return service.deletar(id);
}

export async function pesquisarFuncionarios(termo: string): Promise<Funcionario[]> {
  const service = new FuncionarioServiceClass();
  return service.pesquisar(termo);
}

export default new FuncionarioServiceClass();
