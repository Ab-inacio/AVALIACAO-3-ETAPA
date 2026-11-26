import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { Despesa } from '../types/Despesa';

type Props = {
  despesa: Despesa;
  onExcluir: (id: string) => void;
  onEditar: (despesa: Despesa) => void;
};

export default function DespesaItem({
  despesa,
  onExcluir,
  onEditar,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.informacoes}>
        <Text style={styles.descricao}>
          {despesa.descricao}
        </Text>

        <Text style={styles.categoria}>
          {despesa.categoria}
        </Text>

        <Text style={styles.data}>
        Cadastrada em: {new Date(despesa.dataCadastro).toLocaleDateString('pt-BR')}
        </Text>
       <Text style={styles.valor}>
            {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(despesa.valor)}
       </Text>
      </View>

      <View style={styles.acoes}>
        <TouchableOpacity
          style={styles.botaoEditar}
          onPress={() => onEditar(despesa)}
        >
          <Text style={styles.textoBotao}>Editar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
        style={styles.botaoExcluir}
        onPress={() => onExcluir(despesa.id)}
        >
        <Text style={styles.textoExcluir}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EDE9FE',
  },
  informacoes: {
    marginBottom: 14,
  },
  descricao: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#171B32',
  },
  categoria: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: '500',
    marginTop: 5,
  },
  data: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 6,
  },
  valor: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#DC2626',
    marginTop: 10,
  },
  acoes: {
    flexDirection: 'row',
    gap: 10,
  },
  botaoEditar: {
    backgroundColor: '#8B5CF6',
    padding: 12,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
  },
  botaoExcluir: {
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
  },
  textoBotao: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  textoExcluir: {
    color: '#DC2626',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
