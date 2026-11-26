
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { Despesa } from '../types/Despesa';
import DespesaForm from '../components/DespesaForm';

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

export default function CadastroScreen({
  onAdicionar,
  onSalvarEdicao,
  despesaEditando,
  onCancelarEdicao,
}: Props) {
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.conteudo}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cabecalho}>
          <Text style={styles.titulo}>
            {despesaEditando
              ? 'Editar despesa'
              : 'Nova despesa'}
          </Text>

          <Text style={styles.subtitulo}>
            {despesaEditando
              ? 'Atualize as informações da sua despesa.'
              : 'Registre seus gastos e mantenha suas finanças organizadas.'}
          </Text>
        </View>

        <DespesaForm
          onAdicionar={onAdicionar}
          onSalvarEdicao={onSalvarEdicao}
          despesaEditando={despesaEditando}
          onCancelarEdicao={onCancelarEdicao}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3FF',
  },
  conteudo: {
    padding: 20,
    paddingBottom: 100,
    flexGrow: 1,
  },
  cabecalho: {
    marginTop: 10,
    marginBottom: 24,
  },
  titulo: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#171B32',
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 15,
    color: '#64748B',
    lineHeight: 22,
  },
});
