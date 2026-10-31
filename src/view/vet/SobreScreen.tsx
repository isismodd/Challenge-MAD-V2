import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import { useTheme } from '../../control/ThemeContext';

const COMMIT_HASH = "5c5e528353f43eb1fe7db437937ca19511d71e80";

export default function SobreScreen() {
  const navigation = useNavigation<any>();
  const { colors, theme } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <View style={styles.logoContainer}>
          <Image
            source={
              theme === 'dark'
                ? require('../../../assets/clyvoLogoB.png')
                : require('../../../assets/clyvoLogo.png')
            }
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Sistema de gestão para clínica veterinária</Text>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: colors.text }]}>Versão do App:</Text>
          <Text style={[styles.value, { color: colors.textSecondary }]}>
            {Constants.expoConfig?.version || '1.0.0'}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: colors.text }]}>Ambiente:</Text>
          <Text style={[styles.value, { color: colors.textSecondary }]}>
            {Constants.expoConfig?.hostUri ? 'Desenvolvimento' : 'Produção'}
          </Text>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.hashContainer}>
          <Text style={[styles.label, { color: colors.text }]}>Hash do Commit (Versão Publicada):</Text>
          <View style={[styles.hashBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Text style={[styles.hashText, { color: colors.primary }]}>
              {COMMIT_HASH}
            </Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Desenvolvido por:</Text>
        <Text style={[styles.devText, { color: colors.textSecondary }]}>Ana Clara de Oliveira Nascimento</Text>
        <Text style={[styles.devText, { color: colors.textSecondary }]}>Isis Macedo</Text>
        <Text style={[styles.devText, { color: colors.textSecondary }]}>Henrique Pereira</Text>
        <Text style={[styles.devText, { color: colors.textSecondary }]}>Rafael Carvalho Meireles</Text>
      </View>

      <TouchableOpacity style={styles.btnVoltar} onPress={() => navigation.goBack()}>
        <Text style={[styles.btnVoltarText, { color: colors.primary }]}>← Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  card: { borderRadius: 12, padding: 20, elevation: 3, marginBottom: 20 },
  logoContainer: { alignItems: 'center', marginBottom: 15 },
  logo: { width: 150, height: 60 },
  title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 5 },
  subtitle: { fontSize: 14, textAlign: 'center', marginBottom: 20 },
  divider: { height: 1, width: '100%', marginVertical: 15 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  label: { fontSize: 14, fontWeight: 'bold' },
  value: { fontSize: 14 },
  hashContainer: { marginTop: 10 },
  hashBox: { padding: 15, borderRadius: 8, borderWidth: 1, marginTop: 8, alignItems: 'center' },
  hashText: { fontSize: 16, fontWeight: 'bold', fontFamily: 'monospace' },
  hint: { fontSize: 12, marginTop: 8, textAlign: 'center', fontStyle: 'italic' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  devText: { fontSize: 14, marginBottom: 4 },
  btnVoltar: { padding: 15, alignItems: 'center', marginBottom: 30 },
  btnVoltarText: { fontSize: 16, fontWeight: 'bold' },
});