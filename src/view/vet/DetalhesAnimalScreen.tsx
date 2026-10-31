import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAnimal, useDeletarAnimal } from '../../hooks/useAnimais';
import { useTheme } from '../../control/ThemeContext';

export default function DetalhesAnimalScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const animalId = route.params?.id;
  const { colors } = useTheme();

  const { data: animal, isLoading, isError, refetch } = useAnimal(animalId);
  const deletarAnimal = useDeletarAnimal();

  const handleDeletar = () => {
    Alert.alert('Excluir Animal', `Deseja realmente excluir ${animal?.nome}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => deletarAnimal.mutate(animalId, {
          onSuccess: () => {
            Alert.alert('Sucesso', 'Animal excluído!');
            navigation.goBack();
          },
          onError: () => Alert.alert('Erro', 'Não foi possível excluir.'),
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

  if (isError || !animal) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: '#ef4444' }]}>Erro ao carregar detalhes do animal.</Text>
        <TouchableOpacity onPress={() => refetch()}>
          <Text style={[styles.retryText, { color: colors.primary }]}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const formatarData = (data: string) => {
    if (!data) return '-';
    return new Date(data).toLocaleString('pt-BR');
  };

  const Linha = ({ label, valor }: { label: string; valor: string | number | undefined }) => (
    <View style={[styles.linha, { borderBottomColor: colors.border }]}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <Text style={[styles.valor, { color: colors.textSecondary }]}>{valor || '-'}</Text>
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.primary }]}>Detalhes do Animal</Text>

      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Linha label="ID" valor={animal.id} />
        <Linha label="Nome" valor={animal.nome} />
        <Linha label="Espécie" valor={animal.especie} />
        <Linha label="Raça" valor={animal.raca} />
        <Linha label="Idade" valor={animal.idade ? `${animal.idade} anos` : '-'} />
        <Linha label="Peso" valor={animal.peso ? `${animal.peso} kg` : '-'} />
        <Linha label="Sexo" valor={animal.sexo === 'M' ? 'Macho' : animal.sexo === 'F' ? 'Fêmea' : '-'} />
        <Linha label="Tutor" valor={animal.tutorNome} />
        <Linha label="Telefone do Tutor" valor={animal.tutorTelefone} />
        <Linha label="E-mail do Tutor" valor={animal.tutorEmail} />
        <Linha label="Data de Cadastro" valor={formatarData(animal.dataCadastro)} />
        <Linha label="Observações" valor={animal.observacoes} />
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={[styles.btnEditar, { backgroundColor: colors.primary }]} onPress={() => navigation.navigate('EditarAnimal', { id: animal.id })}>
          <Text style={styles.btnText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btnExcluir, { backgroundColor: colors.button }]} onPress={handleDeletar}>
          <Text style={[styles.btnText, { color: colors.buttonText }]}>Excluir</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.btnVoltar} onPress={() => navigation.goBack()}>
        <Text style={[styles.btnVoltarText, { color: colors.primary }]}>← Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  card: { borderRadius: 12, padding: 15, elevation: 3, marginBottom: 20 },
  linha: { flexDirection: 'row', borderBottomWidth: 1, paddingVertical: 10 },
  label: { flex: 1, fontWeight: 'bold' },
  valor: { flex: 2 },
  actions: { flexDirection: 'row', gap: 10, marginBottom: 15 },
  btnEditar: { padding: 15, borderRadius: 8, flex: 1, alignItems: 'center' },
  btnExcluir: { padding: 15, borderRadius: 8, flex: 1, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  btnVoltar: { padding: 15, alignItems: 'center', marginBottom: 30 },
  btnVoltarText: { fontWeight: 'bold', fontSize: 16 },
  errorText: { fontSize: 16, marginBottom: 10 },
  retryText: { fontWeight: 'bold' },
});