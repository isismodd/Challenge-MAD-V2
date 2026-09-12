// src/view/login/CadastroScreen.tsx
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, ActivityIndicator, ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { authService, CadastroPayload } from '../../services/authService';

export default function CadastroScreen() {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<CadastroPayload>({
    nome: '',
    email: '',
    senha: '',
    crmv: '',
    telefone: '',
    especialidade: '',
  });

  const handleCadastrar = async () => {
    if (!form.nome || !form.email || !form.senha || !form.crmv) {
      Alert.alert('Erro', 'Preencha os campos obrigatórios (Nome, E-mail, Senha e CRMV).');
      return;
    }

    if (form.senha.length < 6) {
      Alert.alert('Erro', 'A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      await authService.cadastrar(form);
      Alert.alert('Sucesso', 'Cadastro realizado! Faça login para continuar.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      console.log('Erro no cadastro:', error);
      Alert.alert('Erro', 'Não foi possível cadastrar. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../../../assets/loginBG.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      {/* Overlay preto 50% */}
      <View style={styles.overlay} />

      {/* Conteúdo */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Criar Conta</Text>
        <Text style={styles.subtitle}>Preencha os dados para se cadastrar</Text>

        <Text style={styles.label}>Nome completo *</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu nome"
          placeholderTextColor="#999"
          value={form.nome}
          onChangeText={(t) => setForm({ ...form, nome: t })}
        />

        <Text style={styles.label}>E-mail *</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu e-mail"
          placeholderTextColor="#999"
          value={form.email}
          onChangeText={(t) => setForm({ ...form, email: t })}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Senha *</Text>
        <TextInput
          style={styles.input}
          placeholder="Mínimo 6 caracteres"
          placeholderTextColor="#999"
          value={form.senha}
          onChangeText={(t) => setForm({ ...form, senha: t })}
          secureTextEntry
        />

        <Text style={styles.label}>CRMV *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: CRMV-SP-12345"
          placeholderTextColor="#999"
          value={form.crmv}
          onChangeText={(t) => setForm({ ...form, crmv: t })}
        />

        <Text style={styles.label}>Telefone</Text>
        <TextInput
          style={styles.input}
          placeholder="(11) 99999-9999"
          placeholderTextColor="#999"
          value={form.telefone}
          onChangeText={(t) => setForm({ ...form, telefone: t })}
        />

        <Text style={styles.label}>Especialidade</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Clínica Geral"
          placeholderTextColor="#999"
          value={form.especialidade}
          onChangeText={(t) => setForm({ ...form, especialidade: t })}
        />

        <TouchableOpacity style={styles.button} onPress={handleCadastrar} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Cadastrar</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton} onPress={() => navigation.goBack()}>
          <Text style={styles.linkText}>Já tem conta? Faça login</Text>
        </TouchableOpacity>
      </ScrollView>
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
  scrollContainer: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#e7edfd',
    textAlign: 'center',
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#fff',
    padding: 12,
    marginBottom: 5,
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
    marginTop: 25,
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