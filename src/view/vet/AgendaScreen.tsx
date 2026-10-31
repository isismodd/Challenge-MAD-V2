import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useConsultas, useCancelarConsulta, useFinalizarConsulta, useEnviarLembrete } from '../../hooks/useConsultas';
import { useTheme } from '../../control/ThemeContext';

export default function AgendaScreen() {
  const navigation = useNavigation<any>();
  const { data: consultasData, isLoading, isError, refetch } = useConsultas();
  const cancelarConsulta = useCancelarConsulta();
  const finalizarConsulta = useFinalizarConsulta();
  const enviarLembrete = useEnviarLembrete();
  const { colors } = useTheme();

  const consultas = Array.isArray(consultasData) ? consultasData : [];

  const handleCancelar = (consulta: any) => {
    Alert.alert('Cancelar Consulta', 'Deseja realmente cancelar?', [
      { text: 'Não', style: 'cancel' },
      {
        text: 'Sim',
        style: 'destructive',
        onPress: () => cancelarConsulta.mutate(consulta, {
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
        onPress: () => finalizarConsulta.mutate(consulta, {
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
        onPress: () => enviarLembrete.mutate(id, {
          onSuccess: () => Alert.alert('Sucesso', 'Lembrete enviado!'),
          onError: () => Alert.alert('Erro', 'Não foi possível enviar o lembrete.'),
        }),
      },
    ]);
  };

  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: '#ef4444' }]}>Erro ao carregar consultas.</Text>
        <TouchableOpacity onPress={() => refetch()}>
          <Text style={[styles.retryText, { color: colors.primary }]}>Tentar novamente</Text>
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
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.animalNome, { color: colors.text }]}>{item.animalNome || 'Animal'}</Text>
        <Text style={[styles.info, { color: colors.textSecondary }]}>Veterinário: {item.veterinarioNome || 'Veterinário'}</Text>
        <Text style={[styles.info, { color: colors.textSecondary }]}>
          Data e hora: {item.dataHora ? new Date(item.dataHora).toLocaleString('pt-BR') : '-'}
        </Text>

        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={[styles.btnVisualizar, { backgroundColor: colors.primary }]} onPress={() => navigation.navigate('DetalhesConsulta', { id: item.id })}>
            <Text style={styles.btnText}>Detalhes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btnEditar, { backgroundColor: colors.primary }]} onPress={() => navigation.navigate('EditarConsulta', { id: item.id })}>
            <Text style={styles.btnText}>Editar</Text>
          </TouchableOpacity>
          {agendada && (
            <TouchableOpacity style={[styles.btnLembrete, { backgroundColor: colors.primary }]} onPress={() => handleEnviarLembrete(item.id)}>
              <Text style={styles.btnText}>Lembrete</Text>
            </TouchableOpacity>
          )}
        </View>

        {agendada && (
          <View style={styles.actionsRow}>
            <TouchableOpacity style={[styles.btnFinalizar, { backgroundColor: colors.button }]} onPress={() => handleFinalizar(item)}>
              <Text style={[styles.btnText, { color: colors.buttonText }]}>Finalizar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btnCancelar, { backgroundColor: colors.button }]} onPress={() => handleCancelar(item)}>
              <Text style={[styles.btnText, { color: colors.buttonText }]}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.header }]}>
        <Text style={styles.title}>Consultas</Text>
      </View>

      <TouchableOpacity style={[styles.btnAdicionar, { backgroundColor: colors.primary }]} onPress={() => navigation.navigate('NovaConsulta')}>
        <Text style={styles.btnAdicionarText}>+ Nova Consulta</Text>
      </TouchableOpacity>

      <FlatList
        data={consultas}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderConsultaCard}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={[styles.emptyText, { color: colors.textSecondary }]}>Nenhuma consulta agendada.</Text>}
        refreshing={isLoading}
        onRefresh={refetch}
        extraData={consultas}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
  btnAdicionar: { padding: 15, marginHorizontal: 15, marginTop: 15, borderRadius: 8, alignItems: 'center' },
  btnAdicionarText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  listContent: { padding: 15 },
  card: { borderRadius: 12, padding: 15, marginBottom: 15, elevation: 3 },
  animalNome: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  info: { fontSize: 14, marginBottom: 3 },
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginTop: 5 },
  statusText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  actionsRow: { flexDirection: 'row', gap: 8, marginTop: 10, justifyContent: 'space-between' },
  btnVisualizar: { padding: 10, borderRadius: 8, flex: 1, alignItems: 'center' },
  btnEditar: { padding: 10, borderRadius: 8, flex: 1, alignItems: 'center' },
  btnLembrete: { padding: 10, borderRadius: 8, flex: 1, alignItems: 'center' },
  btnFinalizar: { padding: 10, borderRadius: 8, flex: 1, alignItems: 'center' },
  btnCancelar: { padding: 10, borderRadius: 8, flex: 1, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  emptyText: { textAlign: 'center', marginTop: 50 },
  errorText: { fontSize: 16, marginBottom: 10 },
  retryText: { fontWeight: 'bold' },
});