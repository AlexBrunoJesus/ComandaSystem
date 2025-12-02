import React, { useState, useContext } from 'react';
import { 
  View, Text, TouchableOpacity, TextInput,
  Platform, StyleSheet, ScrollView, StatusBar, Alert
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import Feather from '@react-native-vector-icons/feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';
import { AuthContext } from '../../components/context';

const SignUpScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [data, setData] = useState({ secureTextEntry: true });

  const { signIn } = useContext(AuthContext);

  const updateSecureTextEntry = () => {
    setData({ ...data, secureTextEntry: !data.secureTextEntry });
  };

  const sendCred = async () => {
    if (!name || !email || !password) {
      Alert.alert("Campos obrigatórios", "Preencha nome, e-mail e senha.");
      return;
    }

    try {
      const res = await api.post("/auth/register", { name, email, password });

      if (res.data?.token) {
        const token = res.data.token;

        // 💾 Salva token localmente
        await AsyncStorage.setItem("token", token);

        // Atualiza contexto de autenticação
        signIn({ token, email });

        // 🚀 Navega automaticamente para a tela principal
        // Ajuste o nome da tela conforme seu RootStack, ex: "HomeScreen"
        navigation.replace('HomeScreen'); 
      } else {
        Alert.alert("Erro", res.data?.error || "Não foi possível registrar.");
      }
    } catch (error) {
      console.error("Erro no registro:", error);
      if (error.response) {
        Alert.alert("Falha no cadastro", error.response.data?.error || "Verifique os dados e tente novamente.");
      } else {
        Alert.alert("Erro de conexão", "Não foi possível conectar ao servidor.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#4169e1" barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.text_header}>Register Now!</Text>
      </View>

      <Animatable.View animation="fadeInUpBig" style={styles.footer}>
        <ScrollView>
          {/* Nome */}
          <Text style={styles.text_footer}>Name</Text>
          <View style={styles.action}>
            <FontAwesome6 name="user-o" color="#05375a" size={20} />
            <TextInput
              placeholder="Your name"
              style={styles.textInput}
              autoCapitalize="none"
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Email */}
          <Text style={[styles.text_footer, { marginTop: 35 }]}>Email</Text>
          <View style={styles.action}>
            <FontAwesome6 name="envelope" color="#05375a" size={20} />
            <TextInput
              placeholder="Your Email"
              style={styles.textInput}
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Senha */}
          <Text style={[styles.text_footer, { marginTop: 35 }]}>Password</Text>
          <View style={styles.action}>
            <Feather name="lock" color="#05375a" size={20} />
            <TextInput
              placeholder="Your Password"
              secureTextEntry={data.secureTextEntry}
              style={styles.textInput}
              autoCapitalize="none"
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={updateSecureTextEntry}>
              <Feather
                name={data.secureTextEntry ? "eye-off" : "eye"}
                color="grey"
                size={20}
              />
            </TouchableOpacity>
          </View>

          {/* Termos */}
          <View style={styles.textPrivate}>
            <Text style={styles.color_textPrivate}>By signing up you agree to our</Text>
            <Text style={[styles.color_textPrivate, { fontWeight: 'bold' }]}> Terms of service </Text>
            <Text style={styles.color_textPrivate}>and</Text>
            <Text style={[styles.color_textPrivate, { fontWeight: 'bold' }]}> Privacy policy</Text>
          </View>

          {/* Botões */}
          <View style={styles.button}>
            <TouchableOpacity style={styles.signIn} onPress={sendCred}>
              <LinearGradient colors={['#6A5ACD', '#0000CD']} style={styles.signIn}>
                <Text style={[styles.textSign, { color: '#fff' }]}>Sign Up</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={[styles.signIn, { borderColor: '#4169e1', borderWidth: 1, marginTop: 15 }]}
            >
              <Text style={[styles.textSign, { color: '#4169e1' }]}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animatable.View>
    </View>
  );
};

export default SignUpScreen;
