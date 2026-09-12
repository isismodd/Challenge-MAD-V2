import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, ActivityIndicator,
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Criar Conta</Text>
      <Text style={styles.subtitle}>Preencha os dados para se cadastrar</Text>

      <Text style={styles.label}>Nome completo *</Text>
      <TextInput style={styles.input} placeholder="Digite seu nome"
        value={form.nome} onChangeText={(t) => setForm({ ...form, nome: t })} />

      <Text style={styles.label}>E-mail *</Text>
      <TextInput style={styles.input} placeholder="Digite seu e-mail"
        value={form.email} onChangeText={(t) => setForm({ ...form, email: t })}
        autoCapitalize="none" keyboardType="email-address" />

      <Text style={styles.label}>Senha *</Text>
      <TextInput style={styles.input} placeholder="Mínimo 6 caracteres"
        value={form.senha} onChangeText={(t) => setForm({ ...form, senha: t })}
        secureTextEntry />

      <Text style={styles.label}>CRMV *</Text>
      <TextInput style={styles.input} placeholder="Ex: CRMV-SP-12345"
        value={form.crmv} onChangeText={(t) => setForm({ ...form, crmv: t })} />

      <Text style={styles.label}>Telefone</Text>
      <TextInput style={styles.input} placeholder="(11) 99999-9999"
        value={form.telefone} onChangeText={(t) => setForm({ ...form, telefone: t })} />

      <Text style={styles.label}>Especialidade</Text>
      <TextInput style={styles.input} placeholder="Ex: Clínica Geral"
        value={form.especialidade} onChangeText={(t) => setForm({ ...form, especialidade: t })} />

      <TouchableOpacity style={styles.button} onPress={handleCadastrar} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Cadastrar</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={styles.linkButton} onPress={() => navigation.goBack()}>
        <Text style={styles.linkText}>Já tem conta? Faça login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#d7edfa' },
  content: { padding: 20, paddingTop: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1e3a8a', textAlign: 'center', marginBottom: 5 },
  subtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 30 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#333', marginTop: 10, marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#1e3a8a', padding: 12, marginBottom: 5,
    borderRadius: 8, fontSize: 16, backgroundColor: '#fff' },
  button: { backgroundColor: '#1e3a8a', padding: 15, borderRadius: 8,
    alignItems: 'center', marginTop: 25 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  linkButton: { padding: 15, alignItems: 'center', marginTop: 10 },
  linkText: { color: '#1e3a8a', fontWeight: 'bold' },
});