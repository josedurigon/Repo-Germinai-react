// src/services/CulturaService.ts
import api from "../api/axios";

export interface Cultura {
  id: number;
  nome: string;
  cicloDias: number;
}

export async function listarCulturas(): Promise<Cultura[]> {
  const { data } = await api.get<Cultura[]>("/cultura");
  return data;
}

export async function buscarCulturaPorId(id: number): Promise<Cultura> {
  const { data } = await api.get<Cultura>(`/cultura/${id}`);
  return data;
}

export async function criarCultura(cultura: Omit<Cultura, 'id'>): Promise<Cultura> {
  const { data } = await api.post<Cultura>("/cultura", cultura);
  return data;
}
