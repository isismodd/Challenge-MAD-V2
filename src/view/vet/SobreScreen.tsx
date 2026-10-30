import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';

// ⚠️ AQUI VOCÊ VAI COLOCAR O HASH DO COMMIT QUANDO FOR GERAR O APK FINAL PARA O FIREBASE
const COMMIT_HASH = "PENDENTE_PUBLICACAO_FIREBASE"; 

export default function SobreScreen() {
  const navigation = useNavigation<any>();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        
        {/* Logo do App */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../../assets/clyvoLogo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>ClyvoPet</Text>
        <Text style={styles.subtitle}>Sistema de gestão para clínica veterinária</Text>

        <View style={styles.divider} />

        {/* Informações Técnicas */}
        <View style={styles.infoRow}>
          <Text style={styles.label}>Versão do App:</Text>
          <Text style={styles.value}>
            {Constants.expoConfig?.version || '1.0.0'}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Ambiente:</Text>
          <Text style={styles.value}>
            {Constants.expoConfig?.hostUri ? 'Desenvolvimento' : 'Produção'}
          </Text>
        </View>

        <View style={styles.divider} />

        {/* Hash do Commit - Requisito Obrigatório da Sprint */}
        <View style={styles.hashContainer}>
          <Text style={styles.label}>Hash do Commit (Versão Publicada):</Text>
          <View style={styles.hashBox}>
            <Text style={styles.hashText}>
              {COMMIT_HASH}
            </Text>
          </View>
          <Text style={styles.hint}>
            Este hash identifica exatamente a versão do código-fonte que gerou este aplicativo.
          </Text>
        </View>

        {/* Desenvolvedores */}
        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>Desenvolvido por:</Text>
        <Text style={styles.devText}>Ana Clara de Oliveira Nascimento</Text>
        <Text style={styles.devText}>Isis Macedo</Text>
        <Text style={styles.devText}>Henrique Pereira</Text>
        <Text style={styles.devText}>Rafael Carvalho Meireles</Text>

      </View>

      <TouchableOpacity style={styles.btnVoltar} onPress={() => navigation.goBack()}>
        <Text style={styles.btnVoltarText}>← Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 20, elevation: 3, marginBottom: 20 },
  logoContainer: { alignItems: 'center', marginBottom: 15 },
  logo: { width: 150, height: 60 },
  title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 5, color: '#1e3a8a' },
  subtitle: { fontSize: 14, textAlign: 'center', marginBottom: 20, color: '#666' },
  divider: { height: 1, width: '100%', backgroundColor: '#eee', marginVertical: 15 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  value: { fontSize: 14, color: '#666' },
  hashContainer: { marginTop: 10 },
  hashBox: { backgroundColor: '#f0f4f8', padding: 15, borderRadius: 8, borderWidth: 1, borderColor: '#cbd5e1', marginTop: 8, alignItems: 'center' },
  hashText: { fontSize: 16, fontWeight: 'bold', color: '#1e3a8a', fontFamily: 'monospace' },
  hint: { fontSize: 12, marginTop: 8, textAlign: 'center', color: '#999', fontStyle: 'italic' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  devText: { fontSize: 14, marginBottom: 4, color: '#666' },
  btnVoltar: { padding: 15, alignItems: 'center', marginBottom: 30 },
  btnVoltarText: { color: '#1e3a8a', fontWeight: 'bold', fontSize: 16 },
});