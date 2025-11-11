import React from "react";
import "./CardFinanceiro.css";

interface CardFinanceiroProps {
  children: React.ReactNode;
  
}

export default function CardFinanceiro({ children }: CardFinanceiroProps) {
  return <div className="card-financeiro">
    {children}
    
  </div>;
}
