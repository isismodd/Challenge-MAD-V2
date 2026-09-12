import React from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ActivityIndicator, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAnimais, useDeletarAnimal } from '../../hooks/useAnimais';

export default function PerfilAnimaisScreen() {
  const navigation = useNavigation<any>();
  const { data: animais, isLoading, isError, error, refetch } = useAnimais();
  const deletarAnimal = useDeletarAnimal();

  const handleDeletar = (id: string, nome: string) => {
    Alert.alert('Excluir Animal', `Deseja realmente excluir ${nome}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => deletarAnimal.mutate(id, {
          onSuccess: () => Alert.alert('Sucesso', 'Animal excluído!'),
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

  if (isError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Erro: {error?.message}</Text>
        <TouchableOpacity onPress={() => refetch()}>
          <Text style={styles.retryText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderAnimalCard = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Text style={styles.nome}>{item.nome}</Text>
      <Text style={styles.info}>Espécie: {item.especie}</Text>
      <Text style={styles.info}>Raça: {item.raca}</Text>
      <Text style={styles.info}>Tutor: {item.tutorNome}</Text>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.btnVisualizar}
          onPress={() => navigation.navigate('DetalhesAnimal', { id: item.id })}
        >
          <Text style={styles.btnText}>Detalhes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnEditar}
          onPress={() => navigation.navigate('EditarAnimal', { id: item.id })}
        >
          <Text style={styles.btnText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnExcluir}
          onPress={() => handleDeletar(item.id, item.nome)}
        >
          <Text style={styles.btnText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Lista de Animais</Text>
      </View>

      {/* Botão Adicionar Animal */}
      <TouchableOpacity
        style={styles.btnAdicionar}
        onPress={() => navigation.navigate('CadastroAnimal')}
      >
        <Text style={styles.btnAdicionarText}>+ Adicionar Animal</Text>
      </TouchableOpacity>

      <FlatList
        data={animais}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderAnimalCard}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhum animal cadastrado.</Text>}
        refreshing={isLoading}
        onRefresh={refetch}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { backgroundColor: '#60a5fa', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
  btnAdicionar: {
    backgroundColor: '#1e3a8a',
    padding: 15,
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnAdicionarText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  listContent: { padding: 15 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 15, elevation: 3 },
  nome: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  info: { fontSize: 14, color: '#666', marginBottom: 3 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 12 },
  btnVisualizar: { backgroundColor: '#3b82f6', padding: 10, borderRadius: 8, flex: 1, alignItems: 'center' },
  btnEditar: { backgroundColor: '#3b82f6', padding: 10, borderRadius: 8, flex: 1, alignItems: 'center' },
  btnExcluir: { backgroundColor: '#1e3a8a', padding: 10, borderRadius: 8, flex: 1, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#999' },
  errorText: { color: '#ef4444', fontSize: 16, marginBottom: 10 },
  retryText: { color: '#1e3a8a', fontWeight: 'bold' },
});