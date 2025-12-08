import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Feather from 'react-native-vector-icons/Feather';

import HomeScreen from '../HomeScreen/HomeScreen';
import DetailsScreen from '../DetailsScreen/DetailsScreen';
import CreateComandaScreen from "../CreateComandaScreen";
import ComandaDetalhesScreen from "../ComandaDetalhesScreen";

const Stack = createStackNavigator();

export default function StackRouter({ navigation }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#11c211ff' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Início',
          headerLeft: () => (
            <Feather.Button
              name="menu"
              size={25}
              backgroundColor="#11c211ff"
              onPress={() => navigation.openDrawer()}
            />
          ),
          headerRight: () => (
            <Feather.Button
              name="search"
              size={25}
              backgroundColor="#11c211ff"
              onPress={() => alert('Buscar...')}
            />
          ),
        }}
      />
      
      <Stack.Screen name="CreateComanda" 
        component={CreateComandaScreen} 
        options={{ title: "Nova Comanda" }} 
      />

      <Stack.Screen name="ComandaDetalhes" 
        component={ComandaDetalhesScreen} 
        options={{ title: "" }} 
      />

      <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={{ title: 'Detalhes' }}
      />
    </Stack.Navigator>
  );
}
