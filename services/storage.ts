import AsyncStorage from '@react-native-async-storage/async-storage';
import { Despesa } from '../types/Despesa';

const CHAVE_DESPESAS = '@cashly:despesas';

export async function salvarDespesas(
  despesas: Despesa[]
): Promise<void> {
  await AsyncStorage.setItem(
    CHAVE_DESPESAS,
    JSON.stringify(despesas)
  );
}

export async function carregarDespesas(): Promise<Despesa[]> {
  const dados = await AsyncStorage.getItem(CHAVE_DESPESAS);

  return dados ? JSON.parse(dados) : [];
}