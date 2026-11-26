
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { FontAwesome5 } from '@expo/vector-icons';
import { Despesa } from '../types/Despesa';
import DespesaItem from '../components/DespesaItem';

type Props = {
  despesas: Despesa[];
  onExcluir: (id: string) => void;
  onEditar: (despesa: Despesa) => void;
};

const categorias = [
  'Todas',
  'Alimentação',
  'Transporte',
  'Moradia',
  'Saúde',
  'Lazer',
  'Outros',
];

export default function HistoricoScreen({
  despesas,
  onExcluir,
  onEditar,
}: Props) {
  const [busca, setBusca] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] =
    useState('Todas');

  // Filtrar despesas pela descrição e categoria
  const despesasFiltradas = despesas.filter((despesa) => {
    const correspondeBusca = despesa.descricao
      .toLowerCase()
      .includes(busca.trim().toLowerCase());

    const correspondeCategoria =
      categoriaSelecionada === 'Todas' ||
      despesa.categoria === categoriaSelecionada;

    return correspondeBusca && correspondeCategoria;
  });

  // Calcular o total das despesas filtradas
  const totalFiltrado = despesasFiltradas.reduce(
    (total, despesa) => total + despesa.valor,
    0
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={despesasFiltradas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.conteudo}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <Text style={styles.titulo}>
              Histórico
            </Text>

            <Text style={styles.subtitulo}>
              Consulte e gerencie suas despesas.
            </Text>

            {/* Campo de busca */}
            <View style={styles.campoBusca}>
              <FontAwesome5
                name="search"
                size={17}
                color="#8B5CF6"
              />

              <TextInput
                style={styles.inputBusca}
                placeholder="Buscar despesa..."
                placeholderTextColor="#94A3B8"
                value={busca}
                onChangeText={setBusca}
              />

              {busca.length > 0 && (
                <TouchableOpacity
                  onPress={() => setBusca('')}
                  accessibilityLabel="Limpar busca"
                >
                  <FontAwesome5
                    name="times-circle"
                    size={18}
                    color="#94A3B8"
                  />
                </TouchableOpacity>
              )}
            </View>

            {/* Filtros por categoria */}
            <View style={styles.filtros}>
              {categorias.map((categoria) => (
                <TouchableOpacity
                  key={categoria}
                  style={[
                    styles.filtro,
                    categoriaSelecionada === categoria &&
                      styles.filtroAtivo,
                  ]}
                  onPress={() =>
                    setCategoriaSelecionada(categoria)
                  }
                >
                  <Text
                    style={[
                      styles.filtroTexto,
                      categoriaSelecionada === categoria &&
                        styles.filtroTextoAtivo,
                    ]}
                  >
                    {categoria}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Resumo dos resultados */}
            <View style={styles.resumo}>
              <Text style={styles.resumoTitulo}>
                Total dos resultados
              </Text>

              <Text style={styles.resumoValor}>
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(totalFiltrado)}
              </Text>

              <Text style={styles.quantidade}>
                {despesasFiltradas.length === 0
                ? 'Nenhuma despesa encontrada'
                   : despesasFiltradas.length === 1
                    ? '1 despesa encontrada'
                 : `${despesasFiltradas.length} despesas encontradas`}
              </Text>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <DespesaItem
            despesa={item}
            onExcluir={onExcluir}
            onEditar={onEditar}
          />
        )}
        ListEmptyComponent={
          <View style={styles.estadoVazio}>
            <FontAwesome5
              name="receipt"
              size={40}
              color="#C4B5FD"
            />

            <Text style={styles.vazioTitulo}>
              {despesas.length === 0
                ? 'Nenhuma despesa cadastrada'
                : 'Nenhum resultado encontrado'}
            </Text>

            <Text style={styles.vazioTexto}>
              {despesas.length === 0
                ? 'Cadastre sua primeira despesa para começar.'
                : 'Tente buscar outra descrição ou selecionar uma categoria diferente.'}
            </Text>

            {despesas.length > 0 && (
              <TouchableOpacity
                style={styles.botaoLimpar}
                onPress={() => {
                  setBusca('');
                  setCategoriaSelecionada('Todas');
                }}
              >
                <Text style={styles.botaoLimparTexto}>
                  Limpar filtros
                </Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3FF',
  },
  conteudo: {
    padding: 20,
    paddingBottom: 30,
    flexGrow: 1,
  },
  titulo: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#171B32',
    marginTop: 10,
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 15,
    color: '#64748B',
    marginBottom: 24,
  },
  campoBusca: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    minHeight: 52,
    gap: 12,
    marginBottom: 16,
  },
  inputBusca: {
    flex: 1,
    fontSize: 15,
    color: '#171B32',
    paddingVertical: 12,
  },
  filtros: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  filtro: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
  },
  filtroAtivo: {
    backgroundColor: '#8B5CF6',
  },
  filtroTexto: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
  },
  filtroTextoAtivo: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  resumo: {
    backgroundColor: '#171B32',
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
  },
  resumoTitulo: {
    fontSize: 14,
    color: '#C9A7FF',
  },
  resumoValor: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginVertical: 8,
  },
  quantidade: {
    fontSize: 13,
    color: '#E2D9FF',
  },
  estadoVazio: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 28,
    gap: 12,
  },
  vazioTitulo: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#171B32',
    textAlign: 'center',
  },
  vazioTexto: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 21,
  },
  botaoLimpar: {
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 6,
  },
  botaoLimparTexto: {
    color: '#7C3AED',
    fontWeight: '600',
    fontSize: 14,
  },
});
