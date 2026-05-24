// src/view/tutor/CadastroAnimaisScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
} 
from 'react-native';
import { useAnimais, Animal } from '../../control/AnimalContext';

type AnimalFormData = {
  nome: string;
  especie: 'cachorro' | 'gato' | 'outro';
  raca: string;
  idade: string;
  peso: string;
  vacinasEmDia: boolean;
  observacoes: string;
};

export default function CadastroAnimaisScreen() {
  const { adicionarAnimal } = useAnimais(); 
  const [formData, setFormData] = useState<AnimalFormData>({
    nome: '',
    especie: 'cachorro',
    raca: '',
    idade: '',
    peso: '',
    vacinasEmDia: false,
    observacoes: '',
  });

  const handleChange = (field: keyof AnimalFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSalvar = () => {
    if (!formData.nome.trim()) {
      Alert.alert('Erro', 'Por favor, informe o nome do pet');
      return;
    }
    if (!formData.raca.trim()) {
      Alert.alert('Erro', 'Por favor, informe a raça');
      return;
    }
    if (!formData.idade.trim()) {
      Alert.alert('Erro', 'Por favor, informe a idade');
      return;
    }
    if (!formData.peso.trim()) {
      Alert.alert('Erro', 'Por favor, informe o peso');
      return;
    }

    const novoAnimal: Animal = {
      id: Date.now().toString(),
      nome: formData.nome,
      especie: formData.especie,
      raca: formData.raca,
      idade: Number(formData.idade),
      peso: Number(formData.peso),
      vacinasEmDia: formData.vacinasEmDia,
      observacoes: formData.observacoes,
    };

    adicionarAnimal(novoAnimal); 
    
    setFormData({
      nome: '',
      especie: 'cachorro',
      raca: '',
      idade: '',
      peso: '',
      vacinasEmDia: false,
      observacoes: '',
    });

    Alert.alert('Sucesso', `${formData.nome} foi cadastrado com sucesso!`);
  };

  const handleLimpar = () => {
    setFormData({
      nome: '',
      especie: 'cachorro',
      raca: '',
      idade: '',
      peso: '',
      vacinasEmDia: false,
      observacoes: '',
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>📝 Cadastrar Pet</Text>
        <Text style={styles.subtitle}>Adicione um novo animal ao seu perfil</Text>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.sectionTitle}>Informações do Pet</Text>

        <Text style={styles.label}>Nome do pet *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Thor, Luna, Bob"
          value={formData.nome}
          onChangeText={(text) => handleChange('nome', text)}
        />

        <Text style={styles.label}>Espécie *</Text>
        <View style={styles.especieContainer}>
          <TouchableOpacity
            style={[styles.especieButton, formData.especie === 'cachorro' && styles.especieButtonActive]}
            onPress={() => handleChange('especie', 'cachorro')}
          >
            <Text style={styles.especieIcon}>🐕</Text>
            <Text style={[styles.especieText, formData.especie === 'cachorro' && styles.especieTextActive]}>
              Cachorro
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.especieButton, formData.especie === 'gato' && styles.especieButtonActive]}
            onPress={() => handleChange('especie', 'gato')}
          >
            <Text style={styles.especieIcon}>🐈</Text>
            <Text style={[styles.especieText, formData.especie === 'gato' && styles.especieTextActive]}>
              Gato
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.especieButton, formData.especie === 'outro' && styles.especieButtonActive]}
            onPress={() => handleChange('especie', 'outro')}
          >
            <Text style={styles.especieIcon}>🐾</Text>
            <Text style={[styles.especieText, formData.especie === 'outro' && styles.especieTextActive]}>
              Outro
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Raça *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Labrador, Siamês, SRD"
          value={formData.raca}
          onChangeText={(text) => handleChange('raca', text)}
        />

        <View style={styles.row}>
          <View style={styles.rowItem}>
            <Text style={styles.label}>Idade (anos) *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 3"
              keyboardType="numeric"
              value={formData.idade}
              onChangeText={(text) => handleChange('idade', text)}
            />
          </View>

          <View style={styles.rowItem}>
            <Text style={styles.label}>Peso (kg) *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 25.5"
              keyboardType="numeric"
              value={formData.peso}
              onChangeText={(text) => handleChange('peso', text)}
            />
          </View>
        </View>

        <View style={styles.switchContainer}>
          <Text style={styles.label}>Vacinas em dia?</Text>
          <Switch
            value={formData.vacinasEmDia}
            onValueChange={(value) => handleChange('vacinasEmDia', value)}
            trackColor={{ false: '#ccc', true: '#4CAF50' }}
            thumbColor={formData.vacinasEmDia ? '#fff' : '#f4f3f4'}
          />
        </View>

        <Text style={styles.label}>Observações (opcional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Ex: Alergias, medicamentos, comportamento..."
          value={formData.observacoes}
          onChangeText={(text) => handleChange('observacoes', text)}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.buttonLimpar} onPress={handleLimpar}>
            <Text style={styles.buttonLimparText}>Limpar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonSalvar} onPress={handleSalvar}>
            <Text style={styles.buttonSalvarText}>Salvar Pet</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#60a5fa',
    padding: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginTop: 5,
  },
  formCard: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 15,
  },
  rowItem: {
    flex: 1,
  },
  especieContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 5,
  },
  especieButton: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  especieButtonActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  especieIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  especieText: {
    fontSize: 12,
    color: '#666',
  },
  especieTextActive: {
    color: '#fff',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 25,
    marginBottom: 10,
  },
  buttonSalvar: {
    flex: 2,
    backgroundColor: '#1e3a8a',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonSalvarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonLimpar: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonLimparText: {
    color: '#666',
    fontWeight: 'bold',
    fontSize: 16,
  },
});