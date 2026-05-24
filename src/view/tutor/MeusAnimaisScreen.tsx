// src/view/tutor/MeusAnimaisScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';

// Tipo do Animal
type Animal = {
  id: string;
  nome: string;
  especie: 'cachorro' | 'gato' | 'outro';
  raca: string;
  idade: number;
  peso: number;
  foto?: string;
  vacinasEmDia: boolean;
  proximaConsulta?: string | null;
};

// Dados mockados dos pets do tutor
const mockAnimais: Animal[] = [
  {
    id: '1',
    nome: 'Thor',
    especie: 'cachorro',
    raca: 'Labrador',
    idade: 3,
    peso: 28.5,
    vacinasEmDia: true,
    proximaConsulta: '15/06/2026',
  },
  {
    id: '2',
    nome: 'Lesada',
    especie: 'gato',
    raca: 'SRD',
    idade: 3,
    peso: 2.5,
    vacinasEmDia: true,
    proximaConsulta: '20/06/2026',
  },
  {
    id: '3',
    nome: 'Bob',
    especie: 'cachorro',
    raca: 'Poodle',
    idade: 5,
    peso: 6.5,
    vacinasEmDia: false,
    proximaConsulta: null,
  },
];

export default function MeusAnimaisScreen() {
  const [animais, setAnimais] = useState<Animal[]>(mockAnimais);
  const [modalVisible, setModalVisible] = useState(false);
  
  // Estados para o controle do modal customizado de exclusão
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [petParaExcluir, setPetParaExcluir] = useState<{ id: string; nome: string } | null>(null);

  const [editandoAnimal, setEditandoAnimal] = useState<Animal | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    especie: 'cachorro' as 'cachorro' | 'gato' | 'outro',
    raca: '',
    idade: '',
    peso: '',
    vacinasEmDia: false,
    proximaConsulta: '',
  });

  // Abre o modal de confirmação 
  const handleRemoverAnimal = (id: string, nome: string) => {
    setPetParaExcluir({ id, nome });
    setDeleteModalVisible(true);
  };

  // Executa a exclusão na lista
  const confirmarExclusao = () => {
    if (petParaExcluir) {
      setAnimais(prev => prev.filter(animal => animal.id !== petParaExcluir.id));
      setDeleteModalVisible(false);
      setPetParaExcluir(null);
    }
  };

  const handleEditarAnimal = (animal: Animal) => {
    setEditandoAnimal(animal);
    setFormData({
      nome: animal.nome,
      especie: animal.especie,
      raca: animal.raca,
      idade: animal.idade.toString(),
      peso: animal.peso.toString(),
      vacinasEmDia: animal.vacinasEmDia,
      proximaConsulta: animal.proximaConsulta || '',
    });
    setModalVisible(true);
  };

  const handleSalvarEdicao = () => {
    if (!formData.nome.trim() || !formData.raca.trim() || !formData.idade.trim() || !formData.peso.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const animalAtualizado: Animal = {
      id: editandoAnimal!.id,
      nome: formData.nome,
      especie: formData.especie,
      raca: formData.raca,
      idade: parseInt(formData.idade),
      peso: parseFloat(formData.peso),
      vacinasEmDia: formData.vacinasEmDia,
      proximaConsulta: formData.proximaConsulta || null,
    };

    setAnimais(animais.map(animal => 
      animal.id === editandoAnimal!.id ? animalAtualizado : animal
    ));

    setModalVisible(false);
    setEditandoAnimal(null);
    setFormData({
      nome: '',
      especie: 'cachorro',
      raca: '',
      idade: '',
      peso: '',
      vacinasEmDia: false,
      proximaConsulta: '',
    });
  };

  const getIconePorEspecie = (especie: string) => {
    switch (especie) {
      case 'cachorro': return '🐕';
      case 'gato': return '🐈';
      default: return '🐾';
    }
  };

  const renderAnimalCard = ({ item }: { item: Animal }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.icone}>{getIconePorEspecie(item.especie)}</Text>
        <View style={styles.cardInfo}>
          <Text style={styles.nome}>{item.nome}</Text>
          <Text style={styles.raca}>
            {item.raca} • {item.idade} anos
          </Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.editButton} onPress={() => handleEditarAnimal(item)}>
            <Text style={styles.editText}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={() => handleRemoverAnimal(item.id, item.nome)}>
            <Text style={styles.deleteText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>⚖️ Peso:</Text>
          <Text style={styles.infoValue}>{item.peso} kg</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>💉 Vacinas:</Text>
          <Text style={[styles.infoValue, item.vacinasEmDia ? styles.statusOk : styles.statusWarning]}>
            {item.vacinasEmDia ? 'Em dia ✅' : 'Atrasadas ⚠️'}
          </Text>
        </View>
        {item.proximaConsulta && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>📅 Próxima consulta:</Text>
            <Text style={styles.infoValue}>{item.proximaConsulta}</Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🐾 Meus Pets</Text>
        <Text style={styles.subtitle}>Gerencie seus animais de estimação</Text>
      </View>

      {animais.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🐶</Text>
          <Text style={styles.emptyText}>Você ainda não tem pets cadastrados</Text>
        </View>
      ) : (
        <FlatList
          data={animais}
          keyExtractor={(item) => item.id}
          renderItem={renderAnimalCard}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Modal Customizado de Confirmação de Exclusão*/}
      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { maxHeight: 220, padding: 25 }]}>
            <Text style={[styles.modalTitle, { textAlign: 'center', marginBottom: 10 }]}>Remover Pet</Text>
            <Text style={{ fontSize: 16, textAlign: 'center', color: '#666', marginBottom: 25 }}>
              Tem certeza que deseja remover o(a) <Text style={{ fontWeight: 'bold' }}>{petParaExcluir?.nome}</Text>?
            </Text>
            <View style={{ flexDirection: 'row', gap: 15 }}>
              <TouchableOpacity 
                style={[styles.especieButton, { backgroundColor: '#ccc', borderColor: '#ccc' }]} 
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={{ color: '#333', fontWeight: 'bold' }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.especieButton, { backgroundColor: '#d9534f', borderColor: '#d9534f' }]} 
                onPress={confirmarExclusao}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Remover</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Edição */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>✏️ Editar Pet</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>Nome do pet *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Thor"
                value={formData.nome}
                onChangeText={(text) => setFormData({ ...formData, nome: text })}
              />

              <Text style={styles.inputLabel}>Espécie *</Text>
              <View style={styles.especieContainer}>
                <TouchableOpacity
                  style={[styles.especieButton, formData.especie === 'cachorro' && styles.especieButtonActive]}
                  onPress={() => setFormData({ ...formData, especie: 'cachorro' })}
                >
                  <Text style={styles.especieIcon}>🐕</Text>
                  <Text style={[styles.especieText, formData.especie === 'cachorro' && styles.especieTextActive]}>
                    Cachorro
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.especieButton, formData.especie === 'gato' && styles.especieButtonActive]}
                  onPress={() => setFormData({ ...formData, especie: 'gato' })}
                >
                  <Text style={styles.especieIcon}>🐈</Text>
                  <Text style={[styles.especieText, formData.especie === 'gato' && styles.especieTextActive]}>
                    Gato
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.especieButton, formData.especie === 'outro' && styles.especieButtonActive]}
                  onPress={() => setFormData({ ...formData, especie: 'outro' })}
                >
                  <Text style={styles.especieIcon}>🐾</Text>
                  <Text style={[styles.especieText, formData.especie === 'outro' && styles.especieTextActive]}>
                    Outro
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.inputLabel}>Raça *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Labrador, Siamês, SRD"
                value={formData.raca}
                onChangeText={(text) => setFormData({ ...formData, raca: text })}
              />

              <View style={styles.row}>
                <View style={styles.rowItem}>
                  <Text style={styles.inputLabel}>Idade (anos) *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ex: 3"
                    keyboardType="numeric"
                    value={formData.idade}
                    onChangeText={(text) => setFormData({ ...formData, idade: text })}
                  />
                </View>

                <View style={styles.rowItem}>
                  <Text style={styles.inputLabel}>Peso (kg) *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ex: 25.5"
                    keyboardType="numeric"
                    value={formData.peso}
                    onChangeText={(text) => setFormData({ ...formData, peso: text })}
                  />
                </View>
              </View>

              <View style={styles.switchContainer}>
                <Text style={styles.inputLabel}>Vacinas em dia?</Text>
                <TouchableOpacity
                  style={[styles.vacinaButton, formData.vacinasEmDia && styles.vacinaButtonActive]}
                  onPress={() => setFormData({ ...formData, vacinasEmDia: !formData.vacinasEmDia })}
                >
                  <Text style={styles.vacinaButtonText}>
                    {formData.vacinasEmDia ? '✅ Sim' : '❌ Não'}
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.inputLabel}>Próxima consulta (opcional)</Text>
              <TextInput
                style={styles.input}
                placeholder="DD/MM/AAAA"
                value={formData.proximaConsulta}
                onChangeText={(text) => setFormData({ ...formData, proximaConsulta: text })}
              />

              <TouchableOpacity style={styles.salvarButton} onPress={handleSalvarEdicao}>
                <Text style={styles.salvarButtonText}>Salvar Alterações</Text>
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
  header: { backgroundColor: '#2196F3', padding: 20, paddingTop: 20, paddingBottom: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: 14, color: '#fff', opacity: 0.9, marginTop: 5 },
  listContent: { padding: 15 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 10, marginBottom: 10 },
  icone: { fontSize: 40, marginRight: 12 },
  cardInfo: { flex: 1 },
  nome: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  raca: { fontSize: 14, color: '#666', marginTop: 2 },
  actionButtons: { flexDirection: 'row', gap: 8 },
  editButton: { padding: 8 },
  editText: { fontSize: 20 },
  deleteButton: { padding: 8 },
  deleteText: { fontSize: 20 },
  cardBody: { marginBottom: 10 },
  infoRow: { flexDirection: 'row', marginBottom: 6 },
  infoLabel: { width: 110, fontSize: 14, color: '#666' },
  infoValue: { flex: 1, fontSize: 14, color: '#333', fontWeight: '500' },
  statusOk: { color: '#4CAF50' },
  statusWarning: { color: '#4b0202' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyIcon: { fontSize: 64, marginBottom: 20 },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: '#666', textAlign: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { backgroundColor: '#fff', borderRadius: 20, padding: 20, width: '90%', maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  modalClose: { fontSize: 24, color: '#999' },
  inputLabel: { fontSize: 14, fontWeight: '500', color: '#555', marginBottom: 5, marginTop: 10 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: '#fafafa' },
  especieContainer: { flexDirection: 'row', gap: 10, marginTop: 5 },
  especieButton: { flex: 1, alignItems: 'center', padding: 10, backgroundColor: '#f0f0f0', borderRadius: 8, borderWidth: 1, borderColor: '#ddd', justifyContent: 'center' },
  especieButtonActive: { backgroundColor: '#2196F3', borderColor: '#2196F3' },
  especieIcon: { fontSize: 24, marginBottom: 4 },
  especieText: { fontSize: 12, color: '#666' },
  especieTextActive: { color: '#fff' },
  row: { flexDirection: 'row', gap: 15 },
  rowItem: { flex: 1 },
  switchContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15, marginBottom: 10 },
  vacinaButton: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, backgroundColor: '#f0f0f0' },
  vacinaButtonActive: { backgroundColor: '#4CAF50' },
  vacinaButtonText: { fontSize: 14, fontWeight: 'bold' },
  salvarButton: { backgroundColor: '#2196F3', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 20, marginBottom: 10 },
  salvarButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});