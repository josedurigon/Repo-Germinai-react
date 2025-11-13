export type TipoAtividade = 'plantio' | 'irrigacao' | 'adubacao' | 'praga' | 'colheita' | 'manutencao' | 'outro';
export type StatusAtividade = 'planejada' | 'em_progresso' | 'concluida' | 'cancelada';

export interface Atividade {
  id: string;
  codigoIdentificacao: string; // código auto-gerado no formato AT-YYYYMMDD-XXXXX
  titulo: string;
  descricao?: string;
  tipo: TipoAtividade;
  status: StatusAtividade;
  data: string; // dd-MM-aa
  dataInicio?: string; // data de início da execução
  dataFim?: string; // data de conclusão
  cultura?: string; // ex: 'Milho', 'Soja'
  insumos?: Array<{ itemId: string; quantidade: number }>; // referência a itens de estoque
  custo?: number; // custo estimado ou realizado
  responsavel?: string; // nome do responsável
  notas?: string;
  dataCriacao: string;
}

const CHAVE_ATIVIDADES = 'atividades';
const CHAVE_MOCK_INICIALIZADO = 'mock_atividades_inicializado';

// Mock data para demonstração
const MOCK_ATIVIDADES: Atividade[] = [
  {
    id: 'mock-001',
    codigoIdentificacao: 'AT-20250913-00001',
    titulo: 'Plantio de Milho',
    descricao: 'Plantio de híbrido precoce na área A',
    tipo: 'plantio',
    status: 'concluida',
    data: new Date(new Date().getFullYear(), new Date().getMonth() - 2, 15).toISOString().split('T')[0],
    cultura: 'Milho',
    custo: 1500,
    responsavel: 'João Silva',
    notas: 'Realizado com sucesso',
    dataCriacao: new Date(new Date().getFullYear(), new Date().getMonth() - 2, 15).toISOString().split('T')[0],
  },
  {
    id: 'mock-002',
    codigoIdentificacao: 'AT-20250912-00002',
    titulo: 'Irrigação - Lote 2',
    descricao: 'Irrigação noturna do lote 2 durante 4 horas',
    tipo: 'irrigacao',
    status: 'concluida',
    data: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 10).toISOString().split('T')[0],
    cultura: 'Milho',
    custo: 450,
    responsavel: 'Maria Costa',
    dataCriacao: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 10).toISOString().split('T')[0],
  },
  {
    id: 'mock-003',
    codigoIdentificacao: 'AT-20251105-00003',
    titulo: 'Adubação - Aplicação primeira dose',
    descricao: 'Primeira aplicação de NPK 20-20-20',
    tipo: 'adubacao',
    status: 'em_progresso',
    data: new Date(new Date().getFullYear(), new Date().getMonth(), 5).toISOString().split('T')[0],
    cultura: 'Milho',
    custo: 800,
    responsavel: 'João Silva',
    dataCriacao: new Date(new Date().getFullYear(), new Date().getMonth(), 5).toISOString().split('T')[0],
  },
  {
    id: 'mock-004',
    codigoIdentificacao: 'AT-20251115-00004',
    titulo: 'Controle de pragas - Lagarta do cartucho',
    descricao: 'Aplicação de inseticida para controle de lagarta do cartucho',
    tipo: 'praga',
    status: 'planejada',
    data: new Date(new Date().getFullYear(), new Date().getMonth(), 15).toISOString().split('T')[0],
    cultura: 'Milho',
    custo: 600,
    responsavel: 'Pedro Oliveira',
    dataCriacao: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
  },
  {
    id: 'mock-005',
    codigoIdentificacao: 'AT-20251220-00005',
    titulo: 'Colheita de Soja',
    descricao: 'Colheita mecanizada do lote de soja - Talhão 5',
    tipo: 'colheita',
    status: 'planejada',
    data: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 20).toISOString().split('T')[0],
    cultura: 'Soja',
    custo: 3200,
    responsavel: 'Carlos Silva',
    dataCriacao: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
  },
  {
    id: 'mock-006',
    codigoIdentificacao: 'AT-20251110-00006',
    titulo: 'Manutenção de máquinas',
    descricao: 'Revisão preventiva de tratores e colheitadeiras',
    tipo: 'manutencao',
    status: 'em_progresso',
    data: new Date(new Date().getFullYear(), new Date().getMonth(), 10).toISOString().split('T')[0],
    custo: 1200,
    responsavel: 'Técnico Máquinas',
    notas: 'Manutenção preventiva conforme cronograma',
    dataCriacao: new Date(new Date().getFullYear(), new Date().getMonth(), 10).toISOString().split('T')[0],
  },
  {
    id: 'mock-007',
    codigoIdentificacao: 'AT-20250801-00007',
    titulo: 'Preparação do solo - Aração',
    descricao: 'Aração da área para preparo de plantio',
    tipo: 'outro',
    status: 'concluida',
    data: new Date(new Date().getFullYear(), new Date().getMonth() - 3, 1).toISOString().split('T')[0],
    cultura: 'Milho',
    custo: 900,
    responsavel: 'João Silva',
    dataCriacao: new Date(new Date().getFullYear(), new Date().getMonth() - 3, 1).toISOString().split('T')[0],
  },
  {
    id: 'mock-008',
    codigoIdentificacao: 'AT-20250920-00008',
    titulo: 'Segunda adubação',
    descricao: 'Adubação de cobertura com ureia',
    tipo: 'adubacao',
    status: 'cancelada',
    data: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 20).toISOString().split('T')[0],
    cultura: 'Soja',
    custo: 400,
    responsavel: 'Maria Costa',
    notas: 'Cancelada por excesso de chuva',
    dataCriacao: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 20).toISOString().split('T')[0],
  },
];

