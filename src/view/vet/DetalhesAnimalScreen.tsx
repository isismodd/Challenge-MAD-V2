// src/view/vet/DetalhesAnimalScreen.tsx
import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAnimal, useDeletarAnimal } from '../../hooks/useAnimais';

export default function DetalhesAnimalScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const animalId = route.params?.id;

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
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1e3a8a" />
      </View>
    );
  }

  if (isError || !animal) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Erro ao carregar detalhes do animal.</Text>
        <TouchableOpacity onPress={() => refetch()}>
          <Text style={styles.retryText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const formatarData = (data: string) => {
    if (!data) return '-';
    return new Date(data).toLocaleString('pt-BR');
  };

  const Linha = ({ label, valor }: { label: string; valor: string | number | undefined }) => (
    <View style={styles.linha}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.valor}>{valor || '-'}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🐾 Detalhes do Animal</Text>

      <View style={styles.card}>
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
        <TouchableOpacity
          style={styles.btnEditar}
          onPress={() => navigation.navigate('EditarAnimal', { id: animal.id })}
        >
          <Text style={styles.btnText}>✏️ Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnExcluir} onPress={handleDeletar}>
          <Text style={styles.btnText}>🗑️ Excluir</Text>
        </TouchableOpacity>
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
  linha: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#eee', paddingVertical: 10 },
  label: { flex: 1, fontWeight: 'bold', color: '#333' },
  valor: { flex: 2, color: '#555' },
  actions: { flexDirection: 'row', gap: 10, marginBottom: 15 },
  btnEditar: { backgroundColor: '#f59e0b', padding: 15, borderRadius: 8, flex: 1, alignItems: 'center' },
  btnExcluir: { backgroundColor: '#ef4444', padding: 15, borderRadius: 8, flex: 1, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  btnVoltar: { padding: 15, alignItems: 'center', marginBottom: 30 },
  btnVoltarText: { color: '#1e3a8a', fontWeight: 'bold', fontSize: 16 },
  errorText: { color: '#ef4444', fontSize: 16, marginBottom: 10 },
  retryText: { color: '#1e3a8a', fontWeight: 'bold' },
});