import React from 'react';
import './BoxShadowPadrao.css';

type Props = {
  children: React.ReactNode;
};

const BoxShadowPadrao = ({children} : Props) => {
  return (
    <div className = "BoxShadowPadrao">
      {children}
    </div>
  );
};

export default BoxShadowPadrao;
