// src/view/vet/AgendaScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { Consulta, mockConsultas } from '../../model';

type NovaConsulta = {
  animalNome: string;
  tutorNome: string;
  data: string;
  horario: string;
  observacoes: string;
};

export default function AgendaScreen() {
  const [consultas, setConsultas] = useState<Consulta[]>(mockConsultas);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [novaConsulta, setNovaConsulta] = useState<NovaConsulta>({
    animalNome: '',
    tutorNome: '',
    data: '',
    horario: '',
    observacoes: '',
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendada': return '#FF9800';
      case 'realizada': return '#4CAF50';
      case 'cancelada': return '#f44336';
      default: return '#999';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'agendada': return '📅';
      case 'realizada': return '✅';
      case 'cancelada': return '❌';
      default: return '📝';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'agendada': return 'Agendada';
      case 'realizada': return 'Realizada';
      case 'cancelada': return 'Cancelada';
      default: return status;
    }
  };

  const consultasFiltradas = consultas.filter(consulta => consulta.data === selectedDate);

  const handleCancelarConsulta = (consulta: Consulta) => {
    Alert.alert(
      'Cancelar Consulta',
      `Tem certeza que deseja cancelar a consulta de ${consulta.animalNome}?`,
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim',
          style: 'destructive',
          onPress: () => {
            setConsultas(prev =>
              prev.map(c =>
                c.id === consulta.id ? { ...c, status: 'cancelada' } : c
              )
            );
            Alert.alert('Sucesso', 'Consulta cancelada!');
          },
        },
      ]
    );
  };

  const handleRealizarConsulta = (consulta: Consulta) => {
    Alert.alert(
      'Realizar Consulta',
      `Marcar consulta de ${consulta.animalNome} como realizada?`,
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim',
          onPress: () => {
            setConsultas(prev =>
              prev.map(c =>
                c.id === consulta.id ? { ...c, status: 'realizada' } : c
              )
            );
            Alert.alert('Sucesso', 'Consulta realizada!');
          },
        },
      ]
    );
  };

  const handleAdicionarConsulta = () => {
    if (!novaConsulta.animalNome || !novaConsulta.tutorNome || !novaConsulta.data || !novaConsulta.horario) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    const nova: Consulta = {
      id: Date.now().toString(),
      animalId: Date.now().toString(),
      animalNome: novaConsulta.animalNome,
      animalEspecie: 'outro',
      tutorId: Date.now().toString(),
      tutorNome: novaConsulta.tutorNome,
      veterinarioId: '1',
      veterinarioNome: 'Dr. Carlos Silva',
      data: novaConsulta.data,
      horario: novaConsulta.horario,
      status: 'agendada',
      observacoes: novaConsulta.observacoes,
    };

    setConsultas([...consultas, nova]);
    setModalVisible(false);
    setNovaConsulta({
      animalNome: '',
      tutorNome: '',
      data: '',
      horario: '',
      observacoes: '',
    });
    Alert.alert('Sucesso', 'Consulta agendada!');
  };

  const renderConsultaCard = ({ item }: { item: Consulta }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <Text style={styles.horario}>⏰ {item.horario}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>
              {getStatusIcon(item.status)} {getStatusText(item.status)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.animalNome}>{item.animalNome}</Text>
        <Text style={styles.tutorNome}>👤 Tutor: {item.tutorNome}</Text>
        {item.observacoes && (
          <Text style={styles.observacoes}>📝 {item.observacoes}</Text>
        )}
      </View>

      {item.status === 'agendada' && (
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.realizarButton]}
            onPress={() => handleRealizarConsulta(item)}
          >
            <Text style={styles.actionButtonText}>✅ Realizar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.cancelarButton]}
            onPress={() => handleCancelarConsulta(item)}
          >
            <Text style={styles.actionButtonText}>❌ Cancelar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📅 Agenda</Text>
        <Text style={styles.subtitle}>Gerencie suas consultas</Text>
      </View>

      <View style={styles.dateSelector}>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => {
            const hoje = new Date();
            const ontem = new Date(hoje);
            ontem.setDate(hoje.getDate() - 1);
            setSelectedDate(ontem.toISOString().split('T')[0]);
          }}
        >
          <Text style={styles.dateButtonText}>◀ Dia anterior</Text>
        </TouchableOpacity>
        
        <View style={styles.dateDisplay}>
          <Text style={styles.dateDisplayText}>
            {selectedDate.split('-').reverse().join('/')}
          </Text>
        </View>
        
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => {
            const hoje = new Date();
            const amanha = new Date(hoje);
            amanha.setDate(hoje.getDate() + 1);
            setSelectedDate(amanha.toISOString().split('T')[0]);
          }}
        >
          <Text style={styles.dateButtonText}>Próximo dia ▶</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.novaConsultaButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.novaConsultaButtonText}>+ Nova Consulta</Text>
      </TouchableOpacity>

      <FlatList
        data={consultasFiltradas}
        keyExtractor={(item) => item.id}
        renderItem={renderConsultaCard}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyText}>Nenhuma consulta agendada para este dia</Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.emptyButtonText}>Agendar primeira consulta</Text>
            </TouchableOpacity>
          </View>
        }
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>📝 Nova Consulta</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>Nome do Pet *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Thor"
                value={novaConsulta.animalNome}
                onChangeText={(text) => setNovaConsulta({ ...novaConsulta, animalNome: text })}
              />

              <Text style={styles.inputLabel}>Nome do Tutor *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Ana Souza"
                value={novaConsulta.tutorNome}
                onChangeText={(text) => setNovaConsulta({ ...novaConsulta, tutorNome: text })}
              />

              <View style={styles.row}>
                <View style={styles.rowItem}>
                  <Text style={styles.inputLabel}>Data *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="DD/MM/AAAA"
                    value={novaConsulta.data}
                    onChangeText={(text) => setNovaConsulta({ ...novaConsulta, data: text })}
                  />
                </View>
                <View style={styles.rowItem}>
                  <Text style={styles.inputLabel}>Horário *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="HH:MM"
                    value={novaConsulta.horario}
                    onChangeText={(text) => setNovaConsulta({ ...novaConsulta, horario: text })}
                  />
                </View>
              </View>

              <Text style={styles.inputLabel}>Observações</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Ex: Vacinação, retorno, etc."
                value={novaConsulta.observacoes}
                onChangeText={(text) => setNovaConsulta({ ...novaConsulta, observacoes: text })}
                multiline
                numberOfLines={3}
              />

              <TouchableOpacity style={styles.salvarButton} onPress={handleAdicionarConsulta}>
                <Text style={styles.salvarButtonText}>Agendar Consulta</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#FF9800', padding: 20, paddingTop: 20, paddingBottom: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: 14, color: '#fff', opacity: 0.9, marginTop: 5 },
  dateSelector: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  dateButton: { paddingHorizontal: 15, paddingVertical: 8, backgroundColor: '#f0f0f0', borderRadius: 8 },
  dateButtonText: { fontSize: 12, color: '#666' },
  dateDisplay: { backgroundColor: '#FF9800', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 8 },
  dateDisplayText: { fontSize: 14, fontWeight: 'bold', color: '#fff' },
  novaConsultaButton: { backgroundColor: '#4CAF50', margin: 15, padding: 12, borderRadius: 8, alignItems: 'center' },
  novaConsultaButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  listContent: { padding: 15 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  horario: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 12, color: '#fff', fontWeight: 'bold' },
  cardBody: { borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 10, marginTop: 5 },
  animalNome: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  tutorNome: { fontSize: 14, color: '#666', marginBottom: 4 },
  observacoes: { fontSize: 13, color: '#999', marginTop: 5, fontStyle: 'italic' },
  cardActions: { flexDirection: 'row', gap: 10, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#eee' },
  actionButton: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  realizarButton: { backgroundColor: '#4CAF50' },
  cancelarButton: { backgroundColor: '#f44336' },
  actionButtonText: { color: '#fff', fontWeight: 'bold' },
  emptyContainer: { alignItems: 'center', padding: 40 },
  emptyIcon: { fontSize: 48, marginBottom: 10 },
  emptyText: { fontSize: 16, color: '#999', textAlign: 'center' },
  emptyButton: { marginTop: 20, backgroundColor: '#FF9800', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  emptyButtonText: { color: '#fff', fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { backgroundColor: '#fff', borderRadius: 20, padding: 20, width: '90%', maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  modalClose: { fontSize: 24, color: '#999' },
  inputLabel: { fontSize: 14, fontWeight: '500', color: '#555', marginBottom: 5, marginTop: 10 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: '#fafafa' },
  textArea: { height: 80, textAlignVertical: 'top' },
  row: { flexDirection: 'row', gap: 15 },
  rowItem: { flex: 1 },
  salvarButton: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 20, marginBottom: 10 },
  salvarButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});