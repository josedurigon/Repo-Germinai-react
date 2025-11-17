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
  const [novoItemQuantidadeMinima, setNovoItemQuantidadeMinima] = useState<number | ''>('');
  const [novoItemQuantidadeMaxima, setNovoItemQuantidadeMaxima] = useState<number | ''>('');

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
  
  // filtro de pesquisa de itens
  const [termoPesquisaItem, setTermoPesquisaItem] = useState('');
  const [itensFiltrados, setItensFiltrados] = useState<ItemEstoque[]>([]);

  // fornecedores
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [novoItemFornecedorId, setNovoItemFornecedorId] = useState<string>('');
  const [popupFornecedorAberto, setPopupFornecedorAberto] = useState(false);
  const [novoFornecedorNome, setNovoFornecedorNome] = useState('');
  const [novoFornecedorEndereco, setNovoFornecedorEndereco] = useState('');
  const [novoFornecedorCnpj, setNovoFornecedorCnpj] = useState('');

  // categorias
  const [categorias, setCategorias] = useState<string[]>(['Insumos Agr\u00edcolas']);
  const [novoItemCategoria, setNovoItemCategoria] = useState<string>('Insumos Agr\u00edcolas');
  const [popupCategoriaAberto, setPopupCategoriaAberto] = useState(false);
  const [novaCategoriaNome, setNovaCategoriaNome] = useState('');

  // popup de edição
  const [popupEdicaoAberto, setPopupEdicaoAberto] = useState(false);
  const [itemEditando, setItemEditando] = useState<ItemEstoque | null>(null);
  const [edicaoNome, setEdicaoNome] = useState('');
  const [edicaoSku, setEdicaoSku] = useState('');
  const [edicaoChave, setEdicaoChave] = useState('');
  const [edicaoQuantidadeMinima, setEdicaoQuantidadeMinima] = useState<number | ''>('');
  const [edicaoQuantidadeMaxima, setEdicaoQuantidadeMaxima] = useState<number | ''>('');
  const [edicaoFornecedorId, setEdicaoFornecedorId] = useState('');
  const [edicaoCategoria, setEdicaoCategoria] = useState('');

  const [mensagem, setMensagem] = useState('');
  const [mensagemCadastro, setMensagemCadastro] = useState('');
  const [abaAtiva, setAbaAtiva] = useState<'cadastrar' | 'gerenciar' | 'lancamentos' | 'saida' | 'visualizar'>('cadastrar');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [erroCampos, setErroCampos] = useState<string[]>([]);

  useEffect(() => {
    carregarItens();
    carregarMovimentos();
    carregarFornecedores();
    carregarCategorias();
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
    setItensFiltrados(lista);
    // Seleciona o primeiro item ativo para movimentação
    const itemAtivo = lista.find(i => i.ativo !== false);
    if (itemAtivo) setMovimentoItemId(itemAtivo.id);
  };

  const carregarFornecedores = async () => {
    const lista = await FornecedorService.listarFornecedores();
    setFornecedores(lista);
    if (lista.length > 0 && !novoItemFornecedorId) setNovoItemFornecedorId(lista[0].id);
  };

  const carregarCategorias = () => {
    try {
      const categoriasLocalStorage = localStorage.getItem('estoque_categorias');
      if (categoriasLocalStorage) {
        setCategorias(JSON.parse(categoriasLocalStorage));
      } else {
        // Se não existir, salvar categoria padrão
        localStorage.setItem('estoque_categorias', JSON.stringify(['Insumos Agr\u00edcolas']));
      }
    } catch (e) {
      console.error('Erro ao carregar categorias', e);
    }
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
      // validação de campos obrigatórios: chave, nome e fornecedor
      const faltando: string[] = [];
      if (!novoItemChave.trim()) faltando.push('chave');
      if (!novoItemNome.trim()) faltando.push('nome');
      if (!novoItemFornecedorId) faltando.push('fornecedor');

      if (faltando.length > 0) {
        setErroCampos(faltando);
        const labels = faltando.map(f => {
          if (f === 'chave') return 'Chave de identificação';
          if (f === 'nome') return 'Nome';
          if (f === 'fornecedor') return 'Fornecedor';
          return f;
        });
        if (labels.length === 1) setMensagemCadastro(`${labels[0]} é obrigatório.`);
        else setMensagemCadastro(`${labels.join(', ')} são obrigatórios.`);
        return;
      }

      // Modo criação - quantidade sempre inicia em 0
      await EstoqueService.criarItem({
        nome: novoItemNome.trim(),
        sku: novoItemSku.trim() || undefined,
        quantidade: 0,
        quantidadeMinima: novoItemQuantidadeMinima === '' ? undefined : Number(novoItemQuantidadeMinima),
        quantidadeMaxima: novoItemQuantidadeMaxima === '' ? undefined : Number(novoItemQuantidadeMaxima),
        unidade: undefined,
        fornecedorId: novoItemFornecedorId,
        categoria: novoItemCategoria,
        chaveIdentificacao: novoItemChave.trim(),
      });
      
      setMensagemCadastro('Item criado com sucesso!');
      setNovoItemNome('');
      setNovoItemSku('');
      setNovoItemChave('');
      setNovoItemQuantidadeMinima('');
      setNovoItemQuantidadeMaxima('');
      // manter fornecedor selecionado para facilitar cadastros em série
      await carregarItens();
    } catch (error) {
      console.error('Erro ao criar item:', error);
      setMensagemCadastro('Erro ao criar item.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const lancarMovimento = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!movimentoItemId) { setMensagem('Selecione um item.'); return; }
    if (!movimentoQuantidade || movimentoQuantidade <= 0) { setMensagem('Quantidade deve ser > 0.'); return; }

    // Validar se o item selecionado está ativo
    const itemSelecionado = itens.find(i => i.id === movimentoItemId);
    if (!itemSelecionado) { setMensagem('Item não encontrado.'); return; }
    if (itemSelecionado.ativo === false) { setMensagem('Não é possível movimentar um item inativo.'); return; }

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

  const pesquisarItem = () => {
    if (!termoPesquisaItem.trim()) {
      setItensFiltrados(itens);
      return;
    }
    const termo = termoPesquisaItem.toLowerCase().trim();
    const filtrados = itens.filter(item => 
      item.nome.toLowerCase().includes(termo) ||
      item.chaveIdentificacao?.toLowerCase().includes(termo) ||
      item.sku?.toLowerCase().includes(termo) ||
      item.categoria?.toLowerCase().includes(termo)
    );
    setItensFiltrados(filtrados);
  };

  const limparPesquisa = () => {
    setTermoPesquisaItem('');
    setItensFiltrados(itens);
  };

  const editarItem = (item: ItemEstoque) => {
    setItemEditando(item);
    setEdicaoNome(item.nome);
    setEdicaoSku(item.sku || '');
    setEdicaoChave(item.chaveIdentificacao || '');
    setEdicaoQuantidadeMinima(item.quantidadeMinima ?? '');
    setEdicaoQuantidadeMaxima(item.quantidadeMaxima ?? '');
    setEdicaoFornecedorId(item.fornecedorId || '');
    setEdicaoCategoria(item.categoria || 'Insumos Agr\u00edcolas');
    setPopupEdicaoAberto(true);
  };

  const salvarEdicao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemEditando) return;
    
    try {
      await EstoqueService.atualizarItem(itemEditando.id, {
        nome: edicaoNome.trim(),
        sku: edicaoSku.trim() || undefined,
        quantidadeMinima: edicaoQuantidadeMinima === '' ? undefined : Number(edicaoQuantidadeMinima),
        quantidadeMaxima: edicaoQuantidadeMaxima === '' ? undefined : Number(edicaoQuantidadeMaxima),
        fornecedorId: edicaoFornecedorId,
        categoria: edicaoCategoria,
        chaveIdentificacao: edicaoChave.trim(),
      });
      setMensagem('Item atualizado com sucesso!');
      setPopupEdicaoAberto(false);
      await carregarItens();
      setTimeout(() => setMensagem(''), 3000);
    } catch (error) {
      setMensagem('Erro ao atualizar item.');
    }
  };

  const toggleAtivoItem = async (id: string, ativo: boolean) => {
    const acao = ativo ? 'inativar' : 'ativar';
    if (!confirm(`Tem certeza que deseja ${acao} este item?`)) return;
    try {
      await EstoqueService.toggleAtivoItem(id);
      setMensagem(`Item ${ativo ? 'inativado' : 'ativado'} com sucesso!`);
      await carregarItens();
      setTimeout(() => setMensagem(''), 3000);
    } catch (error) {
      setMensagem(`Erro ao ${acao} item.`);
    }
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
            <button className={`aba-botao ${abaAtiva === 'gerenciar' ? 'ativa' : ''}`} onClick={() => setAbaAtiva('gerenciar')}>Gerenciar Itens</button>
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
                    <span>Quantidade mínima</span>
                    <input type="number" value={novoItemQuantidadeMinima} onChange={e => setNovoItemQuantidadeMinima(e.target.value === '' ? '' : Number(e.target.value))} min={0} placeholder="Opcional" />
                  </label>
                  <label>
                    <span>Quantidade máxima</span>
                    <input type="number" value={novoItemQuantidadeMaxima} onChange={e => setNovoItemQuantidadeMaxima(e.target.value === '' ? '' : Number(e.target.value))} min={0} placeholder="Opcional" />
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
                  <label>
                    <span>Categoria</span>
                    <select value={novoItemCategoria} onChange={e => setNovoItemCategoria(e.target.value)}>
                      {categorias.map((cat, idx) => (
                        <option key={idx} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <div className="novo-fornecedor-actions">
                      <button type="button" className="btn-link" onClick={() => setPopupCategoriaAberto(true)}>Nova Categoria</button>
                    </div>
                  </label>
                  <button 
                    type="submit" 
                    className={`btn-acao ${isSubmitting ? 'ativa' : ''}`} 
                    disabled={isSubmitting}
                    style={{ 
                      backgroundColor: '#2196f3', 
                      color: '#fff',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '4px',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      fontWeight: '500',
                      fontSize: '14px'
                    }}
                  >
                    {isSubmitting ? 'Salvando...' : 'Salvar Item'}
                  </button>
                </form>
                {mensagemCadastro && <div className="mensagem-estoque">{mensagemCadastro}</div>}
              </div>

              <div className="card card-itens">
                <h2>Itens Recém Cadastrados</h2>
                <div className="lista-itens">
                  {itens.length === 0 ? <p>Nenhum item cadastrado.</p> : (
                    <table className="tabela-itens">
                      <thead>
                          <tr><th>Nome</th><th>Chave</th><th>SKU</th><th>Quantidade</th><th>Data</th></tr>
                        </thead>
                        <tbody>
                          {itens
                            .sort((a, b) => new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime())
                            .slice(0, 10)
                            .map(i => (
                              <tr key={i.id}>
                                <td>{i.nome}</td>
                                <td>{i.chaveIdentificacao || '-'}</td>
                                <td>{i.sku || '-'}</td>
                                <td>{formatarNumero(i.quantidade)}</td>
                                <td>{formatarData(i.dataCriacao)}</td>
                              </tr>
                            ))}
                        </tbody>
                    </table>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Aba: Gerenciar Itens */}
          {abaAtiva === 'gerenciar' && (
            <section className="estoque-grid">
              <div className="card" style={{ gridColumn: '1 / -1' }}>
                <h2>Todos os Itens</h2>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px',
                  marginBottom: '20px' 
                }}>
                  <input 
                    type="text" 
                    value={termoPesquisaItem} 
                    onChange={e => setTermoPesquisaItem(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && pesquisarItem()}
                    placeholder="Buscar por nome, chave, SKU ou categoria"
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                  <button 
                    className="btn-acao" 
                    onClick={pesquisarItem}
                    style={{
                      padding: '8px 20px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    Pesquisar
                  </button>
                  {termoPesquisaItem && (
                    <button 
                      className="btn-sec" 
                      onClick={limparPesquisa}
                      style={{
                        padding: '8px 20px',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                    >
                      Limpar
                    </button>
                  )}
                </div>
                <div className="lista-itens">
                  {itensFiltrados.length === 0 ? (
                    <p>{termoPesquisaItem ? 'Nenhum item encontrado.' : 'Nenhum item cadastrado.'}</p>
                  ) : (
                    <table className="tabela-itens">
                      <thead>
                        <tr>
                          <th>Nome</th>
                          <th>Chave</th>
                          <th>SKU</th>
                          <th>Categoria</th>
                          <th>Quantidade em estoque</th>
                          <th>Qtd. Mín.</th>
                          <th>Qtd. Máx.</th>
                          <th>Fornecedor</th>
                          <th>Data de Cadastro</th>
                          <th>Status</th>
                          <th>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {itensFiltrados
                          .sort((a, b) => a.nome.localeCompare(b.nome))
                          .map(i => {
                            const fornecedor = fornecedores.find(f => f.id === i.fornecedorId);
                            return (
                              <tr key={i.id}>
                                <td>{i.nome}</td>
                                <td>{i.chaveIdentificacao || '-'}</td>
                                <td>{i.sku || '-'}</td>
                                <td>{i.categoria || '-'}</td>
                                <td>{formatarNumero(i.quantidade)}</td>
                                <td>{i.quantidadeMinima ? formatarNumero(i.quantidadeMinima) : '-'}</td>
                                <td>{i.quantidadeMaxima ? formatarNumero(i.quantidadeMaxima) : '-'}</td>
                                <td>{fornecedor?.nome || '-'}</td>
                                <td>{formatarData(i.dataCriacao)}</td>
                                <td>
                                  <span style={{
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                    fontWeight: '500',
                                    backgroundColor: i.ativo !== false ? '#d4edda' : '#f8d7da',
                                    color: i.ativo !== false ? '#155724' : '#721c24',
                                    display: 'inline-block'
                                  }}>
                                    {i.ativo !== false ? 'Ativo' : 'Inativo'}
                                  </span>
                                </td>
                                <td>
                                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                    <button 
                                      onClick={() => editarItem(i)} 
                                      style={{ 
                                        backgroundColor: '#ff9800', 
                                        color: '#fff', 
                                        border: 'none', 
                                        padding: '6px 12px', 
                                        borderRadius: '4px', 
                                        cursor: 'pointer',
                                        minWidth: '70px',
                                        fontWeight: '500'
                                      }}
                                    >
                                      Editar
                                    </button>
                                    <button 
                                      onClick={() => toggleAtivoItem(i.id, i.ativo !== false)} 
                                      style={{ 
                                        backgroundColor: i.ativo !== false ? '#d32f2f' : '#28a745', 
                                        color: '#fff', 
                                        border: 'none', 
                                        padding: '6px 12px', 
                                        borderRadius: '4px', 
                                        cursor: 'pointer',
                                        minWidth: '70px',
                                        fontWeight: '500'
                                      }}
                                    >
                                      {i.ativo !== false ? 'Inativar' : 'Ativar'}
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
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
                      {itens.filter(i => i.ativo !== false).map(i => (
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
                      {itens.filter(i => i.ativo !== false).map(i => (
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
              <div style={{ 
                display: 'flex', 
                alignItems: 'flex-end', 
                gap: '10px',
                marginBottom: '20px',
                flexWrap: 'wrap'
              }}>
                <label style={{ display: 'flex', flexDirection: 'column', minWidth: '150px' }}>
                  <span style={{ marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>Data Início</span>
                  <input 
                    type="date" 
                    value={filtroInicio} 
                    onChange={e => setFiltroInicio(e.target.value)}
                    style={{
                      padding: '8px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', minWidth: '150px' }}>
                  <span style={{ marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>Data Fim</span>
                  <input 
                    type="date" 
                    value={filtroFim} 
                    onChange={e => setFiltroFim(e.target.value)}
                    style={{
                      padding: '8px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', minWidth: '150px' }}>
                  <span style={{ marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>Tipo</span>
                  <select 
                    value={filtroTipo} 
                    onChange={e => setFiltroTipo(e.target.value as any)}
                    style={{
                      padding: '8px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="todos">Todos</option>
                    <option value="entrada">Entrada</option>
                    <option value="saida">Saída</option>
                  </select>
                </label>
                <button 
                  className="btn-acao" 
                  onClick={aplicarFiltro}
                  style={{
                    padding: '8px 20px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <span>🔍</span> Pesquisar
                </button>
                <button 
                  style={{
                    padding: '8px 20px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                  onClick={() => {
                    setFiltroInicio('');
                    setFiltroFim('');
                    setFiltroTipo('todos');
                  }}
                >
                  <span>✖</span> Limpar
                </button>
              </div>

              <div className="tabela-movimentos">
                {movimentos.length === 0 ? <p>Nenhum movimento.</p> : (
                  <table>
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'center' }}>Data</th>
                        <th style={{ textAlign: 'left' }}>Item</th>
                        <th style={{ textAlign: 'center' }}>Tipo</th>
                        <th style={{ textAlign: 'right' }}>Quantidade</th>
                        <th style={{ textAlign: 'right' }}>Saldo após movimentação</th>
                        <th style={{ textAlign: 'left' }}>Obs</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        let saldoAcumulado: { [itemId: string]: number } = {};
                        
                        // Inicializa saldos com zero
                        itens.forEach(i => {
                          saldoAcumulado[i.id] = 0;
                        });
                        
                        return movimentos.map(m => {
                          const item = itens.find(i => i.id === m.itemId);
                          
                          // Calcula saldo após esta movimentação
                          if (m.tipo === 'entrada') {
                            saldoAcumulado[m.itemId] = (saldoAcumulado[m.itemId] || 0) + m.quantidade;
                          } else {
                            saldoAcumulado[m.itemId] = (saldoAcumulado[m.itemId] || 0) - m.quantidade;
                          }
                          
                          const saldoAtual = saldoAcumulado[m.itemId];
                          
                          return (
                            <tr key={m.id}>
                              <td style={{ textAlign: 'center' }}>{formatarData(m.data)}</td>
                              <td style={{ textAlign: 'left' }}>{item ? item.nome : '—'}</td>
                              <td style={{ textAlign: 'center' }} className={m.tipo === 'entrada' ? 'tipo-entrada' : 'tipo-saida'}>{m.tipo}</td>
                              <td style={{ textAlign: 'right' }}>{formatarNumero(m.quantidade)}</td>
                              <td style={{ textAlign: 'right' }}>{formatarNumero(saldoAtual)}</td>
                              <td style={{ textAlign: 'left' }}>{m.observacoes || '-'}</td>
                            </tr>
                          );
                        });
                      })()}
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

          {/* Popup: Nova Categoria */}
          {popupCategoriaAberto && (
            <div className="modal-overlay">
              <div className="modal">
                <div className="modal-header">
                  <h3>Nova Categoria</h3>
                  <button className="modal-close" onClick={() => setPopupCategoriaAberto(false)}>×</button>
                </div>
                <div className="modal-body">
                  <form onSubmit={(ev) => {
                    ev.preventDefault();
                    if (!novaCategoriaNome.trim()) { 
                      setMensagem('Nome da categoria é obrigatório.'); 
                      return; 
                    }
                    const categoriasAtualizadas = [...categorias, novaCategoriaNome.trim()];
                    setCategorias(categoriasAtualizadas);
                    localStorage.setItem('estoque_categorias', JSON.stringify(categoriasAtualizadas));
                    setNovoItemCategoria(novaCategoriaNome.trim());
                    setMensagem('Categoria criada com sucesso!');
                    setNovaCategoriaNome('');
                    setPopupCategoriaAberto(false);
                  }} className="modal-form">
                    <label>
                      <span>Nome da Categoria</span>
                      <input 
                        value={novaCategoriaNome} 
                        onChange={e => setNovaCategoriaNome(e.target.value)} 
                        placeholder="Ex: Ferramentas, Sementes, etc."
                        autoFocus
                      />
                    </label>
                    <div className="modal-actions">
                      <button type="submit" className="btn-acao">Salvar Categoria</button>
                      <button type="button" className="btn-sec" onClick={() => setPopupCategoriaAberto(false)}>Cancelar</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Popup: Editar Item */}
          {popupEdicaoAberto && itemEditando && (
            <div className="modal-overlay">
              <div className="modal">
                <div className="modal-header">
                  <h3>Editar Item</h3>
                  <button className="modal-close" onClick={() => setPopupEdicaoAberto(false)}>×</button>
                </div>
                <div className="modal-body">
                  <form onSubmit={salvarEdicao} className="modal-form">
                    <label>
                      <span>Nome</span>
                      <input value={edicaoNome} onChange={e => setEdicaoNome(e.target.value)} required />
                    </label>
                    <label>
                      <span>SKU</span>
                      <input value={edicaoSku} onChange={e => setEdicaoSku(e.target.value)} />
                    </label>
                    <label>
                      <span>Chave de identificação</span>
                      <input value={edicaoChave} onChange={e => setEdicaoChave(e.target.value)} required />
                    </label>
                    <label>
                      <span>Quantidade em estoque</span>
                      <input 
                        type="number" 
                        value={itemEditando.quantidade} 
                        disabled 
                        style={{ 
                          backgroundColor: '#f5f5f5', 
                          cursor: 'not-allowed',
                          color: '#666'
                        }} 
                      />
                    </label>
                    <label>
                      <span>Quantidade mínima</span>
                      <input type="number" value={edicaoQuantidadeMinima} onChange={e => setEdicaoQuantidadeMinima(e.target.value === '' ? '' : Number(e.target.value))} min={0} />
                    </label>
                    <label>
                      <span>Quantidade máxima</span>
                      <input type="number" value={edicaoQuantidadeMaxima} onChange={e => setEdicaoQuantidadeMaxima(e.target.value === '' ? '' : Number(e.target.value))} min={0} />
                    </label>
                    <label>
                      <span>Fornecedor</span>
                      <select value={edicaoFornecedorId} onChange={e => setEdicaoFornecedorId(e.target.value)} required>
                        {fornecedores.map(f => (
                          <option key={f.id} value={f.id}>{f.nome}</option>
                        ))}
                      </select>
                    </label>
                    <label>
                      <span>Categoria</span>
                      <select value={edicaoCategoria} onChange={e => setEdicaoCategoria(e.target.value)}>
                        {categorias.map((cat, idx) => (
                          <option key={idx} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </label>
                    <div className="modal-actions">
                      <button type="submit" className="btn-acao">Salvar Alterações</button>
                      <button type="button" className="btn-sec" onClick={() => setPopupEdicaoAberto(false)}>Cancelar</button>
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
