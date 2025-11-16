export type TipoConta = 'pagar' | 'receber';
export type StatusConta = 'pendente' | 'pago' | 'cancelado' | 'atrasado';

export interface Conta {
  id: string;
  tipo: TipoConta;
  descricao: string;
  valor: number;
  dataVencimento: string;
  dataPagamento?: string;
  status: StatusConta;
  categoria: string;
  observacoes?: string;
  dataCriacao: string;
}

const CHAVE_CONTAS = 'contas_financeiras';

class ContasService {
  private gerarId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private obterContas(): Conta[] {
    try {
      const dados = localStorage.getItem(CHAVE_CONTAS);
      return dados ? JSON.parse(dados) : [];
    } catch (erro) {
      console.error('Erro ao obter contas:', erro);
      return [];
    }
  }

  private salvarContas(contas: Conta[]): void {
    try {
      localStorage.setItem(CHAVE_CONTAS, JSON.stringify(contas));
    } catch (erro) {
      console.error('Erro ao salvar contas:', erro);
    }
  }

  /**
   * Cria uma nova conta a pagar ou receber
   */
  async criarConta(dados: Omit<Conta, 'id' | 'dataCriacao'>): Promise<Conta> {
    // TODO: Integrar com API: POST /contas
    const novaConta: Conta = {
      ...dados,
      id: this.gerarId(),
      dataCriacao: new Date().toISOString().split('T')[0],
    };

    const contas = this.obterContas();
    contas.push(novaConta);
    this.salvarContas(contas);

    return novaConta;
  }

  /**
   * Lista todas as contas
   */
  async listarContas(): Promise<Conta[]> {
    // TODO: Integrar com API: GET /contas
    return this.obterContas();
  }

  /**
   * Obtém uma conta por ID
   */
  async obterContaPorId(id: string): Promise<Conta | undefined> {
    // TODO: Integrar com API: GET /contas/:id
    const contas = this.obterContas();
    return contas.find(c => c.id === id);
  }

  /**
   * Atualiza uma conta existente
   */
  async atualizarConta(id: string, dados: Partial<Conta>): Promise<Conta | undefined> {
    // TODO: Integrar com API: PUT /contas/:id
    const contas = this.obterContas();
    const indice = contas.findIndex(c => c.id === id);

    if (indice === -1) {
      throw new Error('Conta não encontrada');
    }

    contas[indice] = { ...contas[indice], ...dados };
    this.salvarContas(contas);

    return contas[indice];
  }

  /**
   * Deleta uma conta
   */
  async deletarConta(id: string): Promise<void> {
    // TODO: Integrar com API: DELETE /contas/:id
    const contas = this.obterContas();
    const contasFiltradas = contas.filter(c => c.id !== id);
    this.salvarContas(contasFiltradas);
  }

  /**
   * Lista contas a pagar
   */
  async listarContasAPagar(): Promise<Conta[]> {
    const contas = await this.listarContas();
    return contas.filter(c => c.tipo === 'pagar');
  }

  /**
   * Lista contas a receber
   */
  async listarContasAReceber(): Promise<Conta[]> {
    const contas = await this.listarContas();
    return contas.filter(c => c.tipo === 'receber');
  }

  /**
   * Filtra contas por período de vencimento
   */
  async listarContasPorPeriodo(
    dataInicio: string,
    dataFim: string,
    tipo?: TipoConta
  ): Promise<Conta[]> {
    // TODO: Integrar com API: GET /contas?dataInicio=...&dataFim=...
    const contas = await this.listarContas();

    return contas.filter(c => {
      const dataVenc = new Date(c.dataVencimento);
      const inicio = new Date(dataInicio);
      const fim = new Date(dataFim);

      const dentroPeríodo = dataVenc >= inicio && dataVenc <= fim;
      const tipoCorreto = !tipo || c.tipo === tipo;

      return dentroPeríodo && tipoCorreto;
    });
  }

  /**
   * Obtém contas atrasadas
   */
  async obterContasAtrasadas(): Promise<Conta[]> {
    const hoje = new Date().toISOString().split('T')[0];
    const contas = await this.listarContas();

    return contas.filter(c => 
      c.dataVencimento < hoje && 
      (c.status === 'pendente' || c.status === 'atrasado')
    );
  }

  /**
   * Marca uma conta como paga
   */
  async marcarComoPaga(id: string, dataPagamento: string): Promise<Conta | undefined> {
    // TODO: Integrar com API
    return this.atualizarConta(id, {
      status: 'pago',
      dataPagamento,
    });
  }

  /**
   * Marca uma conta como cancelada
   */
  async marcarComoCancelada(id: string): Promise<Conta | undefined> {
    // TODO: Integrar com API
    return this.atualizarConta(id, {
      status: 'cancelado',
    });
  }

  /**
   * Calcula resumo financeiro
   */
  async obterResumoFinanceiro(): Promise<{
    totalAPagar: number;
    totalAReceber: number;
    atrasado: number;
    vencidosProximos7Dias: number;
  }> {
    const contas = await this.listarContas();
    const hoje = new Date();
    const proximos7Dias = new Date(hoje.getTime() + 7 * 24 * 60 * 60 * 1000);

    let totalAPagar = 0;
    let totalAReceber = 0;
    let atrasado = 0;
    let vencidosProximos7Dias = 0;

    contas.forEach(c => {
      if (c.status === 'pago' || c.status === 'cancelado') return;

      const dataVenc = new Date(c.dataVencimento);
      const valor = c.valor;

      if (c.tipo === 'pagar') {
        totalAPagar += valor;
      } else {
        totalAReceber += valor;
      }

      if (dataVenc < hoje) {
        atrasado += valor;
      } else if (dataVenc <= proximos7Dias) {
        vencidosProximos7Dias += valor;
      }
    });

    return {
      totalAPagar,
      totalAReceber,
      atrasado,
      vencidosProximos7Dias,
    };
  }
}

export default new ContasService();
