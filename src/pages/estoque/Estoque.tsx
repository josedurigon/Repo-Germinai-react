import React, { useEffect, useState } from 'react';
import BoxShadowPadrao from '../../components/box-shadow/BoxShadowPadrao';
import EstoqueService from '../../services/EstoqueService';
import FornecedorService from '../../services/FornecedorService';
import type { ItemEstoque, MovimentoEstoque, MovimentoTipo } from '../../services/EstoqueService';
import type { Fornecedor } from '../../services/FornecedorService';
import './Estoque.css';

const hojePadrao = new Date().toISOString().split('T')[0];

const Estoque = () => {
  // itens e formulário de criação
  const [itens, setItens] = useState<ItemEstoque[]>([]);
  const [novoItemNome, setNovoItemNome] = useState('');
  const [novoItemSku, setNovoItemSku] = useState('');
  const [novoItemChave, setNovoItemChave] = useState('');
  const [novoItemQuantidade, setNovoItemQuantidade] = useState<number>(0);

  // movimentos
  const [movimentos, setMovimentos] = useState<MovimentoEstoque[]>([]);
  const [movimentoTipo, setMovimentoTipo] = useState<MovimentoTipo>('entrada');
  const [movimentoItemId, setMovimentoItemId] = useState<string>('');
  const [movimentoQuantidade, setMovimentoQuantidade] = useState<number>(0);
  const [movimentoData, setMovimentoData] = useState<string>(hojePadrao);
  const [movimentoObs, setMovimentoObs] = useState('');

  // filtros de listagem
  const [filtroInicio, setFiltroInicio] = useState<string>(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]);
  const [filtroFim, setFiltroFim] = useState<string>(hojePadrao);
  const [filtroTipo, setFiltroTipo] = useState<'todos' | MovimentoTipo>('todos');

  // fornecedores
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [novoItemFornecedorId, setNovoItemFornecedorId] = useState<string>('');
  const [popupFornecedorAberto, setPopupFornecedorAberto] = useState(false);
  const [novoFornecedorNome, setNovoFornecedorNome] = useState('');
  const [novoFornecedorEndereco, setNovoFornecedorEndereco] = useState('');
  const [novoFornecedorCnpj, setNovoFornecedorCnpj] = useState('');

  const [mensagem, setMensagem] = useState('');
  const [mensagemCadastro, setMensagemCadastro] = useState('');
  const [abaAtiva, setAbaAtiva] = useState<'cadastrar' | 'lancamentos' | 'saida' | 'visualizar'>('cadastrar');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [erroCampos, setErroCampos] = useState<string[]>([]);

  useEffect(() => {
    carregarItens();
    carregarMovimentos();
    carregarFornecedores();
  }, []);

  // ajusta tipo do movimento conforme aba
  useEffect(() => {
    if (abaAtiva === 'lancamentos') setMovimentoTipo('entrada');
    if (abaAtiva === 'saida') setMovimentoTipo('saida');
    // limpar mensagens de cadastro ao mudar de aba
    if (abaAtiva !== 'cadastrar') {
      setMensagemCadastro('');
      setErroCampos([]);
    }
  }, [abaAtiva]);

  const carregarItens = async () => {
    const lista = await EstoqueService.listarItens();
    setItens(lista);
    if (lista.length > 0) setMovimentoItemId(lista[0].id);
  };

  const carregarFornecedores = async () => {
    const lista = await FornecedorService.listarFornecedores();
    setFornecedores(lista);
    if (lista.length > 0 && !novoItemFornecedorId) setNovoItemFornecedorId(lista[0].id);
  };

  const carregarMovimentos = async () => {
    const lista = await EstoqueService.listarMovimentos();
    setMovimentos(lista);
  };

  const criarItem = async (e: React.FormEvent) => {
    e.preventDefault();
  setIsSubmitting(true);
  setMensagem('');
  setMensagemCadastro('');
  setErroCampos([]);

    try {
      // validação de campos obrigatórios: chave, nome, quantidade (>0) e fornecedor
      const faltando: string[] = [];
      if (!novoItemChave.trim()) faltando.push('chave');
      if (!novoItemNome.trim()) faltando.push('nome');
      if (!novoItemQuantidade || novoItemQuantidade <= 0) faltando.push('quantidade');
      if (!novoItemFornecedorId) faltando.push('fornecedor');

      if (faltando.length > 0) {
        setErroCampos(faltando);
        const labels = faltando.map(f => {
          if (f === 'chave') return 'Chave de identificação';
          if (f === 'nome') return 'Nome';
          if (f === 'quantidade') return 'Quantidade';
          if (f === 'fornecedor') return 'Fornecedor';
          return f;
        });
        if (labels.length === 1) setMensagemCadastro(`${labels[0]} é obrigatório.`);
        else setMensagemCadastro(`${labels.join(', ')} são obrigatórios.`);
        return;
      }

      await EstoqueService.criarItem({
        nome: novoItemNome.trim(),
        sku: novoItemSku.trim() || undefined,
        quantidade: Number(novoItemQuantidade || 0),
        unidade: undefined,
        fornecedorId: novoItemFornecedorId,
        chaveIdentificacao: novoItemChave.trim(),
      });

  setMensagemCadastro('Item criado com sucesso!');
      setNovoItemNome('');
      setNovoItemSku('');
      setNovoItemChave('');
      setNovoItemQuantidade(0);
      // manter fornecedor selecionado para facilitar cadastros em série
      await carregarItens();
    } finally {
      setIsSubmitting(false);
    }
  };

  const lancarMovimento = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!movimentoItemId) { setMensagem('Selecione um item.'); return; }
    if (!movimentoQuantidade || movimentoQuantidade <= 0) { setMensagem('Quantidade deve ser > 0.'); return; }

    await EstoqueService.criarMovimento({ itemId: movimentoItemId, tipo: movimentoTipo, quantidade: Number(movimentoQuantidade), data: movimentoData, observacoes: movimentoObs });
    setMensagem('Movimento registrado.');
    setMovimentoQuantidade(0);
    setMovimentoObs('');
    await carregarItens();
    await carregarMovimentos();
  };

  const aplicarFiltro = async () => {
    const tipo = filtroTipo === 'todos' ? undefined : filtroTipo;
    const lista = await EstoqueService.listarMovimentosPorPeriodo(filtroInicio, filtroFim, tipo);
    setMovimentos(lista);
  };

  const formatarData = (d: string) => {
    try { return new Date(d).toLocaleDateString('pt-BR'); } catch { return d; }
  };

  const formatarNumero = (n: number) => new Intl.NumberFormat('pt-BR').format(n);

  return (
    <div className="pagina-container-pai">
      <main className="conteudo-estoque">
        <h1>Estoque</h1>

        <BoxShadowPadrao>
          <div className="abas-estoque">
            <button className={`aba-botao ${abaAtiva === 'cadastrar' ? 'ativa' : ''}`} onClick={() => setAbaAtiva('cadastrar')}>Cadastrar Item</button>
            <button className={`aba-botao ${abaAtiva === 'lancamentos' ? 'ativa' : ''}`} onClick={() => setAbaAtiva('lancamentos')}>Lançamentos (Entradas)</button>
            <button className={`aba-botao ${abaAtiva === 'saida' ? 'ativa' : ''}`} onClick={() => setAbaAtiva('saida')}>Saídas</button>
            <button className={`aba-botao ${abaAtiva === 'visualizar' ? 'ativa' : ''}`} onClick={() => setAbaAtiva('visualizar')}>Visualizar Movimentos</button>
          </div>

          {/* Aba: Cadastrar Item */}
          {abaAtiva === 'cadastrar' && (
            <section className="estoque-grid">
              <div className="card">
                <h2>Cadastrar Item</h2>
                <form onSubmit={criarItem} className="form-estoque">
                  <label>
                    <span>Nome</span>
                    <input className={erroCampos.includes('nome') ? 'campo-erro' : ''} value={novoItemNome} onChange={e => setNovoItemNome(e.target.value)} placeholder="Ex: Arado" />
                    {erroCampos.includes('nome') && <small className="campo-erro-msg">Nome é obrigatório.</small>}
                  </label>
                  <label>
                    <span>SKU</span>
                    <input value={novoItemSku} onChange={e => setNovoItemSku(e.target.value)} placeholder="Código (opcional)" />
                  </label>
                  <label>
                    <span>Chave de identificação</span>
                    <input className={erroCampos.includes('chave') ? 'campo-erro' : ''} value={novoItemChave} onChange={e => setNovoItemChave(e.target.value)} placeholder="Ex: ARD-001" />
                    {erroCampos.includes('chave') && <small className="campo-erro-msg">Chave de identificação é obrigatória.</small>}
                  </label>
                  <label>
                    <span>Quantidade inicial</span>
                    <input className={erroCampos.includes('quantidade') ? 'campo-erro' : ''} type="number" value={novoItemQuantidade} onChange={e => setNovoItemQuantidade(Number(e.target.value))} min={0} />
                    {erroCampos.includes('quantidade') && <small className="campo-erro-msg">Quantidade é obrigatória e maior que zero.</small>}
                  </label>
                  <label>
                    <span>Fornecedor</span>
                    <select className={erroCampos.includes('fornecedor') ? 'campo-erro' : ''} value={novoItemFornecedorId} onChange={e => setNovoItemFornecedorId(e.target.value)}>
                      <option value="">— Nenhum —</option>
                      {fornecedores.map(f => (
                        <option key={f.id} value={f.id}>{f.nome}</option>
                      ))}
                    </select>
                    {erroCampos.includes('fornecedor') && <small className="campo-erro-msg">Fornecedor é obrigatório.</small>}
                    <div className="novo-fornecedor-actions">
                      <button type="button" className="btn-link" onClick={() => setPopupFornecedorAberto(true)}>Novo Fornecedor</button>
                    </div>
                  </label>
                  <button type="submit" className={`btn-acao ${isSubmitting ? 'ativa' : ''}`} disabled={isSubmitting}>{isSubmitting ? 'Salvando...' : 'Criar Item'}</button>
                </form>
                {mensagemCadastro && <div className="mensagem-estoque">{mensagemCadastro}</div>}
              </div>

              <div className="card card-itens">
                <h2>Itens em Estoque</h2>
                <div className="lista-itens">
                  {itens.length === 0 ? <p>Nenhum item cadastrado.</p> : (
                    <table className="tabela-itens">
                      <thead>
                          <tr><th>Nome</th><th>Chave</th><th>SKU</th><th>Quantidade</th></tr>
                        </thead>
                        <tbody>
                          {itens.map(i => (
                            <tr key={i.id}>
                              <td>{i.nome}</td>
                              <td>{i.chaveIdentificacao || '-'}</td>
                              <td>{i.sku || '-'}</td>
                              <td>{formatarNumero(i.quantidade)}</td>
                            </tr>
                          ))}
                        </tbody>
                    </table>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Aba: Lançamentos (Entradas) */}
          {abaAtiva === 'lancamentos' && (
            <section className="estoque-grid">
              <div className="card">
                <h2>Lançar Entrada</h2>
                <form onSubmit={lancarMovimento} className="form-estoque">
                  <input type="hidden" value={movimentoTipo} />
                  <label>
                    <span>Item</span>
                    <select value={movimentoItemId} onChange={e => setMovimentoItemId(e.target.value)}>
                      {itens.map(i => (
                        <option key={i.id} value={i.id}>{i.nome} ({formatarNumero(i.quantidade)})</option>
                      ))}
                    </select>
                  </label>

                  <label>
                    <span>Quantidade</span>
                    <input type="number" min={0} value={movimentoQuantidade} onChange={e => setMovimentoQuantidade(Number(e.target.value))} />
                  </label>

                  <label>
                    <span>Data</span>
                    <input type="date" value={movimentoData} onChange={e => setMovimentoData(e.target.value)} />
                  </label>

                  <label>
                    <span>Observações</span>
                    <input value={movimentoObs} onChange={e => setMovimentoObs(e.target.value)} placeholder="Opcional" />
                  </label>

                  <button type="submit" className="btn-acao">Registrar Entrada</button>
                </form>
              </div>
            </section>
          )}

          {/* Aba: Saídas */}
          {abaAtiva === 'saida' && (
            <section className="estoque-grid">
              <div className="card">
                <h2>Lançar Saída</h2>
                <form onSubmit={lancarMovimento} className="form-estoque">
                  <input type="hidden" value={movimentoTipo} />
                  <label>
                    <span>Item</span>
                    <select value={movimentoItemId} onChange={e => setMovimentoItemId(e.target.value)}>
                      {itens.map(i => (
                        <option key={i.id} value={i.id}>{i.nome} ({formatarNumero(i.quantidade)})</option>
                      ))}
                    </select>
                  </label>

                  <label>
                    <span>Quantidade</span>
                    <input type="number" min={0} value={movimentoQuantidade} onChange={e => setMovimentoQuantidade(Number(e.target.value))} />
                  </label>

                  <label>
                    <span>Data</span>
                    <input type="date" value={movimentoData} onChange={e => setMovimentoData(e.target.value)} />
                  </label>

                  <label>
                    <span>Observações</span>
                    <input value={movimentoObs} onChange={e => setMovimentoObs(e.target.value)} placeholder="Opcional" />
                  </label>

                  <button type="submit" className="btn-acao">Registrar Saída</button>
                </form>
              </div>
            </section>
          )}

          {/* Aba: Visualizar Movimentos */}
          {abaAtiva === 'visualizar' && (
            <section className="movimentos">
              <h2>Movimentos</h2>
              <div className="filtros-movimentos">
                <label>
                  <span>Data Início</span>
                  <input type="date" value={filtroInicio} onChange={e => setFiltroInicio(e.target.value)} />
                </label>
                <label>
                  <span>Data Fim</span>
                  <input type="date" value={filtroFim} onChange={e => setFiltroFim(e.target.value)} />
                </label>
                <label>
                  <span>Tipo</span>
                  <select value={filtroTipo} onChange={e => setFiltroTipo(e.target.value as any)}>
                    <option value="todos">Todos</option>
                    <option value="entrada">Entrada</option>
                    <option value="saida">Saída</option>
                  </select>
                </label>
                <button className="btn-acao" onClick={aplicarFiltro}>Filtrar</button>
              </div>

              <div className="tabela-movimentos">
                {movimentos.length === 0 ? <p>Nenhum movimento.</p> : (
                  <table>
                    <thead>
                      <tr><th>Data</th><th>Item</th><th>Tipo</th><th>Quantidade</th><th>Obs</th></tr>
                    </thead>
                    <tbody>
                      {movimentos.map(m => {
                        const item = itens.find(i => i.id === m.itemId);
                        return (
                          <tr key={m.id}>
                            <td>{formatarData(m.data)}</td>
                            <td>{item ? item.nome : '—'}</td>
                            <td className={m.tipo === 'entrada' ? 'tipo-entrada' : 'tipo-saida'}>{m.tipo}</td>
                            <td>{formatarNumero(m.quantidade)}</td>
                            <td>{m.observacoes || '-'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </section>
          )}

          {mensagem && <div className="mensagem-estoque">{mensagem}</div>}

          {/* Popup: Novo Fornecedor */}
          {popupFornecedorAberto && (
            <div className="modal-overlay">
              <div className="modal">
                <div className="modal-header">
                  <h3>Novo Fornecedor</h3>
                  <button className="modal-close" onClick={() => setPopupFornecedorAberto(false)}>×</button>
                </div>
                <div className="modal-body">
                  <form onSubmit={async (ev) => {
                    ev.preventDefault();
                    if (!novoFornecedorNome.trim()) { setMensagem('Nome do fornecedor é obrigatório.'); return; }
                    const f = await FornecedorService.criarFornecedor({ nome: novoFornecedorNome.trim(), endereco: novoFornecedorEndereco.trim() || undefined, cnpj: novoFornecedorCnpj.trim() || undefined });
                    setMensagem('Fornecedor criado.');
                    setNovoFornecedorNome(''); setNovoFornecedorEndereco(''); setNovoFornecedorCnpj('');
                    setPopupFornecedorAberto(false);
                    await carregarFornecedores();
                    setNovoItemFornecedorId(f.id);
                  }} className="modal-form">
                    <label>
                      <span>Nome</span>
                      <input value={novoFornecedorNome} onChange={e => setNovoFornecedorNome(e.target.value)} />
                    </label>
                    <label>
                      <span>Endereço</span>
                      <input value={novoFornecedorEndereco} onChange={e => setNovoFornecedorEndereco(e.target.value)} />
                    </label>
                    <label>
                      <span>CNPJ</span>
                      <input value={novoFornecedorCnpj} onChange={e => setNovoFornecedorCnpj(e.target.value)} />
                    </label>
                    <div className="modal-actions">
                      <button type="submit" className="btn-acao">Salvar Fornecedor</button>
                      <button type="button" className="btn-sec" onClick={() => setPopupFornecedorAberto(false)}>Cancelar</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </BoxShadowPadrao>
      </main>
    </div>
  );
};

export default Estoque;
