import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ActivityIndicator, Alert,
} from 'react-native';
import { useLembretes, useEnviarTodosPendentes } from '../../hooks/useLembretes';

type Filtro = 'todos' | 'pendentes';

export default function SaudePreventivaScreen() {
  const { data: lembretesData, isLoading, isError, refetch } = useLembretes();
  const enviarTodos = useEnviarTodosPendentes();

  const [filtro, setFiltro] = useState<Filtro>('todos');

  const lembretes = Array.isArray(lembretesData) ? lembretesData : [];

  React.useEffect(() => {
    if (lembretes.length > 0) {
      console.log('EXEMPLO DE LEMBRETE:', JSON.stringify(lembretes[0], null, 2));
    }
  }, [lembretes]);

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
    const valor = item.enviado ?? item.enviadoFlag ?? item.status;
    return valor === true || valor === 1 || valor === 'S' || valor === 'ENVIADO';
  };

  const stats = useMemo(() => {
    const total = lembretes.length;
    const enviados = lembretes.filter((l: any) => isEnviado(l)).length;
    const pendentes = total - enviados;
    return { total, enviados, pendentes };
  }, [lembretes]);

  const lembretesFiltrados = useMemo(() => {
    if (filtro === 'pendentes') {
      return lembretes.filter((l: any) => !isEnviado(l));
    }
    return lembretes;
  }, [lembretes, filtro]);

  const handleEnviarTodos = () => {
    if (stats.pendentes === 0) {
      Alert.alert('Aviso', 'Não há lembretes pendentes para enviar.');
      return;
    }

    Alert.alert(
      'Enviar Todos Pendentes',
      `Deseja enviar ${stats.pendentes} lembrete(s) pendente(s) por e-mail?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Enviar',
          onPress: () =>
            enviarTodos.mutate(undefined, {
              onSuccess: () => {
                Alert.alert('Sucesso', 'Lembretes enviados!');
                refetch();
              },
              onError: () => Alert.alert('Erro', 'Não foi possível enviar os lembretes.'),
            }),
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1e3a8a" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Erro ao carregar lembretes.</Text>
        <TouchableOpacity onPress={() => refetch()}>
          <Text style={styles.retryText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderLembreteCard = ({ item }: { item: any }) => {
    const enviado = isEnviado(item);
    const email = getEmail(item);
    const animalNome = getAnimalNome(item);
    const tutorNome = getTutorNome(item);

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.titulo}>Lembrete #{item.id}</Text>
          <View style={[styles.statusBadge, { backgroundColor: enviado ? '#10b981' : '#f59e0b' }]}>
            <Text style={styles.statusText}>
              {enviado ? 'Enviado' : 'Pendente'}
            </Text>
          </View>
        </View>

        <Text style={styles.info}>Animal: {animalNome}</Text>
        <Text style={styles.info}>Tutor: {tutorNome}</Text>
        <Text style={styles.info}>E-mail: {email}</Text>
        <Text style={styles.info}>
          Data de Envio: {item.dataEnvio ? new Date(item.dataEnvio).toLocaleString('pt-BR') : '-'}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Lembretes</Text>
      </View>

      {}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total</Text>
          <Text style={[styles.statValue, { color: '#1e3a8a' }]}>{stats.total}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Enviados</Text>
          <Text style={[styles.statValue, { color: '#10b981' }]}>{stats.enviados}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Pendentes</Text>
          <Text style={[styles.statValue, { color: '#f59e0b' }]}>{stats.pendentes}</Text>
        </View>
      </View>

      {}
      <View style={styles.actionsContainer}>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, filtro === 'todos' && styles.toggleButtonActive]}
            onPress={() => setFiltro('todos')}
          >
            <Text style={[styles.toggleText, filtro === 'todos' && styles.toggleTextActive]}>
              Todos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, filtro === 'pendentes' && styles.toggleButtonActive]}
            onPress={() => setFiltro('pendentes')}
          >
            <Text style={[styles.toggleText, filtro === 'pendentes' && styles.toggleTextActive]}>
              Pendentes
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.btnEnviarTodos, enviarTodos.isPending && { opacity: 0.7 }]}
          onPress={handleEnviarTodos}
          disabled={enviarTodos.isPending}
        >
          {enviarTodos.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnEnviarTodosText}>Enviar Todos Pendentes</Text>
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        data={lembretesFiltrados}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderLembreteCard}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {filtro === 'pendentes'
              ? 'Nenhum lembrete pendente.'
              : 'Nenhum lembrete cadastrado.'}
          </Text>
        }
        refreshing={isLoading}
        onRefresh={refetch}
        extraData={filtro}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { backgroundColor: '#60a5fa', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', textAlign: 'center' },

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
    flex: 1, alignItems: 'center', marginHorizontal: 5, paddingVertical: 10,
    backgroundColor: '#f9fafb', borderRadius: 10, elevation: 1,
  },
  statLabel: { fontSize: 12, color: '#666', marginBottom: 5 },
  statValue: { fontSize: 24, fontWeight: 'bold' },

  actionsContainer: { padding: 15, gap: 10 },
  toggleContainer: { flexDirection: 'row', backgroundColor: '#e5e7eb', borderRadius: 10, padding: 4 },
  toggleButton: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  toggleButtonActive: { backgroundColor: '#fff', elevation: 2 },
  toggleText: { fontSize: 14, fontWeight: '600', color: '#666' },
  toggleTextActive: { color: '#1e3a8a' },

  btnEnviarTodos: { backgroundColor: '#1e3a8a', padding: 15, borderRadius: 10, alignItems: 'center' },
  btnEnviarTodosText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },

  listContent: { padding: 15 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 15, elevation: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  titulo: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  info: { fontSize: 14, color: '#666', marginBottom: 3 },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#999' },
  errorText: { color: '#ef4444', fontSize: 16, marginBottom: 10 },
  retryText: { color: '#1e3a8a', fontWeight: 'bold' },
});