import BoxShadowPadrao from '../../components/box-shadow/BoxShadowPadrao';
import ContasConteudo from './ContasConteudo';
import './Contas.css';

const ContasAPagarReceber = () => {
  return (
    <div className="pagina-container-pai">
      <main className="conteudo-contas">
        <h1 className="titulo-pagina-contas">Contas a Pagar e a Receber</h1>
        
        <BoxShadowPadrao>
          <ContasConteudo />
        </BoxShadowPadrao>
      </main>
    </div>
  );
};

export default ContasAPagarReceber;
