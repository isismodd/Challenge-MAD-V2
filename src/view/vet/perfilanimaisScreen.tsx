
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Animal, mockAnimais } from '../../model';

export default function perfilanimaisScreen() {
  const [animais, setAnimais] = useState<Animal[]>(mockAnimais);
  const [searchText, setSearchText] = useState('');
  const [filtroEspecie, setFiltroEspecie] = useState<string>('todos');

  const handleBuscarAnimal = () => {
    if (!searchText.trim()) {
      setAnimais(mockAnimais);
      return;
    }
    
    const filtrados = mockAnimais.filter(animal =>
      animal.nome.toLowerCase().includes(searchText.toLowerCase()) ||
      animal.tutorNome.toLowerCase().includes(searchText.toLowerCase())
    );
    setAnimais(filtrados);
  };

  const handleFiltrarPorEspecie = (especie: string) => {
    setFiltroEspecie(especie);
    if (especie === 'todos') {
      setAnimais(mockAnimais);
    } else {
      const filtrados = mockAnimais.filter(animal => animal.especie === especie);
      setAnimais(filtrados);
    }
  };

  const handleVerDetalhes = (animal: Animal) => {
    Alert.alert(
      `🐾 ${animal.nome}`,
      `Tutor: ${animal.tutorNome}\n` +
      `Espécie: ${animal.especie}\n` +
      `Raça: ${animal.raca}\n` +
      `Idade: ${animal.idade} anos\n` +
      `Peso: ${animal.peso} kg\n` +
      `Vacinas: ${animal.vacinasEmDia ? 'Em dia ✅' : 'Atrasadas ⚠️'}\n` +
      `Última consulta: ${animal.ultimaConsulta || 'N/A'}\n` +
      `Plano: ${animal.planoSaude || 'Nenhum'}`,
      [{ text: 'OK' }]
    );
  };

  const getIconePorEspecie = (especie: string) => {
    switch (especie) {
      case 'cachorro': return '🐕';
      case 'gato': return '🐈';
      default: return '🐾';
    }
  };

  const getStatusVacinas = (emDia: boolean) => {
    return emDia ? '✅ Em dia' : '⚠️ Atrasadas';
  };

  const renderAnimalCard = ({ item }: { item: Animal }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleVerDetalhes(item)}>
      <View style={styles.cardHeader}>
        <Text style={styles.icone}>{getIconePorEspecie(item.especie)}</Text>
        <View style={styles.cardInfo}>
          <Text style={styles.nome}>{item.nome}</Text>
          <Text style={styles.raca}>{item.raca}</Text>
        </View>
        <View style={[styles.statusBadge, item.vacinasEmDia ? styles.statusOk : styles.statusWarning]}>
          <Text style={styles.statusText}>
            {item.vacinasEmDia ? 'OK' : '!'}
          </Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>👤 Tutor:</Text>
          <Text style={styles.infoValue}>{item.tutorNome}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>📅 Idade:</Text>
          <Text style={styles.infoValue}>{item.idade} anos</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>⚖️ Peso:</Text>
          <Text style={styles.infoValue}>{item.peso} kg</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>💉 Vacinas:</Text>
          <Text style={[styles.infoValue, item.vacinasEmDia ? styles.vacinasOk : styles.vacinasWarning]}>
            {getStatusVacinas(item.vacinasEmDia)}
          </Text>
        </View>

        {item.planoSaude && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>🎁 Plano:</Text>
            <Text style={styles.infoValue}>{item.planoSaude}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🐾 Perfil dos Animais</Text>
        <Text style={styles.subtitle}>Gerencie todos os pacientes</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nome do pet ou tutor..."
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleBuscarAnimal}>
          <Text style={styles.searchButtonText}>🔍 Buscar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filtersContainer}>
        <Text style={styles.filtersLabel}>Filtrar por espécie:</Text>
        <View style={styles.filterButtons}>
          <TouchableOpacity
            style={[styles.filterButton, filtroEspecie === 'todos' && styles.filterButtonActive]}
            onPress={() => handleFiltrarPorEspecie('todos')}
          >
            <Text style={[styles.filterButtonText, filtroEspecie === 'todos' && styles.filterButtonTextActive]}>
              Todos
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.filterButton, filtroEspecie === 'cachorro' && styles.filterButtonActive]}
            onPress={() => handleFiltrarPorEspecie('cachorro')}
          >
            <Text style={[styles.filterButtonText, filtroEspecie === 'cachorro' && styles.filterButtonTextActive]}>
              🐕 Cães
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.filterButton, filtroEspecie === 'gato' && styles.filterButtonActive]}
            onPress={() => handleFiltrarPorEspecie('gato')}
          >
            <Text style={[styles.filterButtonText, filtroEspecie === 'gato' && styles.filterButtonTextActive]}>
              🐈 Gatos
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={animais}
        keyExtractor={(item) => item.id}
        renderItem={renderAnimalCard}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🐕</Text>
            <Text style={styles.emptyText}>Nenhum animal encontrado</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#4CAF50', padding: 20, paddingTop: 20, paddingBottom: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: 14, color: '#fff', opacity: 0.9, marginTop: 5 },
  searchContainer: { flexDirection: 'row', padding: 15, backgroundColor: '#fff', gap: 10 },
  searchInput: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, fontSize: 16, backgroundColor: '#fafafa' },
  searchButton: { backgroundColor: '#4CAF50', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, justifyContent: 'center' },
  searchButtonText: { color: '#fff', fontWeight: 'bold' },
  filtersContainer: { paddingHorizontal: 15, paddingVertical: 10, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee' },
  filtersLabel: { fontSize: 12, color: '#666', marginBottom: 8 },
  filterButtons: { flexDirection: 'row', gap: 10 },
  filterButton: { paddingHorizontal: 15, paddingVertical: 6, borderRadius: 20, backgroundColor: '#f0f0f0' },
  filterButtonActive: { backgroundColor: '#4CAF50' },
  filterButtonText: { fontSize: 12, color: '#666' },
  filterButtonTextActive: { color: '#fff' },
  listContent: { padding: 15 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 10, marginBottom: 10 },
  icone: { fontSize: 40, marginRight: 12 },
  cardInfo: { flex: 1 },
  nome: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  raca: { fontSize: 14, color: '#666', marginTop: 2 },
  statusBadge: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  statusOk: { backgroundColor: '#4CAF50' },
  statusWarning: { backgroundColor: '#ff9800' },
  statusText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  cardBody: { gap: 6 },
  infoRow: { flexDirection: 'row' },
  infoLabel: { width: 80, fontSize: 14, color: '#666' },
  infoValue: { flex: 1, fontSize: 14, color: '#333' },
  vacinasOk: { color: '#4CAF50', fontWeight: 'bold' },
  vacinasWarning: { color: '#ff9800', fontWeight: 'bold' },
  emptyContainer: { alignItems: 'center', padding: 40 },
  emptyIcon: { fontSize: 48, marginBottom: 10 },
  emptyText: { fontSize: 16, color: '#999' },
});