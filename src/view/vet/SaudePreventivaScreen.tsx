// src/view/vet/SaudePreventivaScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';

type Lembrete = {
  id: string;
  tipo: 'vacina' | 'vermifugo' | 'checkup' | 'protocolo';
  titulo: string;
  descricao: string;
  animalNome: string;
  animalId: string;
  tutorNome: string;
  dataVencimento: string;
  status: 'pendente' | 'emDia' | 'atrasado';
  prioridade: 'alta' | 'media' | 'baixa';
  especieRecomendada?: string[];
  racaRecomendada?: string[];
};

const mockLembretes: Lembrete[] = [
  {
    id: '1',
    tipo: 'vacina',
    titulo: 'Vacina Antirrábica',
    descricao: 'Vacinação anual contra raiva - obrigatória',
    animalNome: 'Thor',
    animalId: '1',
    tutorNome: 'Ana Souza',
    dataVencimento: '2025-08-15',
    status: 'pendente',
    prioridade: 'alta',
  },
  {
    id: '2',
    tipo: 'vacina',
    titulo: 'Vacina V10',
    descricao: 'Proteção contra doenças virais em cães',
    animalNome: 'Thor',
    animalId: '1',
    tutorNome: 'Ana Souza',
    dataVencimento: '2025-09-10',
    status: 'pendente',
    prioridade: 'alta',
  },
  {
    id: '3',
    tipo: 'vermifugo',
    titulo: 'Vermifugação',
    descricao: 'Controle de parasitas internos',
    animalNome: 'Luna',
    animalId: '2',
    tutorNome: 'Ana Souza',
    dataVencimento: '2025-07-01',
    status: 'atrasado',
    prioridade: 'alta',
  },
  {
    id: '4',
    tipo: 'checkup',
    titulo: 'Check-up Anual',
    descricao: 'Exame clínico completo e exames de sangue',
    animalNome: 'Rex',
    animalId: '3',
    tutorNome: 'Carlos Mendes',
    dataVencimento: '2025-10-20',
    status: 'pendente',
    prioridade: 'media',
  },
];

