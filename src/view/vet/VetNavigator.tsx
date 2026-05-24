// src/view/vet/VetNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';

const Tab = createBottomTabNavigator();

// Telas placeholder
const PerfilAnimais = () => <View><Text>Perfil dos Animais</Text></View>;
const Agenda = () => <View><Text>Agenda</Text></View>;
const Chat = () => <View><Text>Chat</Text></View>;

export default function VetNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Animais" component={PerfilAnimais} />
      <Tab.Screen name="Agenda" component={Agenda} />
      <Tab.Screen name="Chat" component={Chat} />
    </Tab.Navigator>
  );
}