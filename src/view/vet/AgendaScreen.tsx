import React from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ActivityIndicator, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useConsultas, useDeletarConsulta } from '../../hooks/useConsultas';

export default function AgendaScreen() {
  const navigation = useNavigation<any>();
  const { data: consultas, isLoading, isError, refetch } = useConsultas();
  const deletarConsulta = useDeletarConsulta();

  const handleDeletar = (id: string) => {
    Alert.alert('Cancelar Consulta', 'Deseja realmente cancelar?', [
      { text: 'Não', style: 'cancel' },
      {
        text: 'Sim',
        style: 'destructive',
        onPress: () => deletarConsulta.mutate(id, {
          onSuccess: () => Alert.alert('Sucesso', 'Consulta cancelada!'),
        }),
      },
    ]);
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
        <Text style={styles.errorText}>Erro ao carregar consultas.</Text>
        <TouchableOpacity onPress={() => refetch()}>
          <Text style={styles.retryText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AGENDADA': return '#f59e0b';
      case 'REALIZADA': return '#10b981';
      case 'CANCELADA': return '#ef4444';
      default: return '#999';
    }
  };

  const renderConsultaCard = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Text style={styles.animalNome}>{item.animalNome || 'Animal'}</Text>
      <Text style={styles.info}>👤 {item.veterinarioNome || 'Veterinário'}</Text>
      <Text style={styles.info}>
        📅 {item.dataHora ? new Date(item.dataHora).toLocaleString('pt-BR') : '-'}
      </Text>
      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
        <Text style={styles.statusText}>{item.status}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.btnEditar}
          onPress={() => navigation.navigate('EditarConsulta', { id: item.id })}
        >
          <Text style={styles.btnText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnExcluir} onPress={() => handleDeletar(item.id)}>
          <Text style={styles.btnText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📅 Consultas</Text>
      </View>
      <FlatList
        data={consultas}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderConsultaCard}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma consulta agendada.</Text>}
        refreshing={isLoading}
        onRefresh={refetch}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('NovaConsulta')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { backgroundColor: '#60a5fa', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  listContent: { padding: 15 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 15, elevation: 3 },
  animalNome: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  info: { fontSize: 14, color: '#666', marginBottom: 3 },
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginTop: 5 },
  statusText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  actions: { flexDirection: 'row', gap: 10, marginTop: 10 },
  btnEditar: { backgroundColor: '#f59e0b', padding: 8, borderRadius: 8, flex: 1, alignItems: 'center' },
  btnExcluir: { backgroundColor: '#ef4444', padding: 8, borderRadius: 8, flex: 1, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#999' },
  errorText: { color: '#ef4444', fontSize: 16, marginBottom: 10 },
  retryText: { color: '#1e3a8a', fontWeight: 'bold' },
  fab: { position: 'absolute', right: 20, bottom: 20, backgroundColor: '#1e3a8a', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  fabText: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
});