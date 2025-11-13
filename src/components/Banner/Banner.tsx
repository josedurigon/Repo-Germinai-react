import React, { useEffect } from 'react';
import styles from './Banner.module.css';
import fazendeiro from '../../assets/fazendeiro_img.png';
import muda from '../../assets/maos_segurando_muda.jpg';
import safra from '../../assets/safra_img.jpg';

const Banner: React.FC = () => {

  useEffect(() => {

  }, []);

  return (
    <section className={styles.bodyBanner}>

      <div className={styles.conteudoBanner}>

        <div className={styles.conteudoColuna}>
          <h1 className={styles.titulo}>Gerencie sua Safra com Inteligência</h1>

          <p className={styles.subtitulo}>
            Nossa plataforma oferece as ferramentas que você precisa para planejar,
            monitorar e analisar cada etapa da sua safra, garantindo mais produtividade e eficiência.
          </p>

          <div>
            <a href="/cadastro" className={styles.botaoCadastrar}>
              Cadastre-se
            </a>
            <a href="/login" className={styles.linkLogin}>
              Fazer login
            </a>
          </div>
        </div>

        <div className={styles.imagensColuna}>
          <img
            src={fazendeiro}
            alt="Fazendeiro colhendo"
            className={styles.imagemCentral}
          />

          <div className={styles.centralizadorImagens}>
            <div className={styles.iconConcatenador}>
              <img
                src={safra}
                alt="Campo dividido em duas culturas"
                className={styles.imagensLaterais}
              />
            </div>

            <img
              src={muda}
              alt="Campo dividido em duas culturas"
              className={styles.imagensLaterais}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;