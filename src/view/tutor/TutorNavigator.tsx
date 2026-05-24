// src/view/tutor/TutorNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';

import MeusAnimaisScreen from './MeusAnimaisScreen';
import CadastroAnimaisScreen from './CadastroAnimaisScreen';
import ChatScreen from './ChatScreen';
import ComunidadeScreen from './ComunidadeScreen';
import BeneficiosScreen from './BeneficiosScreen';

const Tab = createBottomTabNavigator();

const TelaPlaceholder = ({ nome }: { nome: string }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>{nome} - Em desenvolvimento</Text>
  </View>
);

export default function TutorNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Meus Pets" component={MeusAnimaisScreen} />
      <Tab.Screen name="Cadastrar Pet" component={CadastroAnimaisScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Comunidade" component={ComunidadeScreen} />
      <Tab.Screen name="Benefícios" component={BeneficiosScreen} />
    </Tab.Navigator>
  );
}