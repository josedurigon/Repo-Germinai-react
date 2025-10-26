import React from 'react';
import styles from './Header.module.css';

import letreiro from '../../assets/letreiro-home.png'
import logo from '../../assets/logo-sem-textura.png'


const Header: React.FC = () => {
    return (
        <header className={styles.headerContainer}>

            <div className={styles.logoWrapper}>
                <img src={logo} alt="Logo Germinai" />
                <img src={letreiro} alt="Escrita Germinai" />
            </div>

            <nav>
                <ul className={styles.navList}>
                    <li className={styles.navItem}>
                        <a
                            href="#inicio"
                            className={styles.navLink}
                        >
                            INÍCIO
                        </a>
                    </li>
                    <li className={styles.navItem}>
                        <a
                            href="#sobre-nos"
                            className={styles.navLink}
                        >
                            SOBRE-NÓS
                        </a>
                    </li>
                </ul>
            </nav>

        </header>
    );
}

export default Header;