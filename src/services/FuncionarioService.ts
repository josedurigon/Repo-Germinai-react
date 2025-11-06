// src/services/FuncionarioService.ts
import api from "../api/axios";

export interface Funcionario {
  id: number;
  nome: string;
}

export async function listarFuncionarios(): Promise<Funcionario[]> {
  const { data } = await api.get<Funcionario[]>("/funcionario");
  return data;
}

export async function buscarFuncionarioPorId(id: number): Promise<Funcionario> {
  const { data } = await api.get<Funcionario>(`/funcionario/${id}`);
  return data;
}

export async function criarFuncionario(funcionario: Omit<Funcionario, 'id'>): Promise<Funcionario> {
  const { data } = await api.post<Funcionario>("/funcionario", funcionario);
  return data;
}
