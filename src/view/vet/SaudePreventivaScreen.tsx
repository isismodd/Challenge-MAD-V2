import React from 'react';
import {
  View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity,
} from 'react-native';
import { useLembretes } from '../../hooks/useLembretes';

export default function SaudePreventivaScreen() {
  const { data: lembretes, isLoading, isError, refetch } = useLembretes();

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

  const renderLembreteCard = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Text style={styles.titulo}>Lembrete #{item.id}</Text>
      <Text style={styles.info}>🐾 Animal: {item.animalNome || '-'}</Text>
      <Text style={styles.info}>👤 Tutor: {item.tutorNome || '-'}</Text>
      <Text style={styles.info}>📧 {item.tutorEmail || '-'}</Text>
      <Text style={styles.info}>
        📅 {item.dataEnvio ? new Date(item.dataEnvio).toLocaleString('pt-BR') : '-'}
      </Text>
      <View style={[styles.statusBadge, { backgroundColor: item.enviado ? '#10b981' : '#f59e0b' }]}>
        <Text style={styles.statusText}>{item.enviado ? 'Enviado' : 'Pendente'}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🔔 Lembretes</Text>
      </View>
      <FlatList
        data={lembretes}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderLembreteCard}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhum lembrete cadastrado.</Text>}
        refreshing={isLoading}
        onRefresh={refetch}
      />
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
  titulo: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  info: { fontSize: 14, color: '#666', marginBottom: 3 },
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginTop: 5 },
  statusText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#999' },
  errorText: { color: '#ef4444', fontSize: 16, marginBottom: 10 },
  retryText: { color: '#1e3a8a', fontWeight: 'bold' },
});