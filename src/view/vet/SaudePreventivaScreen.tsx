import React, { useMemo, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';

import {
  useLembretes,
  useEnviarTodosPendentes,
} from '../../hooks/useLembretes';

type Filtro = 'todos' | 'pendentes';

export default function SaudePreventivaScreen() {
  const {
    data: lembretesData,
    isLoading,
    isError,
    refetch,
  } = useLembretes();

  const enviarTodos = useEnviarTodosPendentes();

  const [filtro, setFiltro] = useState<Filtro>('todos');

  const lembretes = Array.isArray(lembretesData)
    ? lembretesData
    : [];

  React.useEffect(() => {
    if (lembretes.length > 0) {
      console.log(
        'EXEMPLO DE LEMBRETE:',
        JSON.stringify(lembretes[0], null, 2)
      );
    }
  }, [lembretes]);

  /*
   * Busca o e-mail independentemente de como
   * o backend estiver retornando o objeto.
   */
  const getEmail = (item: any): string => {
    return (
      item.tutorEmail ||
      item.email ||
      item.tutor_email ||
      item.emailTutor ||
      item.consulta?.tutorEmail ||
      item.animal?.tutorEmail ||
      item.consulta?.animal?.tutorEmail ||
      '-'
    );
  };

  /*
   * Validação simples de e-mail.
   */
  const isEmailValido = (email: string): boolean => {
    if (!email) {
      return false;
    }

    const emailTratado = String(email).trim();

    if (
      emailTratado === '' ||
      emailTratado === '-' ||
      emailTratado.toLowerCase() === 'null' ||
      emailTratado.toLowerCase() === 'undefined'
    ) {
      return false;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(emailTratado);
  };

  const getAnimalNome = (item: any): string => {
    return (
      item.animalNome ||
      item.animal?.nome ||
      item.consulta?.animalNome ||
      item.consulta?.animal?.nome ||
      '-'
    );
  };

  const getTutorNome = (item: any): string => {
    return (
      item.tutorNome ||
      item.consulta?.tutorNome ||
      item.animal?.tutorNome ||
      item.consulta?.animal?.tutorNome ||
      '-'
    );
  };

  const isEnviado = (item: any): boolean => {
    const valor =
      item.enviado ??
      item.enviadoFlag ??
      item.status;

    return (
      valor === true ||
      valor === 1 ||
      valor === 'S' ||
      valor === 'ENVIADO'
    );
  };

  /*
   * Estatísticas dos lembretes.
   */
  const stats = useMemo(() => {
    const total = lembretes.length;

    const enviados = lembretes.filter(
      (item: any) => isEnviado(item)
    ).length;

    const listaPendentes = lembretes.filter(
      (item: any) => !isEnviado(item)
    );

    const pendentes = listaPendentes.length;

    const semEmailValido = listaPendentes.filter(
      (item: any) => {
        const email = getEmail(item);

        return !isEmailValido(email);
      }
    ).length;

    const aptosParaEnvio =
      pendentes - semEmailValido;

    return {
      total,
      enviados,
      pendentes,
      semEmailValido,
      aptosParaEnvio,
    };
  }, [lembretes]);

  /*
   * Filtro da lista.
   */
  const lembretesFiltrados = useMemo(() => {
    if (filtro === 'pendentes') {
      return lembretes.filter(
        (item: any) => !isEnviado(item)
      );
    }

    return lembretes;
  }, [lembretes, filtro]);

  /*
   * Faz efetivamente a requisição para
   * enviar os lembretes.
   */
  const executarEnvio = () => {
    enviarTodos.mutate(undefined, {
      onSuccess: (response: any) => {
        console.log(
          'RESPOSTA ENVIO DE LEMBRETES:',
          response
        );

        const mensagem =
          response?.message ||
          response?.mensagem ||
          `${stats.aptosParaEnvio} lembrete(s) enviado(s) com sucesso.`;

        Alert.alert(
          'Sucesso',
          mensagem
        );

        refetch();
      },

      onError: (error: any) => {
        console.error(
          'ERRO AO ENVIAR LEMBRETES:',
          error
        );

        console.error(
          'RESPOSTA BACKEND:',
          error?.response?.data
        );

        const mensagem =
          error?.response?.data?.message ||
          error?.response?.data?.mensagem ||
          error?.response?.data?.erro ||
          'Não foi possível enviar os lembretes. Verifique se os tutores possuem e-mails válidos.';

        Alert.alert(
          'Erro no envio',
          mensagem
        );
      },
    });
  };

  /*
   * Valida antes de chamar o backend.
   */
  const handleEnviarTodos = () => {
    if (stats.pendentes === 0) {
      Alert.alert(
        'Aviso',
        'Não há lembretes pendentes para enviar.'
      );

      return;
    }

    /*
     * Existem pendentes, mas nenhum possui
     * e-mail válido.
     */
    if (stats.aptosParaEnvio === 0) {
      Alert.alert(
        'Nenhum e-mail válido',
        'Não foi possível realizar o envio porque nenhum lembrete pendente possui um endereço de e-mail válido.\n\nVerifique o cadastro dos tutores e tente novamente.'
      );

      return;
    }

    /*
     * Alguns possuem e-mail e outros não.
     */
    if (stats.semEmailValido > 0) {
      Alert.alert(
        'Atenção',
        `${stats.semEmailValido} lembrete(s) não possuem e-mail válido e não poderão ser enviados.\n\n` +
          `${stats.aptosParaEnvio} lembrete(s) possuem e-mail válido.\n\n` +
          'Deseja continuar?',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Continuar',
            onPress: executarEnvio,
          },
        ]
      );

      return;
    }

    /*
     * Todos os pendentes possuem e-mail.
     */
    Alert.alert(
      'Enviar lembretes',
      `Deseja enviar ${stats.aptosParaEnvio} lembrete(s) pendente(s) por e-mail?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Enviar',
          onPress: executarEnvio,
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator
          size="large"
          color="#1e3a8a"
        />

        <Text style={styles.loadingText}>
          Carregando lembretes...
        </Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>
          Erro ao carregar lembretes.
        </Text>

        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => refetch()}
        >
          <Text style={styles.retryText}>
            Tentar novamente
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderLembreteCard = ({
    item,
  }: {
    item: any;
  }) => {
    const enviado = isEnviado(item);

    const email = getEmail(item);

    const emailValido =
      isEmailValido(email);

    const animalNome =
      getAnimalNome(item);

    const tutorNome =
      getTutorNome(item);

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.titulo}>
            Lembrete #{item.id}
          </Text>

          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: enviado
                  ? '#10b981'
                  : '#f59e0b',
              },
            ]}
          >
            <Text style={styles.statusText}>
              {enviado
                ? 'ENVIADO'
                : 'PENDENTE'}
            </Text>
          </View>
        </View>

        <Text style={styles.info}>
          Animal: {animalNome}
        </Text>

        <Text style={styles.info}>
          Tutor: {tutorNome}
        </Text>

        <Text
          style={[
            styles.info,
            !emailValido &&
              styles.emailInvalido,
          ]}
        >
          E-mail:{' '}
          {emailValido
            ? email
            : `${email} ⚠️`}
        </Text>

        {!emailValido && !enviado && (
          <View
            style={
              styles.avisoEmailContainer
            }
          >
            <Text
              style={
                styles.avisoEmailTitulo
              }
            >
              ⚠️ E-mail inválido
            </Text>

            <Text
              style={
                styles.avisoEmailTexto
              }
            >
              Este lembrete não poderá ser
              enviado porque o tutor não
              possui um endereço de e-mail
              válido.
            </Text>
          </View>
        )}

        <Text style={styles.info}>
          Data de Envio:{' '}
          {item.dataEnvio
            ? new Date(
                item.dataEnvio
              ).toLocaleString('pt-BR')
            : '-'}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Lembretes
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>
            Total
          </Text>

          <Text
            style={[
              styles.statValue,
              {
                color: '#1e3a8a',
              },
            ]}
          >
            {stats.total}
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>
            Enviados
          </Text>

          <Text
            style={[
              styles.statValue,
              {
                color: '#10b981',
              },
            ]}
          >
            {stats.enviados}
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>
            Pendentes
          </Text>

          <Text
            style={[
              styles.statValue,
              {
                color: '#f59e0b',
              },
            ]}
          >
            {stats.pendentes}
          </Text>
        </View>
      </View>

      {stats.semEmailValido > 0 && (
        <View
          style={
            styles.resumoEmailInvalido
          }
        >
          <Text
            style={
              styles.resumoEmailTitulo
            }
          >
            ⚠️ Atenção
          </Text>

          <Text
            style={
              styles.resumoEmailTexto
            }
          >
            {stats.semEmailValido}{' '}
            lembrete(s) pendente(s) não
            possuem e-mail válido.
          </Text>

          <Text
            style={
              styles.resumoEmailTexto
            }
          >
            Aptos para envio:{' '}
            {stats.aptosParaEnvio}
          </Text>
        </View>
      )}

      <View style={styles.actionsContainer}>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              filtro === 'todos' &&
                styles.toggleButtonActive,
            ]}
            onPress={() =>
              setFiltro('todos')
            }
          >
            <Text
              style={[
                styles.toggleText,
                filtro === 'todos' &&
                  styles.toggleTextActive,
              ]}
            >
              Todos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toggleButton,
              filtro === 'pendentes' &&
                styles.toggleButtonActive,
            ]}
            onPress={() =>
              setFiltro('pendentes')
            }
          >
            <Text
              style={[
                styles.toggleText,
                filtro === 'pendentes' &&
                  styles.toggleTextActive,
              ]}
            >
              Pendentes
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.btnEnviarTodos,
            enviarTodos.isPending && {
              opacity: 0.7,
            },
          ]}
          onPress={handleEnviarTodos}
          disabled={
            enviarTodos.isPending
          }
        >
          {enviarTodos.isPending ? (
            <View
              style={
                styles.enviandoContainer
              }
            >
              <ActivityIndicator
                color="#fff"
              />

              <Text
                style={
                  styles.btnEnviarTodosText
                }
              >
                Enviando...
              </Text>
            </View>
          ) : (
            <Text
              style={
                styles.btnEnviarTodosText
              }
            >
              Enviar Todos Pendentes
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        data={lembretesFiltrados}
        keyExtractor={(item) =>
          String(item.id)
        }
        renderItem={renderLembreteCard}
        contentContainerStyle={
          styles.listContent
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {filtro === 'pendentes'
              ? 'Nenhum lembrete pendente.'
              : 'Nenhum lembrete cadastrado.'}
          </Text>
        }
        refreshing={isLoading}
        onRefresh={() => refetch()}
        extraData={filtro}
      />
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
    },

    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },

    loadingText: {
      marginTop: 10,
      color: '#666',
      fontSize: 14,
    },

    header: {
      backgroundColor: '#60a5fa',
      padding: 20,
    },

    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#fff',
      textAlign: 'center',
    },

    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: 15,
      paddingHorizontal: 10,
      backgroundColor: '#fff',
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },

    statCard: {
      flex: 1,
      alignItems: 'center',
      marginHorizontal: 5,
      paddingVertical: 10,
      backgroundColor: '#f9fafb',
      borderRadius: 10,
      elevation: 1,
    },

    statLabel: {
      fontSize: 12,
      color: '#666',
      marginBottom: 5,
    },

    statValue: {
      fontSize: 24,
      fontWeight: 'bold',
    },

    resumoEmailInvalido: {
      marginHorizontal: 15,
      marginTop: 15,
      backgroundColor: '#fff7ed',
      borderWidth: 1,
      borderColor: '#fdba74',
      borderRadius: 10,
      padding: 12,
    },

    resumoEmailTitulo: {
      color: '#c2410c',
      fontWeight: 'bold',
      fontSize: 14,
      marginBottom: 4,
    },

    resumoEmailTexto: {
      color: '#9a3412',
      fontSize: 13,
      marginBottom: 2,
    },

    actionsContainer: {
      padding: 15,
      gap: 10,
    },

    toggleContainer: {
      flexDirection: 'row',
      backgroundColor: '#e5e7eb',
      borderRadius: 10,
      padding: 4,
    },

    toggleButton: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 8,
      alignItems: 'center',
    },

    toggleButtonActive: {
      backgroundColor: '#fff',
      elevation: 2,
    },

    toggleText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#666',
    },

    toggleTextActive: {
      color: '#1e3a8a',
    },

    btnEnviarTodos: {
      backgroundColor: '#1e3a8a',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 50,
    },

    btnEnviarTodosText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 15,
    },

    enviandoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },

    listContent: {
      padding: 15,
      paddingBottom: 40,
    },

    card: {
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 15,
      marginBottom: 15,
      elevation: 3,
    },

    cardHeader: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },

    titulo: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
    },

    statusBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
    },

    statusText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: 'bold',
    },

    info: {
      fontSize: 14,
      color: '#666',
      marginBottom: 5,
    },

    emailInvalido: {
      color: '#dc2626',
      fontWeight: '600',
    },

    avisoEmailContainer: {
      marginTop: 5,
      marginBottom: 10,
      padding: 10,
      backgroundColor: '#fee2e2',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#fecaca',
    },

    avisoEmailTitulo: {
      color: '#991b1b',
      fontWeight: 'bold',
      fontSize: 13,
      marginBottom: 3,
    },

    avisoEmailTexto: {
      color: '#991b1b',
      fontSize: 12,
      lineHeight: 17,
    },

    emptyText: {
      textAlign: 'center',
      marginTop: 50,
      color: '#999',
    },

    errorText: {
      color: '#ef4444',
      fontSize: 16,
      marginBottom: 15,
      textAlign: 'center',
    },

    retryButton: {
      backgroundColor: '#1e3a8a',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
    },

    retryText: {
      color: '#fff',
      fontWeight: 'bold',
    },
  });