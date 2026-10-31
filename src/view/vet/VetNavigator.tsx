import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../control/AuthContext';
import { useTheme } from '../../control/ThemeContext';

import PerfilAnimaisScreen from './PerfilAnimaisScreen';
import AgendaScreen from './AgendaScreen';
import SaudePreventivaScreen from './SaudePreventivaScreen';

const Tab = createBottomTabNavigator();

function LogoHeader() {
  const { toggleTheme, theme, colors } = useTheme();

  return (
    <View style={[styles.headerContainer, { backgroundColor: colors.header }]}>
      <Image
        source={
          theme === 'dark'
            ? require('../../../assets/clyvoLogoB.png') 
            : require('../../../assets/clyvoLogo.png')
        }
        style={styles.logo}
        resizeMode="contain"
      />
      <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
        <Text style={styles.themeIcon}>{theme === 'light' ? '🌙' : '☀️'}</Text>
      </TouchableOpacity>
    </View>
  );
}

function HomeScreen() {
  const { logout } = useAuth();
  const navigation = useNavigation<any>();
  const { colors } = useTheme();

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

        <TouchableOpacity 
          style={[styles.logoutButton, { backgroundColor: colors.card, marginBottom: 15 }]} 
          onPress={() => navigation.navigate('Sobre')}
        >
          <Text style={[styles.logoutButtonText, { color: colors.primary }]}>Sobre o App</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.logoutButton, { backgroundColor: colors.card }]} onPress={logout}>
          <Text style={[styles.logoutButtonText, { color: colors.primary }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

export default function VetNavigator() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        header: () => <LogoHeader />,
        headerStyle: {
          backgroundColor: colors.header,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          paddingBottom: 29,
          paddingTop: 5,
          height: 97,
        },
      }}
    >
      <Tab.Screen name="Início" component={HomeScreen} options={{ tabBarIcon: () => <Text style={{ fontSize: 22 }}>🏠</Text> }} />
      <Tab.Screen name="Animais" component={PerfilAnimaisScreen} options={{ tabBarIcon: () => <Text style={{ fontSize: 22 }}>🐕</Text> }} />
      <Tab.Screen name="Agenda" component={AgendaScreen} options={{ tabBarIcon: () => <Text style={{ fontSize: 22 }}>📅</Text> }} />
      <Tab.Screen name="Saúde" component={SaudePreventivaScreen} options={{ tabBarIcon: () => <Text style={{ fontSize: 22 }}>🔔</Text> }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    flexDirection: 'row',
  },
  logo: {
    width: 160,
    height: 50,
  },
  themeButton: {
    position: 'absolute',
    right: 20,
    padding: 10,
  },
  themeIcon: {
    fontSize: 24,
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
    marginTop: 10,
    width: '80%',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});