import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, ActivityIndicator, Modal, FlatList,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../../control/AuthContext';
import { useAnimais } from '../../hooks/useAnimais';
import { useVeterinarios } from '../../hooks/useVeterinarios';
import { useCriarConsulta, useAtualizarConsulta } from '../../hooks/useConsultas';
import { ConsultaPayload } from '../../services/consultaService';

export default function CadastroConsultaScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { user } = useAuth(); 

  const consultaId = route.params?.id;
  const isEdicao = !!consultaId;

  const { data: animaisData } = useAnimais();
  const { data: veterinariosData } = useVeterinarios();
  const criarConsulta = useCriarConsulta();
  const atualizarConsulta = useAtualizarConsulta();

  const animais = Array.isArray(animaisData) ? animaisData : [];
  const veterinarios = Array.isArray(veterinariosData) ? veterinariosData : [];

  const listaVeterinarios = React.useMemo(() => {
    if (!user) return veterinarios;
    const jaExiste = veterinarios.some((v: any) => Number(v.id) === Number(user.id));
    if (jaExiste) return veterinarios;
    return [
      { id: user.id, nome: user.nome, email: user.email, especialidade: 'Veterinário(a)' },
      ...veterinarios,
    ];
  }, [veterinarios, user]);

  const [form, setForm] = useState<ConsultaPayload>({
    animalId: 0,
    veterinarioId: user?.id || 0, 
    dataHora: new Date().toISOString(),
    motivo: '',
    diagnostico: '',
    prescricao: '',
    status: 'AGENDADA',
  });

  useEffect(() => {
    if (user && !isEdicao && form.veterinarioId === 0) {
      setForm((prev) => ({ ...prev, veterinarioId: user.id }));
    }
  }, [user, isEdicao]);

  const [modalAnimalVisible, setModalAnimalVisible] = useState(false);
  const [modalVetVisible, setModalVetVisible] = useState(false);

  const handleSalvar = () => {
    if (!form.animalId || !form.veterinarioId || !form.dataHora) {
      Alert.alert('Erro', 'Selecione o animal, veterinário e a data/hora.');
      return;
    }

    if (isEdicao) {
      atualizarConsulta.mutate(
        { id: consultaId, consulta: form },
        {
          onSuccess: () => { Alert.alert('Sucesso', 'Consulta atualizada!'); navigation.goBack(); },
          onError: () => Alert.alert('Erro', 'Não foi possível atualizar.'),
        }
      );
    } else {
      criarConsulta.mutate(form, {
        onSuccess: () => { Alert.alert('Sucesso', 'Consulta agendada!'); navigation.goBack(); },
        onError: () => Alert.alert('Erro', 'Não foi possível agendar.'),
      });
    }
  };

  const isPending = criarConsulta.isPending || atualizarConsulta.isPending;

  const animalSelecionado = animais.find((a: any) => Number(a.id) === Number(form.animalId));
  const vetSelecionado = listaVeterinarios.find((v: any) => Number(v.id) === Number(form.veterinarioId));

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{isEdicao ? 'Editar Consulta' : 'Nova Consulta'}</Text>

      <Text style={styles.label}>Animal *</Text>
      <TouchableOpacity style={styles.select} onPress={() => setModalAnimalVisible(true)}>
        <Text>{animalSelecionado?.nome || 'Selecione um animal'}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Veterinário *</Text>
      <TouchableOpacity style={styles.select} onPress={() => setModalVetVisible(true)}>
        <Text>{vetSelecionado?.nome || 'Selecione um veterinário'}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Data e Hora (ISO)</Text>
      <TextInput
        style={styles.input}
        value={form.dataHora}
        onChangeText={(t) => setForm({ ...form, dataHora: t })}
        placeholder="2026-06-15T14:30:00"
      />

      <Text style={styles.label}>Status</Text>
      <TextInput
        style={styles.input}
        value={form.status}
        onChangeText={(t) => setForm({ ...form, status: t.toUpperCase() as any })}
        placeholder="AGENDADA, REALIZADA ou CANCELADA"
      />

      <Text style={styles.label}>Motivo</Text>
      <TextInput style={styles.input} value={form.motivo}
        onChangeText={(t) => setForm({ ...form, motivo: t })} />

      <Text style={styles.label}>Diagnóstico</Text>
      <TextInput style={styles.input} value={form.diagnostico}
        onChangeText={(t) => setForm({ ...form, diagnostico: t })} />

      <Text style={styles.label}>Prescrição</Text>
      <TextInput style={styles.input} value={form.prescricao}
        onChangeText={(t) => setForm({ ...form, prescricao: t })} />

      <TouchableOpacity style={styles.button} onPress={handleSalvar} disabled={isPending}>
        {isPending ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Salvar</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
        <Text style={styles.cancelText}>Cancelar</Text>
      </TouchableOpacity>

      {/* Modal de Animais */}
      <Modal visible={modalAnimalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione o Animal</Text>
            <FlatList
              data={animais}
              keyExtractor={(item: any) => String(item.id)}
              ListEmptyComponent={<Text style={styles.emptyText}>Nenhum animal disponível</Text>}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => { setForm({ ...form, animalId: item.id }); setModalAnimalVisible(false); }}
                >
                  <Text>{item.nome} - {item.especie}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setModalAnimalVisible(false)} style={styles.modalClose}>
              <Text style={styles.cancelText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de Veterinários */}
      <Modal visible={modalVetVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione o Veterinário</Text>
            <FlatList
              data={listaVeterinarios}
              keyExtractor={(item: any) => String(item.id)}
              ListEmptyComponent={<Text style={styles.emptyText}>Nenhum veterinário disponível</Text>}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => { setForm({ ...form, veterinarioId: item.id }); setModalVetVisible(false); }}
                >
                  <Text>{item.nome} {item.especialidade ? `- ${item.especialidade}` : ''}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setModalVetVisible(false)} style={styles.modalClose}>
              <Text style={styles.cancelText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1e3a8a', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 14, fontWeight: 'bold', color: '#333', marginTop: 10, marginBottom: 5 },
  input: { backgroundColor: '#fff', borderRadius: 8, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#ddd' },
  select: { backgroundColor: '#fff', borderRadius: 8, padding: 15, marginBottom: 10, borderWidth: 1, borderColor: '#ddd' },
  button: { backgroundColor: '#1e3a8a', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 15 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  cancelButton: { padding: 15, alignItems: 'center', marginTop: 5, marginBottom: 30 },
  cancelText: { color: '#666', fontWeight: 'bold' },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', borderRadius: 12, padding: 20, maxHeight: '80%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  modalItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  modalClose: { marginTop: 10, alignItems: 'center' },
  emptyText: { textAlign: 'center', color: '#999', padding: 20 },
});