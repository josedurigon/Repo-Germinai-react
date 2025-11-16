import BoxShadowPadrao from '../../components/box-shadow/BoxShadowPadrao';
import RegistroVendasConteudo from './RegistroVendasConteudo';
import './RegistroVendas.css';

const RegistroVendas = () => {
  return (
    <div className="pagina-container-pai">
      <main className="conteudo-registro-vendas">
        <h1 className="titulo-pagina-gestao">Registro de Vendas</h1>
        <BoxShadowPadrao>
          <RegistroVendasConteudo />
        </BoxShadowPadrao>
      </main>
    </div>
  );
};

export default RegistroVendas;
