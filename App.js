import React from 'react';
import { StyleSheet, Text, View, Dimensions, Platform, InteractionManager} from 'react-native';
import  Ionicons  from 'react-native-vector-icons/Ionicons';
import { getStatusBarHeight } from 'react-native-status-bar-height';


import SideMenu from './src/componentes/sidemenu'
import Login from './src/telas/login';
import ListaPedidos from './src/telas/listapedidos';
import Categorias from './src/telas/categorias'
import Abaixoassinado from './src/telas/abaixoassinado'
import Criarmodificar from './src/telas/criarmodificar'
import Menu from './src/telas/menu'
import Cadastro from './src/telas/cadastro'
import Sobre from './src/telas/sobre'
import Ajuda from './src/telas/ajuda'

import Inicio from './src/telas/inicio'

//Telas impulsionamento
import Carrinho from './src/telas/impulsionamento/carrinho'
import Pagamento from './src/telas/impulsionamento/pagamento'
import ListaPagamentos from './src/telas/impulsionamento/listapagamentos'

//Telas admin import
import AdminMenu from './src/telas/admin/adminmenu'
import Adminmanifestos from './src/telas/admin/adminManifestos'
import AbaixoAdmin from './src/telas/admin/abaixoadmin'
import EditarSobre from './src/telas/admin/editarsobre'
import EditarAjuda from './src/telas/admin/editarajuda'

import { Provider } from 'react-redux';
import store from './src/redux/store/index'



const _setTimeout = global.setTimeout;
const _clearTimeout = global.clearTimeout;
const MAX_TIMER_DURATION_MS = 60 * 1000;


import {  SafeAreaView,createAppContainer, createSwitchNavigator,createMaterialTopTabNavigator} from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import {createDrawerNavigator} from 'react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack';



const getCurrentRoute = (navigationState) => {
  if (!navigationState) {
    return null
  } else if (!navigationState.routes) {
    return navigationState
  }

  const route = navigationState.routes[navigationState.index]
  if (route.routes) {
    return getCurrentRoute(route)
  }

  return route
}

const InicioStack = createStackNavigator({
  Inicio:Inicio,
  AbaixoInicio:Abaixoassinado
},{
  initialRouteName:'Inicio',
  title:'Inicio'
})
const HomeStack = createStackNavigator({
  Home: ListaPedidos,  
  Categorias:Categorias,
  Abaixoassinado:Abaixoassinado,
  CriarHome:Criarmodificar

}, {
    initialRouteName: 'Categorias',
    title:'Menu'

  });
const CriarModificarStack = createStackNavigator({
  Criarmodificar: Criarmodificar,
 

}, {
    initialRouteName: 'Criarmodificar',


  });
const SobreStack = createStackNavigator({
  Sobre: Sobre,


}, {
    initialRouteName: 'Sobre',


  });
  const AjudaStack = createStackNavigator({
    Ajuda: Ajuda,
  
  
  }, {
      initialRouteName: 'Ajuda',
  
  
    });
const MenuStack = createStackNavigator({
  Menu:Menu,
  Meusabaixos: ListaPedidos,
  Abaixoassinado: Abaixoassinado,
  Editar:Criarmodificar,

},{
  initialRouteName:'Menu',
  
})

//Admin Stack

