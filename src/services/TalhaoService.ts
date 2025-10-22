// src/services/TalhaoService.ts
import api from "../api/axios";

export interface Talhao {
  id: number;
  nome: string;
  areaHa: number;
}

export async function listarTalhoes(): Promise<Talhao[]> {
  const { data } = await api.get<Talhao[]>("/talhao");
  return data;
}

export async function buscarTalhaoPorId(id: number): Promise<Talhao> {
  const { data } = await api.get<Talhao>(`/talhao/${id}`);
  return data;
}

export async function criarTalhao(talhao: Omit<Talhao, 'id'>): Promise<Talhao> {
  const { data } = await api.post<Talhao>("/talhao", talhao);
  return data;
}
