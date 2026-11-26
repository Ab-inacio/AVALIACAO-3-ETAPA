
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';

import { FontAwesome5 } from '@expo/vector-icons';
import { Despesa } from '../types/Despesa';

type Props = {
  despesas: Despesa[];
};

const categorias = [
  { nome: 'Alimentação', icone: 'utensils' },
  { nome: 'Transporte', icone: 'car' },
  { nome: 'Moradia', icone: 'home' },
  { nome: 'Saúde', icone: 'heartbeat' },
  { nome: 'Lazer', icone: 'gamepad' },
  { nome: 'Outros', icone: 'ellipsis-h' },
];

function formatarMoeda(valor: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);
}

export default function InicioScreen({ despesas }: Props) {
  const total = despesas.reduce(
    (soma, despesa) => soma + despesa.valor,
    0
  );

  const quantidade = despesas.length;

  const media = quantidade > 0
    ? total / quantidade
    : 0;

  const resumoCategorias = categorias
    .map((categoria) => ({
      ...categoria,
      valor: despesas
        .filter((despesa) => despesa.categoria === categoria.nome)
        .reduce((soma, despesa) => soma + despesa.valor, 0),
    }))
    .filter((categoria) => categoria.valor > 0)
    .sort((a, b) => b.valor - a.valor);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.conteudo}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.titulo}>Cashly</Text>

      <Text style={styles.subtitulo}>
        Seu dinheiro, seu controle.
      </Text>

      <View style={styles.resumo}>
        <Text style={styles.resumoTitulo}>
          Total de despesas
        </Text>

        <Text style={styles.resumoValor}>
          {formatarMoeda(total)}
        </Text>

        <Text style={styles.resumoDescricao}>
          Seu resumo financeiro
        </Text>
      </View>

      <View style={styles.indicadores}>
        <View style={styles.indicador}>
          <FontAwesome5
            name="receipt"
            size={20}
            color="#8B5CF6"
          />

          <Text style={styles.indicadorTitulo}>
            Despesas
          </Text>

          <Text style={styles.indicadorValor}>
            {quantidade}
          </Text>
        </View>

        <View style={styles.indicador}>
          <FontAwesome5
            name="chart-bar"
            size={20}
            color="#8B5CF6"
          />

          <Text style={styles.indicadorTitulo}>
            Gasto médio
          </Text>

          <Text style={styles.indicadorValor}>
            {formatarMoeda(media)}
          </Text>
        </View>
      </View>

      <Text style={styles.secaoTitulo}>
        Gastos por categoria
      </Text>

      <View style={styles.cardCategorias}>
        {resumoCategorias.length === 0 ? (
          <View style={styles.estadoVazio}>
            <FontAwesome5
              name="chart-pie"
              size={36}
              color="#C4B5FD"
            />

            <Text style={styles.vazioTitulo}>
              Nenhuma despesa registrada
            </Text>

            <Text style={styles.vazioTexto}>
              Cadastre suas despesas para visualizar
              seu resumo financeiro.
            </Text>
          </View>
        ) : (
          resumoCategorias.map((categoria) => {
            const percentual =
              (categoria.valor / total) * 100;

            return (
              <View
                key={categoria.nome}
                style={styles.categoria}
              >
                <View style={styles.categoriaCabecalho}>
                  <FontAwesome5
                    name={categoria.icone}
                    size={16}
                    color="#8B5CF6"
                  />

                  <Text style={styles.categoriaNome}>
                    {categoria.nome}
                  </Text>

                  <Text style={styles.categoriaValor}>
                    {formatarMoeda(categoria.valor)}
                  </Text>
                </View>

                <View style={styles.barraFundo}>
                  <View
                    style={[
                      styles.barraPreenchimento,
                      { width: `${percentual}%` },
                    ]}
                  />
                </View>

                <Text style={styles.percentual}>
                  {percentual.toFixed(1).replace('.', ',')}%
                  do total
                </Text>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
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
  },
  titulo: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#171B32',
    marginTop: 10,
  },
  subtitulo: {
    fontSize: 15,
    color: '#64748B',
    marginBottom: 24,
  },
  resumo: {
    backgroundColor: '#171B32',
    padding: 24,
    borderRadius: 20,
    marginBottom: 18,
  },
  resumoTitulo: {
    fontSize: 16,
    color: '#C9A7FF',
    fontWeight: '500',
  },
  resumoValor: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginVertical: 12,
  },
  resumoDescricao: {
    fontSize: 14,
    color: '#E2D9FF',
  },
  indicadores: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 26,
  },
  indicador: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 16,
    gap: 10,
  },
  indicadorTitulo: {
    fontSize: 14,
    color: '#64748B',
  },
  indicadorValor: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#171B32',
  },
  secaoTitulo: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#171B32',
    marginBottom: 15,
  },
  cardCategorias: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 18,
  },
  categoria: {
    marginBottom: 20,
  },
  categoriaCabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  categoriaNome: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#171B32',
  },
  categoriaValor: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#171B32',
  },
  barraFundo: {
    height: 8,
    backgroundColor: '#EDE9FE',
    borderRadius: 10,
    overflow: 'hidden',
  },
  barraPreenchimento: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 10,
  },
  percentual: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 6,
  },
  estadoVazio: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 12,
  },
  vazioTitulo: {
    fontSize: 16,
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
});
