import React, { Component } from 'react';
import {Modal, View, Text, StyleSheet,BackHandler, Dimensions, Image, ScrollView, TouchableOpacity ,TouchableWithoutFeedback } from 'react-native';
import { NavigationActions } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AntDesign from  'react-native-vector-icons/AntDesign'
import Cadastro from '../telas/cadastro'
import LinearGradient from 'react-native-linear-gradient';
import firebase from 'react-native-firebase'
const { height, width } = Dimensions.get('window');

export default class SideMenu extends Component {
   
    constructor(props) {
        super(props)
        state={
            modalVisible:false,
            usuario:{}
        }
    }
    state={
        modalVisible:false,
        usuario:{}
    }
    onBackButtonPressAndroid = () => {
        if (this.isSelectionModeEnabled()) {
          this.disableSelectionMode();
          return true;
        } else {
          return false;
        }
      };
    setModalVisible = (visible) =>{
        this.setState({modalVisible:visible})
    }
    navigateToScreen = (route) => {
        console.log('ativou navegacao')
        const navigateAction = NavigationActions.navigate({
            routeName: route
        });
        this.props.navigation.dispatch(navigateAction);
    }
    logout = async () =>{
       await firebase.auth().signOut()
       await AsyncStorage.removeItem('CREDENCIAL')
       this.props.navigation.navigate('Login')
    }
    componentDidMount = () =>{
     
    }
    componentWillMount = async () =>{
        //carrega o usuario que vem dos parametros para mostragem de foto e informações para o cadastro
         let usuario =await AsyncStorage.getItem('USUARIO')
         console.log('USUARIO DO ASYNC',usuario)
         usuario = JSON.parse(usuario)
        console.log('USUARIO NO SIDEMENU',usuario)
        this.setState({usuario})
     
    }
    componentWillUnmount = () =>{
      
    }
    
    render() {
        const size = 25
        const iconecolor = "#ff6600"
        const usuario = this.state.usuario
        
        return (
            <LinearGradient colors={['#fda117', '#fd9417','#fd8817','#fd7317']} style={styles.container}>
                <Modal  animationType='fade' transparent={false} visible={this.state.modalVisible} onRequestClose={()=>{this.setState({modalVisible:false})}}
                >   
                 
                        <Cadastro usuario={usuario} />
                 
                
                </Modal>
                <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('Cadastro', { usuario })}>
                    <View style={styles.usuarioContainer}>
                        {
                           (usuario && usuario.hasOwnProperty('photoURL') && usuario.photoURL) ?  (<Image source={{ uri: usuario.photoURL }} resizeMode='contain' style={{ width: 80, height: 80, borderRadius: 80 / 2, marginBottom: height * 0.05, marginTop: height * 0.05, }} />):(<Image source={require('../../assets/logofinal.jpg')} resizeMode='contain' style={{ width: 80, height: 80, borderRadius: 80 / 2, marginBottom: height * 0.05, marginTop: height * 0.05, }} />)
                        }
                       


                       
                            <View style={styles.usuariotextContainer}>
                                <Text style={styles.text}>Olá,</Text>
                                {
                                    //So mostra o primeiro nome do usuario
                                   (usuario && usuario.hasOwnProperty('nome') && usuario.nome) ?  (<Text style={styles.texticone}>{usuario.nome.split(' ')[0]}</Text>):(<Text style={styles.texticone}>Usuario</Text>)
                                }
                               
                                <Text style={{ color: '#ff6600', fontFamily: 'comfortae',marginLeft:25 }} >Editar Perfil</Text>
                            </View>
                      

                    </View>
                </TouchableWithoutFeedback>
               
                
                <View style={{}}>
                    <TouchableOpacity onPress={()=>{this.props.navigation.navigate('Ajuda')}} style={[styles.linkscontainer,{marginTop:10}]}>
                        <MaterialCommunityIcons name='home-outline' color={iconecolor} size={size} />
                        <Text style={styles.texticone}>Ajuda</Text>
                    </TouchableOpacity>
                    {
                        (this.state.usuario && this.state.usuario.hasOwnProperty('isAdmin') && this.state.usuario.isAdmin) ?  
                            (<TouchableOpacity onPress={()=>this.props.navigation.navigate('AdminMenu')} style={[styles.linkscontainer, { marginTop: 10 }]}>
                                <MaterialCommunityIcons name='clipboard' color={iconecolor} size={size} />
                                <Text style={styles.texticone}>Admin</Text>
                            </TouchableOpacity>) : null

                        
                    }
                    <TouchableOpacity onPress={()=>{this.props.navigation.navigate('Impulsionar')}} style={styles.linkscontainer}>
                        <AntDesign name='creditcard' color={iconecolor} size={size} />
                        <Text style={styles.texticone}>Impulsionar</Text>
                    </TouchableOpacity>
                    {
                        /*
                        Atalho para impulsionar
                         
                        
                         */
                    }
                   


                    <TouchableOpacity onPress={()=>{this.props.navigation.navigate('Sobre')}} style={styles.linkscontainer}>
                        <AntDesign name='creditcard' color={iconecolor} size={size} />
                        <Text style={styles.texticone}>Sobre</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={()=>this.logout()} style={styles.linkscontainer}>
                        <AntDesign name='bells' color={iconecolor} size={size} />
                        <Text style={styles.texticone}>Desconectar</Text>
                    </TouchableOpacity>

                     <TouchableOpacity onPress={()=>BackHandler.exitApp()} style={styles.linkscontainer}>
                        <AntDesign name='poweroff' color={iconecolor} size={size} />
                        <Text style={styles.texticone}>Sair</Text>
                    </TouchableOpacity>
                </View>
                


            </LinearGradient>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        height,
        justifyContent: 'flex-start',
        flexDirection: 'column',
        paddingLeft: width * 0.01,
        marginTop:getStatusBarHeight(),

    },
    linkscontainer: {
        flexDirection: 'row',
        marginTop:5,
        marginBottom: 20,
        backgroundColor:'#fff',
        paddingLeft:15,
        width:'100%',
        alignItems:'center',
        paddingBottom: 3,
        paddingTop: 3,
        borderRadius:5



    },
    text:{
        fontSize:20,
        color:'#ff6600',
        fontFamily:'comfortae',
        alignSelf: 'flex-start',
        marginLeft: 15,
    },
    texticone: {
        fontSize: 20,
        
        marginLeft: 15,
        color:'#fff',
        fontFamily:'comfortae',
        color:'#ff6600'

    },
    usuarioContainer:{
        flexDirection:'row',
        alignItems: 'center',
        backgroundColor:'#fff',
        borderColor:'#336699',
        paddingLeft:10,
        borderRadius:5,
        marginTop:5
    },
    usuariotextContainer:{
        flexDirection:'column',
        alignItems:'center'
    }
})