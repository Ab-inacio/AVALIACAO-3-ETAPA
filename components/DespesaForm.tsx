import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';

import { FontAwesome5 } from '@expo/vector-icons';
import { Despesa } from '../types/Despesa';

const categorias = [
  { nome: 'Alimentação', icone: 'utensils' },
  { nome: 'Transporte', icone: 'car' },
  { nome: 'Moradia', icone: 'home' },
  { nome: 'Saúde', icone: 'heartbeat' },
  { nome: 'Lazer', icone: 'gamepad' },
  { nome: 'Outros', icone: 'ellipsis-h' },
] as const;

type Props = {
  onAdicionar: (
    descricao: string,
    valor: number,
    categoria: string
  ) => void;
  onSalvarEdicao: (
    id: string,
    descricao: string,
    valor: number,
    categoria: string
  ) => void;
  despesaEditando: Despesa | null;
  onCancelarEdicao: () => void;
};

export default function DespesaForm({
  onAdicionar,
  onSalvarEdicao,
  despesaEditando,
  onCancelarEdicao,
}: Props) {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [categoria, setCategoria] = useState('');

  useEffect(() => {
    if (despesaEditando) {
      setDescricao(despesaEditando.descricao);
      setValor(despesaEditando.valor.toString().replace('.', ','));
      setCategoria(despesaEditando.categoria);
    } else {
      setDescricao('');
      setValor('');
      setCategoria('');
    }
  }, [despesaEditando]);

  function salvarDespesa() {
    const valorNumerico = Number(valor.replace(',', '.'));

    if (!descricao.trim() || !valor.trim() || !categoria) {
      Alert.alert('Atenção', 'Preencha todos os campos!');
      return;
    }

    if (!Number.isFinite(valorNumerico) || valorNumerico <= 0) {
      Alert.alert('Atenção', 'Digite um valor válido!');
      return;
    }

    if (despesaEditando) {
      onSalvarEdicao(
        despesaEditando.id,
        descricao.trim(),
        valorNumerico,
        categoria
      );
    } else {
      onAdicionar(
        descricao.trim(),
        valorNumerico,
        categoria
      );
    }

    setDescricao('');
    setValor('');
    setCategoria('');
  }

  function cancelarEdicao() {
    onCancelarEdicao();
    setDescricao('');
    setValor('');
    setCategoria('');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
      Dados da despesa
    </Text>

      <TextInput
        style={styles.input}
        placeholder="Descrição (ex: Supermercado)"
        value={descricao}
        onChangeText={setDescricao}
      />

      <TextInput
        style={styles.input}
        placeholder="Valor (ex: 45,90)"
        keyboardType="decimal-pad"
        value={valor}
        onChangeText={setValor}
      />

      <Text style={styles.labelCategoria}>
        Selecione uma categoria
      </Text>

      <View style={styles.categoriasContainer}>
        {categorias.map((item) => {
          const selecionada = categoria === item.nome;

          return (
            <TouchableOpacity
              key={item.nome}
              style={[
                styles.botaoCategoria,
                selecionada && styles.categoriaSelecionada,
              ]}
              onPress={() => setCategoria(item.nome)}
              activeOpacity={0.7}
            >
              <FontAwesome5
                name={item.icone}
                size={20}
                color={selecionada ? '#7C3AED' : '#64748B'}
              />

              <Text
                style={[
                  styles.textoCategoria,
                  selecionada && styles.textoSelecionado,
                ]}
              >
                {item.nome}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        style={styles.botao}
        onPress={salvarDespesa}
      >
        <Text style={styles.textoBotao}>
          {despesaEditando
            ? 'Salvar alterações'
            : 'Adicionar despesa'}
        </Text>
      </TouchableOpacity>

      {despesaEditando && (
        <TouchableOpacity
          style={styles.botaoCancelar}
          onPress={cancelarEdicao}
        >
          <Text style={styles.textoCancelar}>
            Cancelar edição
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EDE9FE',
  },
  titulo: {
    fontSize: 21,
    fontWeight: 'bold',
    marginBottom: 18,
    color: '#171B32',
  },
  input: {
    backgroundColor: '#F8F7FC',
    borderWidth: 1,
    borderColor: '#DDD6FE',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    fontSize: 16,
    color: '#171B32',
  },
  labelCategoria: {
    fontSize: 15,
    fontWeight: '600',
    color: '#171B32',
    marginBottom: 12,
  },
  categoriasContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  botaoCategoria: {
    width: '31%',
    minHeight: 85,
    backgroundColor: '#F8F7FC',
    borderWidth: 1,
    borderColor: '#DDD6FE',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  categoriaSelecionada: {
    backgroundColor: '#EDE9FE',
    borderColor: '#8B5CF6',
    borderWidth: 2,
  },
  textoCategoria: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
    textAlign: 'center',
  },
  textoSelecionado: {
    color: '#7C3AED',
    fontWeight: 'bold',
  },
  botao: {
    backgroundColor: '#8B5CF6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  textoBotao: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  botaoCancelar: {
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  textoCancelar: {
    color: '#64748B',
    fontSize: 15,
    fontWeight: '500',
  },
});
