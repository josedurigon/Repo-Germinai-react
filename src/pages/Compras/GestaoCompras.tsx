import BoxShadowPadrao from '../../components/box-shadow/BoxShadowPadrao';
import PedidoCompraConteudo from './PedidoCompraConteudo';
import './GestaoCompras.css';

const GestaoCompras = () => {
  return (
    <div className="pagina-container-pai">
      <main className="conteudo-gestao-compras">
        <h1 className="titulo-pagina-gestao">Gestão de Compras</h1>
        <BoxShadowPadrao>
          <PedidoCompraConteudo />
        </BoxShadowPadrao>
      </main>
    </div>
  );
};

export default GestaoCompras;