export default function SaudePreventivaScreen() {
  const [lembretes, setLembretes] = useState<Lembrete[]>(mockLembretes);
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'vacina': return '💉';
      case 'vermifugo': return '🐛';
      case 'checkup': return '🏥';
      case 'protocolo': return '📋';
      default: return '📌';
    }
  };

  const getTipoCor = (tipo: string) => {
    switch (tipo) {
      case 'vacina': return '#4CAF50';
      case 'vermifugo': return '#FF9800';
      case 'checkup': return '#2196F3';
      case 'protocolo': return '#9C27B0';
      default: return '#666';
    }
  };

  const getStatusCor = (status: string) => {
    switch (status) {
      case 'pendente': return '#FF9800';
      case 'emDia': return '#4CAF50';
      case 'atrasado': return '#f44336';
      default: return '#999';
    }
  };

  const getStatusTexto = (status: string) => {
    switch (status) {
      case 'pendente': return '⏳ Pendente';
      case 'emDia': return '✅ Em dia';
      case 'atrasado': return '⚠️ Atrasado';
      default: return status;
    }
  };

  const formatarData = (dataISO: string) => {
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR');
  };

  const handleMarcarRealizado = (lembrete: Lembrete) => {
    Alert.alert(
      'Marcar como Realizado',
      `Confirmar que "${lembrete.titulo}" foi realizado para ${lembrete.animalNome}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: () => {
            setLembretes(prev =>
              prev.map(l =>
                l.id === lembrete.id ? { ...l, status: 'emDia' } : l
              )
            );
            Alert.alert('Sucesso', 'Lembrete marcado como realizado!');
          },
        },
      ]
    );
  };

  const handleEnviarNotificacao = (lembrete: Lembrete) => {
    Alert.alert(
      'Enviar Notificação',
      `Enviar lembrete para ${lembrete.tutorNome} sobre ${lembrete.titulo}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Enviar',
          onPress: () => Alert.alert('Sucesso', `Notificação enviada para ${lembrete.tutorNome}`),
        },
      ]
    );
  };

  const lembretesFiltrados = lembretes.filter(lembrete => {
    if (filtroStatus !== 'todos' && lembrete.status !== filtroStatus) {
      return false;
    }
    return true;
  });

  const renderLembreteCard = ({ item }: { item: Lembrete }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.tipoBadge, { backgroundColor: getTipoCor(item.tipo) }]}>
          <Text style={styles.tipoIcon}>{getTipoIcon(item.tipo)}</Text>
          <Text style={styles.tipoText}>{item.tipo.toUpperCase()}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusCor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusTexto(item.status)}</Text>
        </View>
      </View>

      <Text style={styles.titulo}>{item.titulo}</Text>
      <Text style={styles.descricao}>{item.descricao}</Text>

      <View style={styles.divider} />

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>🐕 Paciente:</Text>
        <Text style={styles.infoValue}>{item.animalNome}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>👤 Tutor:</Text>
        <Text style={styles.infoValue}>{item.tutorNome}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>📅 Vencimento:</Text>
        <Text style={[styles.infoValue, item.status === 'atrasado' && styles.dataAtrasada]}>
          {formatarData(item.dataVencimento)}
        </Text>
      </View>

      <View style={styles.cardActions}>
        {item.status !== 'emDia' && (
          <TouchableOpacity
            style={[styles.actionButton, styles.realizarButton]}
            onPress={() => handleMarcarRealizado(item)}
          >
            <Text style={styles.actionButtonText}>✅ Marcar Realizado</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.actionButton, styles.notificarButton]}
          onPress={() => handleEnviarNotificacao(item)}
        >
          <Text style={styles.actionButtonText}>📢 Notificar Tutor</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>💉 Saúde Preventiva</Text>
        <Text style={styles.subtitle}>Vacinas, vermífugos, check-ups e protocolos</Text>
      </View>

      <View style={styles.filtersContainer}>
        <Text style={styles.filtersLabel}>Filtrar por status:</Text>
        <View style={styles.filterButtons}>
          <TouchableOpacity
            style={[styles.filterButton, filtroStatus === 'todos' && styles.filterButtonActive]}
            onPress={() => setFiltroStatus('todos')}
          >
            <Text style={[styles.filterButtonText, filtroStatus === 'todos' && styles.filterButtonTextActive]}>
              Todos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filtroStatus === 'pendente' && styles.filterButtonActive]}
            onPress={() => setFiltroStatus('pendente')}
          >
            <Text style={[styles.filterButtonText, filtroStatus === 'pendente' && styles.filterButtonTextActive]}>
              ⏳ Pendentes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filtroStatus === 'atrasado' && styles.filterButtonActive]}
            onPress={() => setFiltroStatus('atrasado')}
          >
            <Text style={[styles.filterButtonText, filtroStatus === 'atrasado' && styles.filterButtonTextActive]}>
              ⚠️ Atrasados
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={lembretesFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={renderLembreteCard}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyText}>Nenhum lembrete encontrado</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#1e3a8a', padding: 20, paddingTop: 20, paddingBottom: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: 14, color: '#fff', opacity: 0.9, marginTop: 5 },
  filtersContainer: { backgroundColor: '#fff', padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  filtersLabel: { fontSize: 12, color: '#666', marginBottom: 8 },
  filterButtons: { flexDirection: 'row', gap: 10 },
  filterButton: { paddingHorizontal: 15, paddingVertical: 6, borderRadius: 20, backgroundColor: '#f0f0f0' },
  filterButtonActive: { backgroundColor: '#1e3a8a' },
  filterButtonText: { fontSize: 12, color: '#666' },
  filterButtonTextActive: { color: '#fff' },
  listContent: { padding: 15 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  tipoBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, gap: 4 },
  tipoIcon: { fontSize: 12, color: '#fff' },
  tipoText: { fontSize: 11, color: '#fff', fontWeight: 'bold' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 11, color: '#fff', fontWeight: 'bold' },
  titulo: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  descricao: { fontSize: 14, color: '#666', marginBottom: 10 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 10 },
  infoRow: { flexDirection: 'row', marginBottom: 6 },
  infoLabel: { width: 100, fontSize: 14, color: '#666' },
  infoValue: { flex: 1, fontSize: 14, color: '#333' },
  dataAtrasada: { color: '#7e1912', fontWeight: 'bold' },
  cardActions: { flexDirection: 'row', gap: 10, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#eee' },
  actionButton: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  realizarButton: { backgroundColor: '#4CAF50' },
  notificarButton: { backgroundColor: '#2196F3' },
  actionButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  emptyContainer: { alignItems: 'center', padding: 40 },
  emptyIcon: { fontSize: 48, marginBottom: 10 },
  emptyText: { fontSize: 16, color: '#999' },
});