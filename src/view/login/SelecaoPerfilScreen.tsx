// src/view/login/SelecaoPerfilScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../../control/AuthContext';

export default function SelecaoPerfilScreen({ navigation }: any) {
  const { user } = useAuth();

  const selecionarPerfil = (tipo: 'vet' | 'tutor') => {
    if (tipo === 'vet') {
      navigation.replace('VetApp');
    } else {
      navigation.replace('TutorApp');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clivo Vet</Text>
      <Text style={styles.subtitle}>Olá, {user?.nome}!</Text>
      <Text style={styles.subtitle}>Escolha como deseja acessar</Text>

      <TouchableOpacity style={[styles.card, styles.cardVet]} onPress={() => selecionarPerfil('vet')}>
        <Text style={styles.cardIcon}>🐾</Text>
        <Text style={styles.cardTitle}>Veterinário</Text>
        <Text style={styles.cardDescription}>
          Gerencie seus pacientes, agenda e saúde preventiva
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.card, styles.cardTutor]} onPress={() => selecionarPerfil('tutor')}>
        <Text style={styles.cardIcon}>🐶</Text>
        <Text style={styles.cardTitle}>Tutor</Text>
        <Text style={styles.cardDescription}>
          Cadastre seus pets, acompanhe benefícios e converse com o vet
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardVet: {
    borderLeftWidth: 5,
    borderLeftColor: '#4CAF50',
  },
  cardTutor: {
    borderLeftWidth: 5,
    borderLeftColor: '#2196F3',
  },
  cardIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});