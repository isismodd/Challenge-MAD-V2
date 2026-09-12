import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  useConsulta,
  useCancelarConsulta,
  useFinalizarConsulta,
} from '../../hooks/useConsultas';

export default function DetalhesConsultaScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const consultaId = route.params?.id;

  const { data: consulta, isLoading, isError, refetch } = useConsulta(consultaId);
  const cancelarConsulta = useCancelarConsulta();
  const finalizarConsulta = useFinalizarConsulta();

  const handleCancelar = () => {
    if (!consulta) return;
    Alert.alert('Cancelar Consulta', 'Deseja realmente cancelar esta consulta?', [
      { text: 'Não', style: 'cancel' },
      {
        text: 'Sim',
        style: 'destructive',
        onPress: () =>
          cancelarConsulta.mutate(consulta, {
            onSuccess: () => {
              Alert.alert('Sucesso', 'Consulta cancelada!');
              navigation.goBack();
            },
            onError: () => Alert.alert('Erro', 'Não foi possível cancelar.'),
          }),
      },
    ]);
  };

  const handleFinalizar = () => {
    if (!consulta) return;
    Alert.alert('Finalizar Consulta', 'Marcar esta consulta como realizada?', [
      { text: 'Não', style: 'cancel' },
      {
        text: 'Sim',
        onPress: () =>
          finalizarConsulta.mutate(consulta, {
            onSuccess: () => {
              Alert.alert('Sucesso', 'Consulta finalizada!');
              navigation.goBack();
            },
            onError: () => Alert.alert('Erro', 'Não foi possível finalizar.'),
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

  if (isError || !consulta) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Erro ao carregar detalhes.</Text>
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

  const formatarData = (data: string) => {
    if (!data) return '-';
    return new Date(data).toLocaleString('pt-BR');
  };

  const Linha = ({ label, valor }: { label: string; valor: any }) => (
    <View style={styles.linha}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.valor}>{valor || '-'}</Text>
    </View>
  );

  const agendada = consulta.status === 'AGENDADA';

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Detalhes da Consulta</Text>

      <View style={styles.card}>
        <Linha label="ID" valor={consulta.id} />
        <Linha label="Animal" valor={consulta.animalNome} />
        <Linha label="Veterinário" valor={consulta.veterinarioNome} />
        <Linha label="Data e Hora" valor={formatarData(consulta.dataHora)} />

        <View style={styles.linha}>
          <Text style={styles.label}>Status</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(consulta.status) }]}>
            <Text style={styles.statusText}>{consulta.status}</Text>
          </View>
        </View>

        <Linha label="Motivo" valor={consulta.motivo} />
        <Linha label="Diagnóstico" valor={consulta.diagnostico} />
        <Linha label="Prescrição" valor={consulta.prescricao} />
      </View>

      {/* Botões de ação */}
      <View style={styles.actions}>
        {agendada && (
          <TouchableOpacity style={styles.btnFinalizar} onPress={handleFinalizar}>
            <Text style={styles.btnText}>✅ Finalizar</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.btnEditar}
          onPress={() => navigation.navigate('EditarConsulta', { id: consulta.id })}
        >
          <Text style={styles.btnText}>✏️ Editar</Text>
        </TouchableOpacity>

        {agendada && (
          <TouchableOpacity style={styles.btnCancelar} onPress={handleCancelar}>
            <Text style={styles.btnText}>❌ Cancelar</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity style={styles.btnVoltar} onPress={() => navigation.goBack()}>
        <Text style={styles.btnVoltarText}>← Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1e3a8a', marginBottom: 20, textAlign: 'center' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 15, elevation: 3, marginBottom: 20 },
  linha: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#eee', paddingVertical: 10, alignItems: 'center' },
  label: { flex: 1, fontWeight: 'bold', color: '#333' },
  valor: { flex: 2, color: '#555' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 12 },
  statusText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  actions: { flexDirection: 'row', gap: 10, marginBottom: 15 },
  btnFinalizar: { backgroundColor: '#10b981', padding: 15, borderRadius: 8, flex: 1, alignItems: 'center' },
  btnEditar: { backgroundColor: '#f59e0b', padding: 15, borderRadius: 8, flex: 1, alignItems: 'center' },
  btnCancelar: { backgroundColor: '#ef4444', padding: 15, borderRadius: 8, flex: 1, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  btnVoltar: { padding: 15, alignItems: 'center', marginBottom: 30 },
  btnVoltarText: { color: '#1e3a8a', fontWeight: 'bold', fontSize: 16 },
  errorText: { color: '#ef4444', fontSize: 16, marginBottom: 10 },
  retryText: { color: '#1e3a8a', fontWeight: 'bold' },
});