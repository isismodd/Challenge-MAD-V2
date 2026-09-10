import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useCriarAnimal, useAtualizarAnimal, useAnimal } from '../../hooks/useAnimais';
import { AnimalPayload } from '../../services/animalService';

export default function CadastroAnimalScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const animalId = route.params?.id;
  const isEdicao = !!animalId;

  const { data: animalExistente, isLoading: isLoadingAnimal } = useAnimal(animalId);
  const criarAnimal = useCriarAnimal();
  const atualizarAnimal = useAtualizarAnimal();

  const [form, setForm] = useState<AnimalPayload>({
    nome: '', especie: '', raca: '', idade: 0, peso: 0, sexo: 'M',
    tutorNome: '', tutorTelefone: '', tutorEmail: '', observacoes: '',
  });

  useEffect(() => {
    if (isEdicao && animalExistente) {
      setForm({
        nome: animalExistente.nome || '', especie: animalExistente.especie || '',
        raca: animalExistente.raca || '', idade: animalExistente.idade || 0,
        peso: animalExistente.peso || 0, sexo: animalExistente.sexo || 'M',
        tutorNome: animalExistente.tutorNome || '', tutorTelefone: animalExistente.tutorTelefone || '',
        tutorEmail: animalExistente.tutorEmail || '', observacoes: animalExistente.observacoes || '',
      });
    }
  }, [animalExistente, isEdicao]);

  const handleSalvar = () => {
    if (!form.nome || !form.especie || !form.tutorNome || !form.tutorTelefone) {
      Alert.alert('Erro', 'Preencha os campos obrigatórios.');
      return;
    }
    if (isEdicao) {
      atualizarAnimal.mutate({ id: animalId, animal: form }, {
        onSuccess: () => { Alert.alert('Sucesso', 'Animal atualizado!'); navigation.goBack(); },
        onError: () => Alert.alert('Erro', 'Não foi possível atualizar.'),
      });
    } else {
      criarAnimal.mutate(form, {
        onSuccess: () => { Alert.alert('Sucesso', 'Animal cadastrado!'); navigation.goBack(); },
        onError: () => Alert.alert('Erro', 'Não foi possível cadastrar.'),
      });
    }
  };

  if (isEdicao && isLoadingAnimal) return (
    <View style={styles.centered}><ActivityIndicator size="large" color="#1e3a8a" /></View>
  );

  const isPending = criarAnimal.isPending || atualizarAnimal.isPending;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{isEdicao ? '✏️ Editar Animal' : '🐾 Novo Animal'}</Text>
      <Text style={styles.sectionTitle}>Dados do Animal</Text>
      <TextInput style={styles.input} placeholder="Nome *" value={form.nome} onChangeText={(t) => setForm({ ...form, nome: t })} />
      <TextInput style={styles.input} placeholder="Espécie *" value={form.especie} onChangeText={(t) => setForm({ ...form, especie: t })} />
      <TextInput style={styles.input} placeholder="Raça" value={form.raca} onChangeText={(t) => setForm({ ...form, raca: t })} />
      <TextInput style={styles.input} placeholder="Idade (anos)" keyboardType="numeric" value={String(form.idade)} onChangeText={(t) => setForm({ ...form, idade: Number(t) })} />
      <TextInput style={styles.input} placeholder="Peso (kg)" keyboardType="numeric" value={String(form.peso)} onChangeText={(t) => setForm({ ...form, peso: Number(t) })} />
      <TextInput style={styles.input} placeholder="Sexo (M ou F)" value={form.sexo} onChangeText={(t) => setForm({ ...form, sexo: t.toUpperCase() as 'M' | 'F' })} />

      <Text style={styles.sectionTitle}>Dados do Tutor</Text>
      <TextInput style={styles.input} placeholder="Nome do Tutor *" value={form.tutorNome} onChangeText={(t) => setForm({ ...form, tutorNome: t })} />
      <TextInput style={styles.input} placeholder="Telefone do Tutor *" value={form.tutorTelefone} onChangeText={(t) => setForm({ ...form, tutorTelefone: t })} />
      <TextInput style={styles.input} placeholder="E-mail do Tutor" value={form.tutorEmail} onChangeText={(t) => setForm({ ...form, tutorEmail: t })} />
      <TextInput style={[styles.input, styles.textArea]} placeholder="Observações" multiline value={form.observacoes} onChangeText={(t) => setForm({ ...form, observacoes: t })} />

      <TouchableOpacity style={styles.button} onPress={handleSalvar} disabled={isPending}>
        {isPending ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{isEdicao ? 'Salvar Alterações' : 'Cadastrar'}</Text>}
      </TouchableOpacity>
      <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
        <Text style={styles.cancelText}>Cancelar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1e3a8a', marginBottom: 20, textAlign: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginTop: 15, marginBottom: 10 },
  input: { backgroundColor: '#fff', borderRadius: 8, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#ddd' },
  textArea: { height: 80, textAlignVertical: 'top' },
  button: { backgroundColor: '#1e3a8a', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 15 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  cancelButton: { padding: 15, alignItems: 'center', marginTop: 5, marginBottom: 30 },
  cancelText: { color: '#666', fontWeight: 'bold' },
});