const AdminStack = createStackNavigator({
  Adminmanifestos: Adminmanifestos,
  Abaixoassinado:Abaixoassinado,
  AdminMenu:AdminMenu,
  AbaixoAdmin:AbaixoAdmin,
  EditarSobre:EditarSobre,
  EditarAjuda:EditarAjuda
  
},{initialRouteName:'AdminMenu'})
HomeStack.navigationOptions ={
  tabBarLabel:'Menu'
}
MenuStack.navigationOptions = {
  tabBarLabel:'Home'
}
const Routes = {
  TabStack: { key: "TabStack" },
  Screen1:{key:'Principal'},
  Screen2: { key: "Menu", },
  //Screen2: { key: "Criar",  },
  Screen3: { key: "Home",  },

}
const TabNavigator = createBottomTabNavigator({
  [Routes.Screen1.key]: { screen: InicioStack},

  [Routes.Screen2.key]: { screen: MenuStack },
  //[Routes.Screen2.key]: { screen: CriarModificarStack},
  [Routes.Screen3.key]: { screen: HomeStack },
},{
  initialRouteName:Routes.Screen1.key,
  
    defaultNavigationOptions: ({ navigation }) => ({
      
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let IconComponent = Ionicons;
        let iconName;
        if (routeName === 'Home') {
          iconName = `md-menu`;
          // Sometimes we want to add badges to some icons. 
          // You can check the implementation below.
          
        } 
        if (routeName === 'Assinar') {
          iconName = `ios-checkmark-circle` ;
         
        }
        if (routeName === 'Criar') {
          iconName = 'md-create'
        }
        if (routeName === 'Menu') {
          iconName = 'md-home'
        }
        if (routeName === 'Principal') {
          iconName = 'md-megaphone'
        }
        // You can return any component that you like here!
        return <IconComponent name={iconName} size={25} color={tintColor} />;
      },
      
    }),
  tabBarOptions:{
    activeTintColor:'#fff',
    inactiveTintColor:'#fff',
    indicatorStyle:{
      backgroundColor:'black'
    },
    style:{
      backgroundColor:'#ff6600'
    }
  }
})

const ImpulsionarStack = createStackNavigator({
  Carrinho:Carrinho,
  Pagamento:Pagamento,
  ListaPagamentos:ListaPagamentos
},{
  initialRouteName:'Carrinho'
})
const Drawer = createDrawerNavigator({
  Home: {
    screen: TabNavigator,
  },
  ListaPedidos: {
    screen: TabNavigator
  },
  Cadastro:{
    screen:Cadastro
  },
  Impulsionar:{
    screen:ImpulsionarStack
  },
  Admin:{
    screen:AdminStack
  },
  Ajuda:{
    screen:AjudaStack
  },
  Sobre:{
    screen:SobreStack
  }

}, {
    contentComponent: SideMenu,
    drawerWidth: 300
  })
const RootStack = createSwitchNavigator({
  Login: Login, 
  ListaPedidos: Drawer
 
}, {
    initialRouteName: 'Login',
   
  });

const AppContainer = createAppContainer(RootStack);
import firebase from 'react-native-firebase';
import { AccessToken, LoginManager } from "react-native-fbsdk";
export default class App extends React.Component {
 
  componentDidMount = async () =>{
   
    console.log('INICIOU O APP REACT')
    if (Platform.OS === 'android') {
      // Work around issue `Setting a timer for long time`
      // see: https://github.com/firebase/firebase-js-sdk/issues/97
      const timerFix = {};
      const runTask = (id, fn, ttl, args) => {
        const waitingTime = ttl - Date.now();
        if (waitingTime <= 1) {
          InteractionManager.runAfterInteractions(() => {
            if (!timerFix[id]) {
              return;
            }
            delete timerFix[id];
            fn(...args);
          });
          return;
        }

        const afterTime = Math.min(waitingTime, MAX_TIMER_DURATION_MS);
        timerFix[id] = _setTimeout(() => runTask(id, fn, ttl, args), afterTime);
      };

      global.setTimeout = (fn, time, ...args) => {
        if (MAX_TIMER_DURATION_MS < time) {
          const ttl = Date.now() + time;
          const id = '_lt_' + Object.keys(timerFix).length;
          runTask(id, fn, ttl, args);
          return id;
        }
        return _setTimeout(fn, time, ...args);
      };

      global.clearTimeout = id => {
        if (typeof id === 'string' && id.startWith('_lt_')) {
          _clearTimeout(timerFix[id]);
          delete timerFix[id];
          return;
        }
        _clearTimeout(id);
      };
    }
    
  }
  render() {
    return (
      <Provider store={store}>
      <SafeAreaView style={{ flex: 1 ,marginTop:-(getStatusBarHeight())}}>

        <AppContainer />

      </SafeAreaView>
      </Provider>
    );
  }
}

