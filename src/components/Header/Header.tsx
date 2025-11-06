import React from 'react';
import styles from './Header.module.css';

import letreiro from '../../assets/letreiro-home.png'
import logo from '../../assets/logo-sem-textura.png'
import { Link } from 'react-router-dom';


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
                        <Link to ="/"
                            className={styles.navLink}
                            >
                            INÍCIO
                            </Link>
                    </li>
                    <li className={styles.navItem}>
                            <Link to="/sobre-nos"
                            className={styles.navLink}
                        >
                            SOBRE-NÓS
                            </Link>
                    </li>
                </ul>
            </nav>

        </header>
    );
}

export default Header;