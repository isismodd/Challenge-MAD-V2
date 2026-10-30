import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // <-- NOVO IMPORT
import { useAuth } from '../../control/AuthContext';

import PerfilAnimaisScreen from './PerfilAnimaisScreen';
import AgendaScreen from './AgendaScreen';
import SaudePreventivaScreen from './SaudePreventivaScreen';

const Tab = createBottomTabNavigator();

function LogoHeader() {
  return (
    <View style={styles.headerContainer}>
      <Image
        source={require('../../../assets/clyvoLogo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

function HomeScreen() {
  const { logout } = useAuth();
  const navigation = useNavigation<any>(); // <-- INSTANCIANDO NAVEGAÇÃO

  return (
    <ImageBackground
      source={require('../../../assets/homeBG.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <View style={styles.content}>
        <Text style={styles.welcome}>Bem-vindo ao ClyvoPet</Text>
        <Text style={styles.subtitle}>Sistema de gestão para clínica veterinária</Text>

        {/* NOVO BOTÃO: SOBRE O APP */}
        <TouchableOpacity 
          style={[styles.logoutButton, { backgroundColor: '#fff', marginBottom: 15 }]} 
          onPress={() => navigation.navigate('Sobre')}
        >
          <Text style={[styles.logoutButtonText, { color: '#1e3a8a' }]}>Sobre o App</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

export default function VetNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        header: () => <LogoHeader />,
        headerStyle: {
          backgroundColor: '#2359D4',
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: '#2359D4',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#fff',
          paddingBottom: 29,
          paddingTop: 5,
          height: 97,
        },
      }}
    >
      <Tab.Screen name="Início" component={HomeScreen}
        options={{ tabBarIcon: () => <Text style={{ fontSize: 22 }}>🏠</Text> }} />
      <Tab.Screen name="Animais" component={PerfilAnimaisScreen}
        options={{ tabBarIcon: () => <Text style={{ fontSize: 22 }}>🐕</Text> }} />
      <Tab.Screen name="Agenda" component={AgendaScreen}
        options={{ tabBarIcon: () => <Text style={{ fontSize: 22 }}>📅</Text> }} />
      <Tab.Screen name="Saúde" component={SaudePreventivaScreen}
        options={{ tabBarIcon: () => <Text style={{ fontSize: 22 }}>🔔</Text> }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#2359D4',
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  logo: {
    width: 160,
    height: 50,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcome: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#e7edfd',
    textAlign: 'center',
    marginBottom: 40,
  },
  logoutButton: {
    marginTop: 10, // Ajustei um pouco o margin para ficar mais harmonioso com dois botões
    width: '80%',
    backgroundColor: '#b0c5ff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonText: {
    color: '#112942',      
    fontWeight: 'bold',
    fontSize: 16,
  },
});