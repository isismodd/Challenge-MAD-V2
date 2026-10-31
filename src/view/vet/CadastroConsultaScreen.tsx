import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator, Modal, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../../control/AuthContext';
import { useAnimais } from '../../hooks/useAnimais';
import { useVeterinarios } from '../../hooks/useVeterinarios';
import { useCriarConsulta, useAtualizarConsulta } from '../../hooks/useConsultas';
import { ConsultaPayload } from '../../services/consultaService';
import { useTheme } from '../../control/ThemeContext';

export default function CadastroConsultaScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { user } = useAuth(); 
  const { colors } = useTheme();

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
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.primary }]}>{isEdicao ? 'Editar Consulta' : 'Nova Consulta'}</Text>

      <Text style={[styles.label, { color: colors.text }]}>Animal *</Text>
      <TouchableOpacity style={[styles.select, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={() => setModalAnimalVisible(true)}>
        <Text style={{ color: animalSelecionado ? colors.text : colors.textSecondary }}>
          {animalSelecionado?.nome || 'Selecione um animal'}
        </Text>
      </TouchableOpacity>

      <Text style={[styles.label, { color: colors.text }]}>Veterinário *</Text>
      <TouchableOpacity style={[styles.select, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={() => setModalVetVisible(true)}>
        <Text style={{ color: vetSelecionado ? colors.text : colors.textSecondary }}>
          {vetSelecionado?.nome || 'Selecione um veterinário'}
        </Text>
      </TouchableOpacity>

      <Text style={[styles.label, { color: colors.text }]}>Data e Hora (ISO)</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
        value={form.dataHora}
        onChangeText={(t) => setForm({ ...form, dataHora: t })}
        placeholder="2026-06-15T14:30:00"
        placeholderTextColor={colors.textSecondary}
      />

      <Text style={[styles.label, { color: colors.text }]}>Status</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
        value={form.status}
        onChangeText={(t) => setForm({ ...form, status: t.toUpperCase() as any })}
        placeholder="AGENDADA, REALIZADA ou CANCELADA"
        placeholderTextColor={colors.textSecondary}
      />

      <Text style={[styles.label, { color: colors.text }]}>Motivo</Text>
      <TextInput style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]} value={form.motivo} onChangeText={(t) => setForm({ ...form, motivo: t })} />

      <Text style={[styles.label, { color: colors.text }]}>Diagnóstico</Text>
      <TextInput style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]} value={form.diagnostico} onChangeText={(t) => setForm({ ...form, diagnostico: t })} />

      <Text style={[styles.label, { color: colors.text }]}>Prescrição</Text>
      <TextInput style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]} value={form.prescricao} onChangeText={(t) => setForm({ ...form, prescricao: t })} />

      <TouchableOpacity style={[styles.button, { backgroundColor: colors.button }]} onPress={handleSalvar} disabled={isPending}>
        {isPending ? <ActivityIndicator color={colors.buttonText} /> : <Text style={[styles.buttonText, { color: colors.buttonText }]}>Salvar</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
        <Text style={[styles.cancelText, { color: colors.textSecondary }]}>Cancelar</Text>
      </TouchableOpacity>

      <Modal visible={modalAnimalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Selecione o Animal</Text>
            <FlatList
              data={animais}
              keyExtractor={(item: any) => String(item.id)}
              ListEmptyComponent={<Text style={[styles.emptyText, { color: colors.textSecondary }]}>Nenhum animal disponível</Text>}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.modalItem, { borderBottomColor: colors.border }]}
                  onPress={() => { setForm({ ...form, animalId: item.id }); setModalAnimalVisible(false); }}
                >
                  <Text style={{ color: colors.text }}>{item.nome} - {item.especie}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setModalAnimalVisible(false)} style={styles.modalClose}>
              <Text style={[styles.cancelText, { color: colors.textSecondary }]}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={modalVetVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Selecione o Veterinário</Text>
            <FlatList
              data={listaVeterinarios}
              keyExtractor={(item: any) => String(item.id)}
              ListEmptyComponent={<Text style={[styles.emptyText, { color: colors.textSecondary }]}>Nenhum veterinário disponível</Text>}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.modalItem, { borderBottomColor: colors.border }]}
                  onPress={() => { setForm({ ...form, veterinarioId: item.id }); setModalVetVisible(false); }}
                >
                  <Text style={{ color: colors.text }}>{item.nome} {item.especialidade ? `- ${item.especialidade}` : ''}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setModalVetVisible(false)} style={styles.modalClose}>
              <Text style={[styles.cancelText, { color: colors.textSecondary }]}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 14, fontWeight: 'bold', marginTop: 10, marginBottom: 5 },
  input: { borderRadius: 8, padding: 12, marginBottom: 10, borderWidth: 1 },
  select: { borderRadius: 8, padding: 15, marginBottom: 10, borderWidth: 1 },
  button: { padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 15 },
  buttonText: { fontWeight: 'bold', fontSize: 16 },
  cancelButton: { padding: 15, alignItems: 'center', marginTop: 5, marginBottom: 30 },
  cancelText: { fontWeight: 'bold' },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { borderRadius: 12, padding: 20, maxHeight: '80%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  modalItem: { padding: 15, borderBottomWidth: 1 },
  modalClose: { marginTop: 10, alignItems: 'center' },
  emptyText: { textAlign: 'center', padding: 20 },
});