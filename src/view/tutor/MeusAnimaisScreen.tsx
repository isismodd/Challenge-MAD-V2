// src/view/tutor/MeusAnimaisScreen.tsx (versão com AnimalContext)
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} 
from 'react-native';
import { useAnimais } from '../../control/AnimalContext';

export default function MeusAnimaisScreen() {
  const { animais, removerAnimal } = useAnimais();

  const handleRemoverAnimal = (id: string, nome: string) => {
    Alert.alert(
      'Remover Pet',
      `Tem certeza que deseja remover ${nome}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => {
            removerAnimal(id);
            Alert.alert('Sucesso', `${nome} foi removido.`);
          },
        },
      ]
    );
  };

  const getIconePorEspecie = (especie: string) => {
    switch (especie) {
      case 'cachorro': return '🐕';
      case 'gato': return '🐈';
      default: return '🐾';
    }
  };

  const renderAnimalCard = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.icone}>{getIconePorEspecie(item.especie)}</Text>
        <View style={styles.cardInfo}>
          <Text style={styles.nome}>{item.nome}</Text>
          <Text style={styles.raca}>
            {item.raca} • {item.idade} anos
          </Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleRemoverAnimal(item.id, item.nome)}
        >
          <Text style={styles.deleteText}>🗑️</Text>
        </TouchableOpacity>
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
          <Text style={styles.emptySubtext}>
            Toque no botão "Cadastrar Pet" para adicionar seu primeiro animal
          </Text>
        </View>
      ) : (
        <FlatList
          data={animais}
          keyExtractor={(item) => item.id}
          renderItem={renderAnimalCard}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          extraData={animais}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#60a5fa',
    padding: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginTop: 5,
  },
  listContent: {
    padding: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
    marginBottom: 10,
  },
  icone: {
    fontSize: 40,
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  raca: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  deleteButton: {
    padding: 8,
  },
  deleteText: {
    fontSize: 20,
  },
  cardBody: {
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  infoLabel: {
    width: 110,
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  statusOk: {
    color: '#4CAF50',
  },
  statusWarning: {
    color: '#f44336',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 10,
  },
});