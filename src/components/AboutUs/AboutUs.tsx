import React, { useEffect } from 'react';
import styles from './AboutUs.module.css';
import Header from '../Header/Header';
import planejamento from '../../assets/planejamento.jpg';
import mao from '../../assets/mao-no-tablet.jpg';
import reuniao from '../../assets/reuniao.jpg';
import paletes from '../../assets/paletes.jpg';
import tecnologia from '../../assets/tecnologia.jpg';

const AboutUs: React.FC = () => {

    useEffect(() => {
        const imagens = [planejamento, mao, reuniao, paletes, tecnologia];

        imagens.forEach((src) => {
            const img = new Image();
            img.src = src;
        });
    }, []);

    return (
        <>
            <Header />
            <div className={styles.paginaContainer}>
                <div className={styles.principalContainer}>
                    <h2 className={styles.titulo}>Sobre a Germinai</h2>
                    <p className={styles.texto}>
                        Na Germinai, nossa missão é fortalecer o agronegócio com tecnologia de ponta.
                        Acreditamos que a gestão inteligente da lavoura é a chave para uma produção
                        mais rentável e sustentável. Por isso, desenvolvemos uma plataforma completa
                        que coloca o poder dos dados nas mãos do produtor rural, simplificando o controle
                        de todas as etapas da safra.
                    </p>

                    <section className={styles.cardsContainer}>
                        <div className={styles.cardFuncionalidade}>
                            <img src={reuniao} loading="lazy" className={styles.cardImagem} />
                            <h3 className={styles.cardTitulo}>Controle de Atividades</h3>
                            <p className={styles.cardTexto}>
                                Planeje, agende e monitore todas as tarefas do ciclo produtivo. Garanta que sua equipe esteja sempre sincronizada e que nenhuma etapa importante seja esquecida.
                            </p>
                        </div>

                        <div className={styles.cardFuncionalidade}>
                            <img src={mao} loading="lazy" className={styles.cardImagem} />
                            <h3 className={styles.cardTitulo}>Gestão de Safra</h3>
                            <p className={styles.cardTexto}>
                                Acompanhe de perto o desenvolvimento da sua plantação. Registre dados sobre cada talhão, monitore a saúde das culturas e tenha um histórico completo para análises futuras.
                            </p>
                        </div>

                        <div className={styles.cardFuncionalidade}>
                            <img src={planejamento} loading="lazy" className={styles.cardImagem} />
                            <h3 className={styles.cardTitulo}>Gestão de Custos</h3>
                            <p className={styles.cardTexto}>
                                Tenha uma visão clara da saúde financeira da sua produção. Lance despesas com insumos, maquinário e mão de obra para calcular a rentabilidade real da sua safra e tomar decisões mais seguras.
                            </p>
                        </div>

                        <div className={styles.cardFuncionalidade}>
                            <img src={paletes} loading="lazy" className={styles.cardImagem} />
                            <h3 className={styles.cardTitulo}>Controle de Estoque</h3>
                            <p className={styles.cardTexto}>
                                Gerencie com precisão a entrada e saída de sementes, fertilizantes e defensivos. Evite desperdícios, planeje compras com antecedência e mantenha seu inventário sempre atualizado.
                            </p>
                        </div>

                        <div className={styles.cardFuncionalidade}>
                            <img src={tecnologia} loading="lazy" className={styles.cardImagem} />
                            <h3 className={styles.cardTitulo}>Gestor Inteligente (IA)</h3>
                            <p className={styles.cardTexto}>
                                Deixe que a Inteligência Artificial trabalhe por você. Nossa IA analisa os dados do seu negócio para gerar insights valiosos, previsões de colheita e recomendações personalizadas, ajudando você a tomar as melhores decisões para aumentar sua produtividade.
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
};

export default AboutUs;
