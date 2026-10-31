import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useCriarAnimal, useAtualizarAnimal, useAnimal } from '../../hooks/useAnimais';
import { AnimalPayload } from '../../services/animalService';
import { useTheme } from '../../control/ThemeContext';
import { useNotificacao } from '../../hooks/useNotificacao';

export default function CadastroAnimalScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const animalId = route.params?.id;
  const isEdicao = !!animalId;
  const { colors } = useTheme();
  const { notificar } = useNotificacao();

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
        nome: animalExistente.nome || '',
        especie: animalExistente.especie || '',
        raca: animalExistente.raca || '',
        idade: animalExistente.idade || 0,
        peso: animalExistente.peso || 0,
        sexo: animalExistente.sexo || 'M',
        tutorNome: animalExistente.tutorNome || '',
        tutorTelefone: animalExistente.tutorTelefone || '',
        tutorEmail: animalExistente.tutorEmail || '',
        observacoes: animalExistente.observacoes || '',
      });
    }
  }, [animalExistente, isEdicao]);

  const handleSalvar = () => {
    if (!form.nome || !form.especie || !form.tutorNome || !form.tutorTelefone) {
      Alert.alert('Erro', 'Preencha os campos obrigatórios.');
      return;
    }

    if (isEdicao) {
      atualizarAnimal.mutate(
        { id: animalId, animal: form },
        {
          onSuccess: () => { 
            Alert.alert('Sucesso', 'Animal atualizado!'); 
            notificar('Pet Atualizado 🐾', `Os dados de ${form.nome} foram atualizados.`);
            navigation.goBack(); 
          },
          onError: () => Alert.alert('Erro', 'Não foi possível atualizar.'),
        }
      );
    } else {
      criarAnimal.mutate(form, {
        onSuccess: () => { 
          Alert.alert('Sucesso', 'Animal cadastrado!'); 
          notificar('Novo Pet Cadastrado 🐶', `${form.nome} foi adicionado ao sistema.`);
          navigation.goBack(); 
        },
        onError: () => Alert.alert('Erro', 'Não foi possível cadastrar.'),
      });
    }
  };

  if (isEdicao && isLoadingAnimal) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const isPending = criarAnimal.isPending || atualizarAnimal.isPending;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.primary }]}>
        {isEdicao ? 'Editar Animal' : 'Novo Animal'}
      </Text>

      <Text style={[styles.sectionTitle, { color: colors.text, borderBottomColor: colors.border }]}>Dados do Animal</Text>

      <Text style={[styles.label, { color: colors.text }]}>Nome *</Text>
      <TextInput style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]} placeholder="Digite o nome do animal" placeholderTextColor={colors.textSecondary} value={form.nome} onChangeText={(t) => setForm({ ...form, nome: t })} />

      <Text style={[styles.label, { color: colors.text }]}>Espécie *</Text>
      <TextInput style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]} placeholder="Ex: Cachorro, Gato" placeholderTextColor={colors.textSecondary} value={form.especie} onChangeText={(t) => setForm({ ...form, especie: t })} />

      <Text style={[styles.label, { color: colors.text }]}>Raça</Text>
      <TextInput style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]} placeholder="Ex: Pastor Alemão" placeholderTextColor={colors.textSecondary} value={form.raca} onChangeText={(t) => setForm({ ...form, raca: t })} />

      <Text style={[styles.label, { color: colors.text }]}>Idade (anos)</Text>
      <TextInput style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]} placeholder="Em anos" placeholderTextColor={colors.textSecondary} keyboardType="numeric" value={String(form.idade)} onChangeText={(t) => setForm({ ...form, idade: Number(t) })} />

      <Text style={[styles.label, { color: colors.text }]}>Peso (kg)</Text>
      <TextInput style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]} placeholder="Ex: 10.5" placeholderTextColor={colors.textSecondary} keyboardType="numeric" value={String(form.peso)} onChangeText={(t) => setForm({ ...form, peso: Number(t) })} />

      <Text style={[styles.label, { color: colors.text }]}>Sexo</Text>
      <TextInput style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]} placeholder="M para Macho, F para Fêmea" placeholderTextColor={colors.textSecondary} value={form.sexo} onChangeText={(t) => setForm({ ...form, sexo: t.toUpperCase() as 'M' | 'F' })} maxLength={1} />

      <Text style={[styles.sectionTitle, { color: colors.text, borderBottomColor: colors.border }]}>Dados do Tutor</Text>

      <Text style={[styles.label, { color: colors.text }]}>Nome do Tutor *</Text>
      <TextInput style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]} placeholder="Digite o nome do tutor" placeholderTextColor={colors.textSecondary} value={form.tutorNome} onChangeText={(t) => setForm({ ...form, tutorNome: t })} />

      <Text style={[styles.label, { color: colors.text }]}>Telefone do Tutor *</Text>
      <TextInput style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]} placeholder="(11) 99999-9999" placeholderTextColor={colors.textSecondary} keyboardType="phone-pad" value={form.tutorTelefone} onChangeText={(t) => setForm({ ...form, tutorTelefone: t })} />

      <Text style={[styles.label, { color: colors.text }]}>E-mail do Tutor</Text>
      <TextInput style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]} placeholder="tutor@email.com" placeholderTextColor={colors.textSecondary} keyboardType="email-address" autoCapitalize="none" value={form.tutorEmail} onChangeText={(t) => setForm({ ...form, tutorEmail: t })} />

      <Text style={[styles.label, { color: colors.text }]}>Observações</Text>
      <TextInput style={[styles.input, styles.textArea, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]} placeholder="Informações adicionais sobre o animal" placeholderTextColor={colors.textSecondary} multiline value={form.observacoes} onChangeText={(t) => setForm({ ...form, observacoes: t })} />

      <TouchableOpacity style={[styles.button, { backgroundColor: colors.button }]} onPress={handleSalvar} disabled={isPending}>
        {isPending ? <ActivityIndicator color={colors.buttonText} /> : <Text style={[styles.buttonText, { color: colors.buttonText }]}>{isEdicao ? 'Salvar Alterações' : 'Cadastrar'}</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
        <Text style={[styles.cancelText, { color: colors.textSecondary }]}>Cancelar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 20, marginBottom: 10, borderBottomWidth: 1, paddingBottom: 5 },
  label: { fontSize: 14, fontWeight: '600', marginTop: 10, marginBottom: 5 },
  input: { borderRadius: 8, padding: 12, marginBottom: 5, borderWidth: 1, fontSize: 16 },
  textArea: { height: 80, textAlignVertical: 'top' },
  button: { padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  buttonText: { fontWeight: 'bold', fontSize: 16 },
  cancelButton: { padding: 15, alignItems: 'center', marginTop: 5, marginBottom: 30 },
  cancelText: { fontWeight: 'bold' },
});