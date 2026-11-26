import React, { useState, useEffect } from 'react';

import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';

import {
  NavigationContainer,
  DefaultTheme,
} from '@react-navigation/native';

import {
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';

import { FontAwesome5 } from '@expo/vector-icons';

import { Despesa } from './types/Despesa';

import InicioScreen from './screens/InicioScreen';
import CadastroScreen from './screens/CadastroScreen';
import HistoricoScreen from './screens/HistoricoScreen';
import LoginScreen from './screens/LoginScreen';

import {
  salvarDespesas,
  carregarDespesas,
} from './services/storage';

type TabParamList = {
  Inicio: undefined;
  Cadastro: undefined;
  Historico: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const temaCashly = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#8B5CF6',
    background: '#F5F3FF',
    card: '#FFFFFF',
    text: '#171B32',
    border: '#EDE9FE',
  },
};

export default function App() {
  const [autenticado, setAutenticado] = useState(false);

  const [despesas, setDespesas] = useState<Despesa[]>([]);

  const [dadosCarregados, setDadosCarregados] =
    useState(false);

  const [erroCarregamento, setErroCarregamento] =
    useState(false);

  const [despesaEditando, setDespesaEditando] =
    useState<Despesa | null>(null);

  // Carregar despesas após a autenticação
  useEffect(() => {
    if (!autenticado) {
      return;
    }

    async function inicializarDespesas() {
      try {
        const despesasSalvas = await carregarDespesas();

        setDespesas(despesasSalvas);
        setDadosCarregados(true);
      } catch (erro) {
        console.error(
          'Erro ao carregar despesas:',
          erro
        );

        setErroCarregamento(true);

        Alert.alert(
          'Erro',
          'Não foi possível recuperar as despesas salvas.'
        );
      }
    }

    inicializarDespesas();
  }, [autenticado]);

  // Salvar despesas automaticamente
  useEffect(() => {
    if (!autenticado || !dadosCarregados) {
      return;
    }

    async function persistirDespesas() {
      try {
        await salvarDespesas(despesas);
      } catch (erro) {
        console.error(
          'Erro ao salvar despesas:',
          erro
        );

        Alert.alert(
          'Erro',
          'Não foi possível salvar as despesas.'
        );
      }
    }

    persistirDespesas();
  }, [despesas, dadosCarregados, autenticado]);

  function adicionarDespesa(
    descricao: string,
    valor: number,
    categoria: string
  ) {
    const novaDespesa: Despesa = {
      id: Date.now().toString() + Math.random().toString(),
      descricao,
      valor,
      categoria,
      dataCadastro: new Date().toISOString(),
    };

    setDespesas((anteriores) => [
      ...anteriores,
      novaDespesa,
    ]);
  }

  function excluirDespesa(id: string) {
    Alert.alert(
      'Excluir despesa?',
      'Tem certeza de que deseja excluir esta despesa? Essa ação não poderá ser desfeita.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            setDespesas((anteriores) =>
              anteriores.filter(
                (despesa) => despesa.id !== id
              )
            );

            if (despesaEditando?.id === id) {
              setDespesaEditando(null);
            }
          },
        },
      ],
      {
        cancelable: true,
      }
    );
  }

  function editarDespesa(despesa: Despesa) {
    setDespesaEditando(despesa);
  }

  function salvarEdicao(
    id: string,
    descricao: string,
    valor: number,
    categoria: string
  ) {
    setDespesas((anteriores) =>
      anteriores.map((despesa) =>
        despesa.id === id
          ? {
              ...despesa,
              descricao,
              valor,
              categoria,
            }
          : despesa
      )
    );

    setDespesaEditando(null);
  }

  function cancelarEdicao() {
    setDespesaEditando(null);
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />

      <SafeAreaView
        style={styles.container}
        edges={
          autenticado
            ? ['top', 'left', 'right']
            : ['top', 'bottom', 'left', 'right']
        }
      >
        {!autenticado ? (
          <LoginScreen
            onAutenticar={() => setAutenticado(true)}
          />
        ) : !dadosCarregados ? (
          <View style={styles.carregamento}>
            {!erroCarregamento && (
              <ActivityIndicator
                size="large"
                color="#8B5CF6"
              />
            )}

            <Text style={styles.textoCarregamento}>
              {erroCarregamento
                ? 'Erro ao carregar despesas. Reinicie o aplicativo.'
                : 'Carregando despesas...'}
            </Text>
          </View>
        ) : (
          <NavigationContainer theme={temaCashly}>
            <Tab.Navigator
              initialRouteName="Inicio"
              screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#8B5CF6',
                tabBarInactiveTintColor: '#94A3B8',
                tabBarHideOnKeyboard: true,
                tabBarStyle: {
                  backgroundColor: '#FFFFFF',
                  borderTopColor: '#EDE9FE',
                  paddingTop: 8,
                  paddingBottom: 16,
                  height: 75,
                },
                tabBarLabelStyle: {
                  fontSize: 12,
                  fontWeight: '600',
                },
              }}
            >
              <Tab.Screen
                name="Inicio"
                options={{
                  title: 'Início',
                  tabBarIcon: ({ color, size }) => (
                    <FontAwesome5
                      name="home"
                      color={color}
                      size={size}
                    />
                  ),
                }}
              >
                {() => (
                  <InicioScreen despesas={despesas} />
                )}
              </Tab.Screen>

              <Tab.Screen
                name="Cadastro"
                options={{
                  title: 'Cadastro',
                  tabBarIcon: ({ color, size }) => (
                    <FontAwesome5
                      name="plus-circle"
                      color={color}
                      size={size}
                    />
                  ),
                }}
              >
                {({ navigation }) => (
                  <CadastroScreen
                    despesaEditando={despesaEditando}
                    onAdicionar={(
                      descricao,
                      valor,
                      categoria
                    ) => {
                      adicionarDespesa(
                        descricao,
                        valor,
                        categoria
                      );

                      navigation.navigate('Historico');
                    }}
                    onSalvarEdicao={(
                      id,
                      descricao,
                      valor,
                      categoria
                    ) => {
                      salvarEdicao(
                        id,
                        descricao,
                        valor,
                        categoria
                      );

                      navigation.navigate('Historico');
                    }}
                    onCancelarEdicao={() => {
                      cancelarEdicao();

                      navigation.navigate('Historico');
                    }}
                  />
                )}
              </Tab.Screen>

              <Tab.Screen
                name="Historico"
                options={{
                  title: 'Histórico',
                  tabBarIcon: ({ color, size }) => (
                    <FontAwesome5
                      name="list"
                      color={color}
                      size={size}
                    />
                  ),
                }}
              >
                {({ navigation }) => (
                  <HistoricoScreen
                    despesas={despesas}
                    onExcluir={excluirDespesa}
                    onEditar={(despesa) => {
                      editarDespesa(despesa);

                      navigation.navigate('Cadastro');
                    }}
                  />
                )}
              </Tab.Screen>
            </Tab.Navigator>
          </NavigationContainer>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3FF',
  },
  carregamento: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  textoCarregamento: {
    fontSize: 16,
    color: '#8B5CF6',
    fontWeight: '600',
    textAlign: 'center',
  },
});
