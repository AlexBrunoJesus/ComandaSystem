import * as React from 'react';
import { 
  Provider as PaperProvider,
  MD3DarkTheme, 
  MD3LightTheme as DefaultTheme
} from 'react-native-paper';

import { 
  NavigationContainer, 
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme
} from '@react-navigation/native';


import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from './src/components/context';

import Routers from './src/screens/routers/drawerScreen'; // App logado
import RootStackScreen from './src/screens';       // Login/Register/Splash



const App = () => {
  const [isDarkTheme, setIsDarkTheme] = React.useState(false);

  const CustomDefaultTheme = {
    ...NavigationDefaultTheme,
    ...DefaultTheme,
    colors: {
      ...NavigationDefaultTheme.colors,
      ...DefaultTheme.colors,
      background: '#ffffff',
      text: '#333333'
    }
  };

  const CustomDarkTheme = {
    ...NavigationDarkTheme,
    ...MD3DarkTheme,
    colors: {
      ...NavigationDarkTheme.colors,
      ...MD3DarkTheme.colors,
      background: '#333333',
      text: '#ffffff'
    }
  };

  const theme = isDarkTheme ? CustomDarkTheme : CustomDefaultTheme;

  const initialLoginState = {
    isLoading: true,
    userName: null,
    userToken: null,
  };

  const loginReducer = (prevState, action) => {
    switch(action.type) {
      case 'RETRIEVE_TOKEN': 
        return { ...prevState, userToken: action.token, isLoading: false };
      case 'LOGIN': 
        return { ...prevState, userName: action.id, userToken: action.token, isLoading: false };
      case 'LOGOUT': 
        return { ...prevState, userName: null, userToken: null, isLoading: false };
      case 'REGISTER': 
        return { ...prevState, userName: action.id, userToken: action.token, isLoading: false };
      default:
        return prevState;
    }
  };

  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);

  React.useEffect(() => {
    setTimeout(async() => {
      let userToken = null;
      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch(e) {
        console.log(e);
      }
      dispatch({ type: 'RETRIEVE_TOKEN', token: userToken });
    }, 1000);
  }, []);

  const authContext = React.useMemo(() => ({
    signIn: async(token, userName) => {
      try {
        // salva só string
        await AsyncStorage.setItem('userToken', String(token));
      } catch(e) {
        console.log(e);
      }
      dispatch({ type: 'LOGIN', id: userName, token: String(token) });
    },
    signOut: async() => {
      try {
        await AsyncStorage.removeItem('userToken');
      } catch(e) {
        console.log(e);
      }
      dispatch({ type: 'LOGOUT' });
    },
    signUp: () => {
      // registrar usuário
    },
    toggleTheme: () => {
      setIsDarkTheme(isDarkTheme => !isDarkTheme);
    }
  }), []);

  if (loginState.isLoading) {
    // opcional: tela de loading
    return null;
  }

  return (
    <PaperProvider theme={theme}>
      <AuthContext.Provider value={authContext}>
        <NavigationContainer theme={theme}>
          { loginState.userToken !== null ? (
              <Routers />     // usuário logado -> Routers
            ) : (
              <RootStackScreen />  // não logado -> Login/SignUp/Splash
            )
          }
        </NavigationContainer>
      </AuthContext.Provider>
    </PaperProvider>
  );
}

export default App;
