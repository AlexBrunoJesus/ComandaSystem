import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Feather from 'react-native-vector-icons/Feather';

import StackRouter from './stackScreen';
import NotificationsScreen from '../NotificationsScreen/NotificationsScreen';

import ProductsScreen from "../ProdutosScreen";
import CreateProductScreen from "../ProdutosScreen/CreateProductScreen";

const Drawer = createDrawerNavigator();

export default function DrawerRouter() {
  return (
      <Drawer.Navigator
        initialRouteName="HomeStack"
        screenOptions={{
          headerShown: false,
          drawerActiveTintColor: '#fff',
          drawerActiveBackgroundColor: '#4169e1',
          drawerStyle: { backgroundColor: '#f8f8f8' },
        }}
      >
        <Drawer.Screen
          name="HomeStack"
          component={StackRouter}
          options={{
            title: 'Início',
            drawerIcon: ({ color, size }) => (
              <Feather name="home" size={size} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="Notifications"
          component={NotificationsScreen}
          options={{
            title: 'Notificações',
            drawerIcon: ({ color, size }) => (
              <Feather name="bell" size={size} color={color} />
            ),
          }}
        />

          <Drawer.Screen
            name="Products"
            component={ProductsScreen}
            options={{ title: "Produtos" }}
        />
         <Drawer.Screen
            name="CreateProduct"
            component={CreateProductScreen}
            options={{
              title: "Novo Produto",
              drawerItemStyle: { display: "none" }, // 👈 OCULTA DO DRAWER
            }}
        />


      </Drawer.Navigator>
  );
}
