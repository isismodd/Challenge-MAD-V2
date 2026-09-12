import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator, ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../control/AuthContext';

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const { login, loading } = useAuth();

  const handleLogin = async () => {
    if (!email || !senha) { Alert.alert('Erro', 'Preencha email e senha'); return; }
    const success = await login(email, senha);
    if (!success) Alert.alert('Erro', 'Email ou senha inválidos');
  };

  return (
    <ImageBackground
      source={require('../../../assets/loginBG.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      {}
      <View style={styles.overlay} />

      {}
      <View style={styles.container}>
        <Text style={styles.title}>ClyvoPet</Text>
        <Text style={styles.subtitle}>Bem-vindo!</Text>

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#999"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('Cadastro')}>
          <Text style={styles.linkText}>Não tem conta? Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#e7edfd',
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    borderWidth: 1,
    borderColor: '#fff',
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
  },
  button: {
    backgroundColor: '#b0c5ff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#112942',
    fontWeight: 'bold',
    fontSize: 16,
  },
  linkButton: {
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  linkText: {
    color: '#fff',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});