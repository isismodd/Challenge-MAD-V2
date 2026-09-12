import React from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ActivityIndicator, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  useConsultas,
  useCancelarConsulta,
  useFinalizarConsulta,
  useEnviarLembrete,
} from '../../hooks/useConsultas';


export default function AgendaScreen() {
  const navigation = useNavigation<any>();
  const { data: consultasData, isLoading, isError, refetch } = useConsultas();
  const cancelarConsulta = useCancelarConsulta();
  const finalizarConsulta = useFinalizarConsulta();
  const enviarLembrete = useEnviarLembrete();

  const consultas = Array.isArray(consultasData) ? consultasData : [];

  const handleCancelar = (consulta: any) => {
    Alert.alert('Cancelar Consulta', 'Deseja realmente cancelar?', [
      { text: 'Não', style: 'cancel' },
      {
        text: 'Sim',
        style: 'destructive',
        onPress: () =>
          cancelarConsulta.mutate(consulta, {
            onSuccess: () => { Alert.alert('Sucesso', 'Consulta cancelada!'); refetch(); },
            onError: () => Alert.alert('Erro', 'Não foi possível cancelar.'),
          }),
      },
    ]);
  };

  const handleFinalizar = (consulta: any) => {
    Alert.alert('Finalizar Consulta', 'Marcar como realizada?', [
      { text: 'Não', style: 'cancel' },
      {
        text: 'Sim',
        onPress: () =>
          finalizarConsulta.mutate(consulta, {
            onSuccess: () => { Alert.alert('Sucesso', 'Consulta finalizada!'); refetch(); },
            onError: () => Alert.alert('Erro', 'Não foi possível finalizar.'),
          }),
      },
    ]);
  };

  const handleEnviarLembrete = (id: string) => {
    Alert.alert('Enviar Lembrete', 'Enviar lembrete ao tutor por e-mail?', [
      { text: 'Não', style: 'cancel' },
      {
        text: 'Enviar',
        onPress: () =>
          enviarLembrete.mutate(id, {
            onSuccess: () => Alert.alert('Sucesso', 'Lembrete enviado!'),
            onError: () => Alert.alert('Erro', 'Não foi possível enviar o lembrete.'),
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

  const renderConsultaCard = ({ item }: { item: any }) => {
    const agendada = item.status === 'AGENDADA';

    return (
      <View style={styles.card}>
        <Text style={styles.animalNome}>{item.animalNome || 'Animal'}</Text>
        <Text style={styles.info}>Veterinário: {item.veterinarioNome || 'Veterinário'}</Text>
        <Text style={styles.info}>
          Data e hora: {item.dataHora ? new Date(item.dataHora).toLocaleString('pt-BR') : '-'}
        </Text>

        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.btnVisualizar}
            onPress={() => navigation.navigate('DetalhesConsulta', { id: item.id })}
          >
            <Text style={styles.btnIcon}>Detalhes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnEditar}
            onPress={() => navigation.navigate('EditarConsulta', { id: item.id })}
          >
            <Text style={styles.btnIcon}>Editar</Text>
          </TouchableOpacity>

         

          {agendada && (
            <TouchableOpacity
              style={styles.btnLembrete}
              onPress={() => handleEnviarLembrete(item.id)}
            >
              <Text style={styles.btnIcon}>Lembrete</Text>
            </TouchableOpacity>
          )}

{agendada && (
            <TouchableOpacity
              style={styles.btnFinalizar}
              onPress={() => handleFinalizar(item)}
            >
              <Text style={styles.btnIcon}>Finalizar</Text>
            </TouchableOpacity>
          )}

           {agendada && (
            <TouchableOpacity
              style={styles.btnCancelar}
              onPress={() => handleCancelar(item)}
            >
              <Text style={styles.btnIcon}>Cancelar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Consultas</Text>
      </View>

      <TouchableOpacity
        style={styles.btnAdicionar}
        onPress={() => navigation.navigate('NovaConsulta')}
      >
        <Text style={styles.btnAdicionarText}>+ Nova Consulta</Text>
      </TouchableOpacity>

      <FlatList
        data={consultas}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderConsultaCard}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma consulta agendada.</Text>}
        refreshing={isLoading}
        onRefresh={refetch}
        extraData={consultas}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { backgroundColor: '#60a5fa', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
  btnAdicionar: { backgroundColor: '#1e3a8a', padding: 15, marginHorizontal: 15, marginTop: 15, borderRadius: 8, alignItems: 'center' },
  btnAdicionarText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  listContent: { padding: 15 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 15, elevation: 3 },
  animalNome: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  info: { fontSize: 14, color: '#666', marginBottom: 3 },
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginTop: 5 },
  statusText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  actions: { flexDirection: 'row', gap: 8, marginTop: 12, justifyContent: 'space-between' },
  btnVisualizar: { backgroundColor: '#3b82f6', padding: 10, borderRadius: 8, flex: 1, alignItems: 'center' },
  btnEditar: { backgroundColor: '#3b82f6', padding: 10, borderRadius: 8, flex: 1, alignItems: 'center' },
  btnCancelar: { backgroundColor: '#1e3a8a', padding: 10, borderRadius: 8, flex: 1, alignItems: 'center' },
  btnFinalizar: { backgroundColor: '#1e3a8a', padding: 10, borderRadius: 8, flex: 1, alignItems: 'center' },
  btnLembrete: { backgroundColor: '#3b82f6', padding: 10, borderRadius: 8, flex: 1, alignItems: 'center' },
  btnIcon: { fontSize: 18 },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#999' },
  errorText: { color: '#ef4444', fontSize: 16, marginBottom: 10 },
  retryText: { color: '#1e3a8a', fontWeight: 'bold' },
});