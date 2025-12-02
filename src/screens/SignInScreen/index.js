import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput,
  Platform,
  StyleSheet,
  StatusBar,
  Alert
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import Feather from '@react-native-vector-icons/feather';
import { useTheme } from 'react-native-paper';
import AsyncStorage from "@react-native-async-storage/async-storage"; // ✅ novo
import { AuthContext } from '../../components/context';
import api from '../../services/api'; // axios configurado

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { colors } = useTheme();
  const { signIn } = React.useContext(AuthContext);

  const sendCred = async () => {
    if (!email || !password) {
      Alert.alert("Campos obrigatórios", "Informe o e-mail e a senha.");
      return;
    }

    try {
      // 🔐 Faz login no backend
      const res = await api.post('/auth/login', { email, password });

      if (res.data?.token) {
        const token = res.data.token;

        // 💾 Salva o token no armazenamento local
        await AsyncStorage.setItem("token", token);

        // Atualiza o contexto de autenticação (se existir)
        signIn({ token, email });

        // Navega para a próxima tela (exemplo: tela principal)
        // navigation.replace('HomeScreen'); // descomente e ajuste se precisar
      } else {
        Alert.alert("Login falhou", res.data?.error || "Usuário ou senha incorretos.");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      if (error.response) {
        const msg = error.response.data?.error || "Falha na autenticação.";
        Alert.alert("Erro de Login", msg);
      } else {
        Alert.alert("Erro de Conexão", "Não foi possível conectar ao servidor.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#4169e1" barStyle="light-content"/>
      <View style={styles.header}>
        <Text style={styles.text_header}>Welcome!</Text>
      </View>

      <Animatable.View 
        animation="fadeInUpBig"
        style={[styles.footer, { backgroundColor: colors.background }]}
      >
        <Text style={[styles.text_footer, { color: colors.text }]}>Email</Text>
        <View style={styles.action}>
          <FontAwesome6 name="user-o" color={colors.text} size={20}/>
          <TextInput 
            placeholder="Your Email"
            placeholderTextColor="#666666"
            style={[styles.textInput, { color: colors.text }]}
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <Text style={[styles.text_footer, { color: colors.text, marginTop: 35 }]}>
          Password
        </Text>
        <View style={styles.action}>
          <Feather name="lock" color={colors.text} size={20}/>
          <TextInput 
            placeholder="Your Password"
            placeholderTextColor="#666666"
            secureTextEntry
            style={[styles.textInput, { color: colors.text }]}
            autoCapitalize="none"
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity>
          <Text style={{ color: '#4169e1', marginTop:15 }}>Forgot password?</Text>
        </TouchableOpacity>

        <View style={styles.button}>                
          <TouchableOpacity style={styles.signIn} onPress={sendCred}>
            <LinearGradient colors={['#6A5ACD', '#0000CD']} style={styles.signIn}>
              <Text style={[styles.textSign, { color:'#fff' }]}>Sign In</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('SignUpScreen')}
            style={[styles.signIn, {
              borderColor: '#4169e1',
              borderWidth: 1,
              marginTop: 15
            }]}
          >
            <Text style={[styles.textSign, { color: '#4169e1' }]}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </View>
  );
};

export default SignInScreen;

// 💅 Estilos originais (sem mudanças)
const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#4169e1'
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 50
  },
  footer: {
    flex: 3,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30
  },
  text_footer: {
    color: '#05375a',
    fontSize: 18
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },
  button: {
    alignItems: 'center',
    marginTop: 50
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold'
  }
});
