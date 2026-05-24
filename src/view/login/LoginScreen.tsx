// src/view/login/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../../control/AuthContext';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (tipo: 'vet' | 'tutor') => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Preencha email e senha');
      return;
    }

    setLoading(true);
    const success = await login(email, senha, tipo);
    setLoading(false);

    if (success) {
      navigation.replace('SelecaoPerfil');
    } else {
      Alert.alert('Erro', 'Email ou senha inválidos');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🐾 Clivo Vet</Text>
      <Text style={styles.subtitle}>Bem-vindo ao seu app veterinário</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : (
        <>
          <TouchableOpacity style={[styles.button, styles.buttonVet]} onPress={() => handleLogin('vet')}>
            <Text style={styles.buttonText}>Entrar como Veterinário</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.buttonTutor]} onPress={() => handleLogin('tutor')}>
            <Text style={styles.buttonText}>Entrar como Tutor</Text>
          </TouchableOpacity>
        </>
      )}

      <Text style={styles.demoText}>
        Demo: use qualquer email/senha{'\n'}
        Vet: vet@clivovet.com | Tutor: tutor@clivovet.com{'\n'}
        Mínimo 3 caracteres na senha
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    width: '100%',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonVet: {
    backgroundColor: '#4CAF50',
  },
  buttonTutor: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  demoText: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 12,
    color: '#999',
  },
});