{
  /**
   * 
   *export default class App extends React.Component {
  constructor() {
    super();
    this.state = {};
    this.facebookLogin.bind(this)
    this.componentDidMount.bind(this)
  }

  async componentDidMount() {
    firebase.auth().onAuthStateChanged((user)=>{
      console.log('USUARIO AUTENTICADO',user)
    })
  }
  async facebookLogin() {
    try {
      console.log('LOGIN COM O FACEBOOK')
      const result = await LoginManager.logInWithPermissions([
        "public_profile",
        "email",
      ]);
      if (result.isCancelled) {
        // handle this however suites the flow of your app
        throw new Error("User cancelled request");
      }

      console.log(
        `Login sucesso com permissão: ${result.grantedPermissions.toString()}`
      );

      // get the access token
      const data = await AccessToken.getCurrentAccessToken();

      if (!data) {
        // handle this however suites the flow of your app
        throw new Error(
          "Não foi possivel conseguir o token"
        );
      }

      // create a new firebase credential with the token
      const credential = firebase.auth.FacebookAuthProvider.credential(
        data.accessToken
      );
      console.log('CREDENCIAL',credential)

      // login with credential
      const firebaseUserCredential = await firebase
        .auth()
        .signInWithCredential(credential);

      console.warn(JSON.stringify(firebaseUserCredential.user.toJSON()));
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <Image source={require('./assets/ReactNativeFirebase.png')} style={[styles.logo]}/>
          <Text style={styles.welcome}>
            Welcome to {'\n'} React Native Firebase
          </Text>
          <TouchableOpacity onPress={this.facebookLogin.bind(this)}>
            <Text>Login facebook</Text>
          </TouchableOpacity>
          <Text style={styles.instructions}>
            To get started, edit App.js
          </Text>
          {Platform.OS === 'ios' ? (
            <Text style={styles.instructions}>
              Press Cmd+R to reload,{'\n'}
              Cmd+D or shake for dev menu
            </Text>
          ) : (
            <Text style={styles.instructions}>
              Double tap R on your keyboard to reload,{'\n'}
              Cmd+M or shake for dev menu
            </Text>
          )}
          <View style={styles.modules}>
            <Text style={styles.modulesHeader}>The following Firebase modules are pre-installed:</Text>
            {firebase.admob.nativeModuleExists && <Text style={styles.module}>admob()</Text>}
            {firebase.analytics.nativeModuleExists && <Text style={styles.module}>analytics()</Text>}
            {firebase.auth.nativeModuleExists && <Text style={styles.module}>auth()</Text>}
            {firebase.config.nativeModuleExists && <Text style={styles.module}>config()</Text>}
            {firebase.crashlytics.nativeModuleExists && <Text style={styles.module}>crashlytics()</Text>}
            {firebase.database.nativeModuleExists && <Text style={styles.module}>database()</Text>}
            {firebase.firestore.nativeModuleExists && <Text style={styles.module}>firestore()</Text>}
            {firebase.functions.nativeModuleExists && <Text style={styles.module}>functions()</Text>}
            {firebase.iid.nativeModuleExists && <Text style={styles.module}>iid()</Text>}
            {firebase.links.nativeModuleExists && <Text style={styles.module}>links()</Text>}
            {firebase.messaging.nativeModuleExists && <Text style={styles.module}>messaging()</Text>}
            {firebase.notifications.nativeModuleExists && <Text style={styles.module}>notifications()</Text>}
            {firebase.perf.nativeModuleExists && <Text style={styles.module}>perf()</Text>}
            {firebase.storage.nativeModuleExists && <Text style={styles.module}>storage()</Text>}
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  logo: {
    height: 120,
    marginBottom: 16,
    marginTop: 64,
    padding: 10,
    width: 135,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  modules: {
    margin: 20,
  },
  modulesHeader: {
    fontSize: 16,
    marginBottom: 8,
  },
  module: {
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  }
});

   */
}
