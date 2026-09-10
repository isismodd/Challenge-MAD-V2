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
      { text: 'Excluir', style: 'destructive',
        onPress: () => deletarAnimal.mutate(id, {
          onSuccess: () => Alert.alert('Sucesso', 'Animal excluído!'),
          onError: () => Alert.alert('Erro', 'Não foi possível excluir.'),
        }),
      },
    ]);
  };

  if (isLoading) return (
    <View style={styles.centered}><ActivityIndicator size="large" color="#1e3a8a" /></View>
  );

  if (isError) return (
    <View style={styles.centered}>
      <Text style={styles.errorText}>Erro: {error?.message}</Text>
      <TouchableOpacity onPress={() => refetch()}>
        <Text style={styles.retryText}>Tentar novamente</Text>
      </TouchableOpacity>
    </View>
  );

  const renderAnimalCard = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Text style={styles.nome}>{item.nome}</Text>
      <Text>Espécie: {item.especie}</Text>
      <Text>Raça: {item.raca}</Text>
      <Text>Tutor: {item.tutorNome}</Text>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.btnEditar}
          onPress={() => navigation.navigate('EditarAnimal', { id: item.id })}>
          <Text style={styles.btnText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnExcluir}
          onPress={() => handleDeletar(item.id, item.nome)}>
          <Text style={styles.btnText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}><Text style={styles.title}>🐾 Lista de Animais</Text></View>
      <FlatList data={animais} keyExtractor={(item) => String(item.id)}
        renderItem={renderAnimalCard} contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhum animal cadastrado.</Text>}
        refreshing={isLoading} onRefresh={refetch} />
      <TouchableOpacity style={styles.fab}
        onPress={() => navigation.navigate('CadastroAnimal')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { backgroundColor: '#60a5fa', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  listContent: { padding: 15 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 15, elevation: 3 },
  nome: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 10 },
  btnEditar: { backgroundColor: '#f59e0b', padding: 8, borderRadius: 8, flex: 1, alignItems: 'center' },
  btnExcluir: { backgroundColor: '#ef4444', padding: 8, borderRadius: 8, flex: 1, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#999' },
  errorText: { color: '#ef4444', fontSize: 16, marginBottom: 10 },
  retryText: { color: '#1e3a8a', fontWeight: 'bold' },
  fab: { position: 'absolute', right: 20, bottom: 20, backgroundColor: '#1e3a8a',
    width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  fabText: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
});