class AtividadeService {
  private gerarId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }

  private gerarCodigoIdentificacao(): string {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');
    const numero = String(Math.floor(Math.random() * 100000)).padStart(5, '0');
    return `AT-${ano}${mes}${dia}-${numero}`;
  }

  private inicializarMockSeNecessario(): void {
    const jaInicializado = localStorage.getItem(CHAVE_MOCK_INICIALIZADO);
    if (!jaInicializado) {
      const atividadesExistentes = this.ler<Atividade>(CHAVE_ATIVIDADES);
      if (atividadesExistentes.length === 0) {
        this.salvar(CHAVE_ATIVIDADES, MOCK_ATIVIDADES);
        localStorage.setItem(CHAVE_MOCK_INICIALIZADO, 'true');
      }
    }
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

  // Listar todas as atividades
  async listarAtividades(): Promise<Atividade[]> {
    this.inicializarMockSeNecessario();
    return this.ler<Atividade>(CHAVE_ATIVIDADES).sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  }

  // Criar atividade
  async criarAtividade(dados: Omit<Atividade, 'id' | 'dataCriacao' | 'codigoIdentificacao'>): Promise<Atividade> {
    const nova: Atividade = {
      ...dados,
      id: this.gerarId(),
      codigoIdentificacao: this.gerarCodigoIdentificacao(),
      dataCriacao: new Date().toISOString().split('T')[0],
    };
    const lista = this.ler<Atividade>(CHAVE_ATIVIDADES);
    lista.push(nova);
    this.salvar(CHAVE_ATIVIDADES, lista);
    return nova;
  }

  // Obter atividade por ID
  async obterAtividade(id: string): Promise<Atividade | undefined> {
    const lista = this.ler<Atividade>(CHAVE_ATIVIDADES);
    return lista.find(a => a.id === id);
  }

  // Atualizar atividade
  async atualizarAtividade(id: string, dados: Partial<Atividade>): Promise<Atividade | undefined> {
    const lista = this.ler<Atividade>(CHAVE_ATIVIDADES);
    const idx = lista.findIndex(a => a.id === id);
    if (idx === -1) return undefined;
    lista[idx] = { ...lista[idx], ...dados };
    this.salvar(CHAVE_ATIVIDADES, lista);
    return lista[idx];
  }

  // Deletar atividade
  async deletarAtividade(id: string): Promise<void> {
    const lista = this.ler<Atividade>(CHAVE_ATIVIDADES).filter(a => a.id !== id);
    this.salvar(CHAVE_ATIVIDADES, lista);
  }

  // Buscar por código de identificação (exato) ou título (parcial com palavras)
  async buscar(termo: string): Promise<Atividade[]> {
    let lista = await this.listarAtividades();
    if (!termo.trim()) return lista;
    
    const termoLower = termo.toLowerCase().trim();
    
    return lista.filter(a => {
      // Se o termo começa com "AT-", buscar código exato (match completo ou parcial estruturado)
      if (termoLower.startsWith('at-')) {
        // Busca exata no código (números/letras após AT-)
        return a.codigoIdentificacao.toLowerCase() === termoLower ||
               a.codigoIdentificacao.toLowerCase().includes(termoLower);
      }
      
      // Caso contrário, buscar no título (parcial, contém as palavras)
      // Dividir termo em palavras e buscar por cada uma
      const palavras = termoLower.split(/\s+/);
      const tituloLower = a.titulo.toLowerCase();
      return palavras.every(palavra => tituloLower.includes(palavra));
    });
  }

  // Listar atividades com filtros
  async listarComFiltros(
    tipo?: TipoAtividade,
    status?: StatusAtividade,
    dataInicio?: string,
    dataFim?: string,
    cultura?: string
  ): Promise<Atividade[]> {
    let lista = await this.listarAtividades();

    if (tipo) lista = lista.filter(a => a.tipo === tipo);
    if (status) lista = lista.filter(a => a.status === status);
    if (cultura) lista = lista.filter(a => a.cultura?.toLowerCase().includes(cultura.toLowerCase()));

    if (dataInicio && dataFim) {
      const inicio = new Date(dataInicio);
      const fim = new Date(dataFim);
      lista = lista.filter(a => {
        const d = new Date(a.data);
        return d >= inicio && d <= fim;
      });
    }

    return lista;
  }

  // Agrupar atividades por status (para Kanban)
  async agruparPorStatus(): Promise<Record<StatusAtividade, Atividade[]>> {
    const lista = await this.listarAtividades();
    const agrupado: Record<StatusAtividade, Atividade[]> = {
      planejada: [],
      em_progresso: [],
      concluida: [],
      cancelada: [],
    };
    lista.forEach(a => {
      agrupado[a.status].push(a);
    });
    return agrupado;
  }

  // Resumo de atividades por status
  async resumo(): Promise<Record<StatusAtividade, number>> {
    const agrupado = await this.agruparPorStatus();
    return {
      planejada: agrupado.planejada.length,
      em_progresso: agrupado.em_progresso.length,
      concluida: agrupado.concluida.length,
      cancelada: agrupado.cancelada.length,
    };
  }
}

export default new AtividadeService();
