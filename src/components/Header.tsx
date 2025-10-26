import React from 'react';
import letreiro from '../assets/letreiro-home.png'
import logo from '../assets/logo-sem-textura.png'


const Header: React.FC = () => {
    return (
    <header
    style ={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 40px',
        background: 'linear-gradient(to right, #62826B, #1D3115)',
        color: '#C9D5CB',
        height:'94px',
}}
>
    <div style={{
        display: 'flex',
        alignItems: 'center'}}>
        <img src={logo} alt="escrita germinai"/>
        <img src={letreiro} alt="Logo germinai sem textura"/>
    </div>
    <nav>
        <ul
        style={{
            display: 'flex',
            margin:0,
            padding:0,
            listStyle:'none',
        }}
        >
         <li style={{marginLeft:'30px'}}>
            <a
            href="#inicio"
            style={{color:'#C9D5CB',fontWeight:'bold'}}
            >
                INÍCIO
            </a>
            </li>  
            <li style={{marginLeft:'30px'}}>
            <a
            href="#inicio"
            style={{color:'#C9D5CB',textDecoration: 'none', fontWeight:'bold'}}
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