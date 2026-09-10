import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator,
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
    <View style={styles.container}>
      <Text style={styles.title}>ClyvoPet</Text>
      <Text style={styles.subtitle}>Bem-vindo!</Text>

      <TextInput style={styles.input} placeholder="E-mail" value={email}
        onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />

      <TextInput style={styles.input} placeholder="Senha" value={senha}
        onChangeText={setSenha} secureTextEntry />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Entrar</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('Cadastro')}>
        <Text style={styles.linkText}>Não tem conta? Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#d7edfa' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#1e3a8a', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 40 },
  input: { borderWidth: 1, borderColor: '#1e3a8a', padding: 12, marginBottom: 15,
    borderRadius: 8, fontSize: 16, backgroundColor: '#fff' },
  button: { backgroundColor: '#1e3a8a', padding: 15, borderRadius: 8,
    alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  linkButton: { padding: 15, alignItems: 'center', marginTop: 10 },
  linkText: { color: '#1e3a8a', fontWeight: 'bold' },
});