import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAnimais, useDeletarAnimal } from '../../hooks/useAnimais';
import { useTheme } from '../../control/ThemeContext';

export default function PerfilAnimaisScreen() {
  const navigation = useNavigation<any>();
  const { data: animais, isLoading, isError, error, refetch } = useAnimais();
  const deletarAnimal = useDeletarAnimal();
  const { colors } = useTheme();

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
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: '#ef4444' }]}>Erro: {error?.message}</Text>
        <TouchableOpacity onPress={() => refetch()}>
          <Text style={[styles.retryText, { color: colors.primary }]}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderAnimalCard = ({ item }: { item: any }) => (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      <Text style={[styles.nome, { color: colors.text }]}>{item.nome}</Text>
      <Text style={[styles.info, { color: colors.textSecondary }]}>Espécie: {item.especie}</Text>
      <Text style={[styles.info, { color: colors.textSecondary }]}>Raça: {item.raca}</Text>
      <Text style={[styles.info, { color: colors.textSecondary }]}>Tutor: {item.tutorNome}</Text>

      <View style={styles.actions}>
        <TouchableOpacity style={[styles.btnVisualizar, { backgroundColor: colors.primary }]} onPress={() => navigation.navigate('DetalhesAnimal', { id: item.id })}>
          <Text style={styles.btnText}>Detalhes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btnEditar, { backgroundColor: colors.primary }]} onPress={() => navigation.navigate('EditarAnimal', { id: item.id })}>
          <Text style={styles.btnText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btnExcluir, { backgroundColor: colors.button }]} onPress={() => handleDeletar(item.id, item.nome)}>
          <Text style={[styles.btnText, { color: colors.buttonText }]}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.header }]}>
        <Text style={styles.title}>Lista de Animais</Text>
      </View>

      <TouchableOpacity style={[styles.btnAdicionar, { backgroundColor: colors.primary }]} onPress={() => navigation.navigate('CadastroAnimal')}>
        <Text style={styles.btnAdicionarText}>+ Adicionar Animal</Text>
      </TouchableOpacity>

      <FlatList
        data={animais}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderAnimalCard}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={[styles.emptyText, { color: colors.textSecondary }]}>Nenhum animal cadastrado.</Text>}
        refreshing={isLoading}
        onRefresh={refetch}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
  btnAdicionar: { padding: 15, marginHorizontal: 15, marginTop: 15, borderRadius: 8, alignItems: 'center' },
  btnAdicionarText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  listContent: { padding: 15 },
  card: { borderRadius: 12, padding: 15, marginBottom: 15, elevation: 3 },
  nome: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  info: { fontSize: 14, marginBottom: 3 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 12 },
  btnVisualizar: { padding: 10, borderRadius: 8, flex: 1, alignItems: 'center' },
  btnEditar: { padding: 10, borderRadius: 8, flex: 1, alignItems: 'center' },
  btnExcluir: { padding: 10, borderRadius: 8, flex: 1, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  emptyText: { textAlign: 'center', marginTop: 50 },
  errorText: { fontSize: 16, marginBottom: 10 },
  retryText: { fontWeight: 'bold' },
});