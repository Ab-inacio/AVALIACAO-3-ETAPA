
import React, { useState } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';

import { FontAwesome5 } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';

type Props = {
  onAutenticar: () => void;
};

export default function LoginScreen({
  onAutenticar,
}: Props) {
  const [autenticando, setAutenticando] = useState(false);
  const [mensagem, setMensagem] = useState('');

  async function autenticar() {
    if (autenticando) {
      return;
    }

    setAutenticando(true);
    setMensagem('');

    try {
      // Verificar os métodos de segurança cadastrados
      const nivelSeguranca =
        await LocalAuthentication.getEnrolledLevelAsync();

      if (
        nivelSeguranca ===
        LocalAuthentication.SecurityLevel.NONE
      ) {
        setMensagem(
          'Configure uma senha, PIN ou biometria nas configurações do celular para acessar o Cashly.'
        );

        return;
      }

      // Solicitar autenticação nativa do dispositivo
      const resultado =
        await LocalAuthentication.authenticateAsync({
          promptMessage: 'Desbloquear Cashly',
          cancelLabel: 'Cancelar',
          fallbackLabel: 'Usar senha do dispositivo',
          disableDeviceFallback: false,
          biometricsSecurityLevel: 'weak',
        });

      if (resultado.success) {
        onAutenticar();
      } else if (
        resultado.error === 'user_cancel' ||
        resultado.error === 'system_cancel' ||
        resultado.error === 'app_cancel'
      ) {
        setMensagem(
          'Autenticação cancelada. Tente novamente.'
        );
      } else if (resultado.error === 'lockout') {
        setMensagem(
          'Muitas tentativas de autenticação. Aguarde ou utilize a senha do dispositivo, caso esteja disponível.'
        );
      } else {
        setMensagem(
          'Não foi possível autenticar. Tente novamente.'
        );
      }
    } catch (erro) {
      console.error('Erro na autenticação:', erro);

      setMensagem(
        'Ocorreu um erro ao acessar a autenticação do dispositivo.'
      );
    } finally {
      setAutenticando(false);
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.conteudo}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.marca}>
        <View style={styles.logo}>
          <FontAwesome5
            name="wallet"
            size={36}
            color="#FFFFFF"
          />
        </View>

        <Text style={styles.titulo}>Cashly</Text>

        <Text style={styles.subtitulo}>
          Seu dinheiro, seu controle.
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.iconeBiometria}>
          <FontAwesome5
            name="fingerprint"
            size={48}
            color="#8B5CF6"
          />
        </View>

        <Text style={styles.cardTitulo}>
          Acesso protegido
        </Text>

        <Text style={styles.cardDescricao}>
          Confirme sua identidade para acessar suas
          informações financeiras.
        </Text>

        <TouchableOpacity
          style={[
            styles.botao,
            autenticando && styles.botaoDesabilitado,
          ]}
          onPress={autenticar}
          disabled={autenticando}
          activeOpacity={0.8}
        >
          {autenticando ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <FontAwesome5
                name="lock"
                size={16}
                color="#FFFFFF"
              />

              <Text style={styles.botaoTexto}>
                Desbloquear Cashly
              </Text>
            </>
          )}
        </TouchableOpacity>

        {mensagem !== '' && (
          <View style={styles.aviso}>
            <FontAwesome5
              name="exclamation-circle"
              size={18}
              color="#DC2626"
            />

            <Text style={styles.avisoTexto}>
              {mensagem}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.rodape}>
        <View style={styles.seguranca}>
          <FontAwesome5
            name="shield-alt"
            size={14}
            color="#8B5CF6"
          />

          <Text style={styles.rodapeTexto}>
            Privacidade e controle financeiro
          </Text>
        </View>

        <Text style={styles.versao}>
          Cashly 2.0
        </Text>
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
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    paddingVertical: 40,
  },
  marca: {
    alignItems: 'center',
    marginBottom: 36,
  },
  logo: {
    width: 86,
    height: 86,
    backgroundColor: '#8B5CF6',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  titulo: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#171B32',
  },
  subtitulo: {
    fontSize: 15,
    color: '#64748B',
    marginTop: 6,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 26,
    alignItems: 'center',
  },
  iconeBiometria: {
    width: 100,
    height: 100,
    backgroundColor: '#F5F3FF',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitulo: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#171B32',
    marginBottom: 12,
    textAlign: 'center',
  },
  cardDescricao: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 23,
    marginBottom: 24,
  },
  botao: {
    backgroundColor: '#8B5CF6',
    borderRadius: 14,
    minHeight: 54,
    width: '100%',
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  botaoDesabilitado: {
    opacity: 0.6,
  },
  botaoTexto: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  aviso: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    padding: 14,
    borderRadius: 12,
    marginTop: 18,
    gap: 10,
    width: '100%',
  },
  avisoTexto: {
    flex: 1,
    fontSize: 13,
    color: '#DC2626',
    lineHeight: 19,
  },
  rodape: {
    alignItems: 'center',
    marginTop: 36,
    gap: 12,
  },
  seguranca: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rodapeTexto: {
    fontSize: 12,
    color: '#64748B',
  },
  versao: {
    fontSize: 12,
    color: '#94A3B8',
  },
});
