import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, Dimensions,  } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import firebase from 'react-native-firebase'
import Botao from '../componentes/botao'
import {connect } from 'react-redux'
import {iniciarAtualizarUsuario} from '../redux/actions/index'
import { AccessToken, LoginManager } from "react-native-fbsdk";

const {width,height} = Dimensions.get('window')
//const functions = require('react-native-firebase');

class Login extends Component {
    
    
    //1
    async checkPermission() {
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            this.getToken();
        } else {
            this.requestPermission();
        }
    }
    //3
    async getToken() {
       // let fcmToken = await AsyncStorage.getItem('fcmToken');
       // if (!fcmToken) {
 //       firebase.auth().onAuthStateChanged(async (user) => {
            const fcmToken = await firebase.messaging().getToken();
            return fcmToken;
 //           if (fcmToken) {
                // user has a device token
 //               await AsyncStorage.setItem('fcmToken', fcmToken);
 //               firebase.database().ref('/usuarios/' + user.providerData[0].uid).update({token:fcmToken})
 //           }
 //       })
     //   }
    }
    //2
    async requestPermission() {
        try {
            await firebase.messaging().requestPermission();
            // User has authorised
            this.getToken();
        } catch (error) {
            // User has rejected permissions
            console.log('permission rejected');
        }
    }
    
    constructor(props) {
        super(props)
        this.state = {
            fontLoaded:true
        }
    }
   
    static navigationOptions = {
        header: null

    };
   
   
    componentDidMount = async () =>{
        //Verifica se algum login ja foi feito
        //caso exista fara o login no firebase com a credencial salva no celular
        //e atualizara as informações do celular com as informações do banco de dados
        try{
            
            const credential = await AsyncStorage.getItem('credential');
            if(credential){
                 firebase.auth().signInAndRetrieveDataWithCredential(credential).catch((error) => {
                    // mostra algum erro do login
                    console.log(error)
                });
            }
            
            firebase.auth().onAuthStateChanged(async (user) => {
                if (user != null) {
                    console.log("Autenticação salva");
                    firebase.database().ref('/usuarios/' + user.providerData[0].uid).once('value',async (snapshot)=>{
                        //Checando se o usuario está sem o user.uid
                        if(!user.providerData[0].uid || (user.providerData[0].uid === undefined)){
                            //se está sem o uid mostrar um alerta que n foi possivel logar e apaga a credencial
                            //removendo a credencial
                            AsyncStorage.removeItem('credential')
                            Alert.alert(
                                'Algum erro aconteceu no login do facebook',
                                'Login pelo facebook indisponível. Tente novamente em alguns instantes.',
                                [
                
                                    { text: 'OK', onPress: () => console.log('saiu') },
                                ],
                                { cancelable: true },
                            );
                            return

                        }
    //                    this.checkPermission()  
                        console.log('USUARIO',snapshot.val())
                        let usuariofire  = snapshot.val()
                        let usuario = {}
                        Object.assign(usuario,{
                            cep:usuariofire.cep,
                            cidade:usuariofire.cidade,
                            complemento:usuariofire.complemento,
                            cpf:usuariofire.cpf,
                            displayName:usuariofire.displayName,
                            email:usuariofire.email,
                            estado:usuariofire.estado,
                            nome:usuariofire.nome,
                            numero:usuariofire.numero,
                            photoURL:usuariofire.photoURL,
                            providerId:usuariofire.providerId,
                            rua:usuariofire.rua,
                            sobrenome:usuariofire.sobrenome,
                            sobrenome:usuariofire.sobrenome,
                            token:this.checkPermission(),
                            uid:usuariofire.uid
                        })
                        if(usuariofire.isAdmin){
                            Object.assign(usuario,{
                                isAdmin:usuariofire.isAdmin
                            })
                        }
                        //atualiza o bancod e dados com informações atualizadas do usuario
                        this.props.iniciarAtualizarUsuario({...usuariofire})
                        //await AsyncStorage.setItem('USUARIO', JSON.stringify(usuario))
                        this.props.navigation.navigate("Inicio", { usuario })
                    })
             /*       firebase.messaging().getToken()
                        .then((fcmToken) => {
                            if (fcmToken) {
                                var token = fcmToken
                                console.log('token', token)
                                firebase.database().ref('/usuarios/' + user.providerData[0].uid).update({token:token})
                                
                                
                            }
                        }).catch((err) => console.log('err', err + ' ops')) */
                        //firebase.database().ref('/usuarios/' + user.providerData[0].uid).update({token:fcmToken})
                                   
                }

                // Do other things

            });
        }catch(error){
            console.log(error)
        }
    }
    goHome = async () => {
        //caso o usuario nao possua login,fara login no facebook e recuperara o token de autenticação
        //token do expo para poder abrir o aplicativo do facebook para login no celular
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
            const credential = firebase.auth.FacebookAuthProvider.credential(
                data.accessToken
             );
           // create a new firebase credential with the token
                
        if (true) {
            // constroi o token de autorizalçap
            

        
            // faz o login com a credencial fornecida pelo facebook
            const firebaseUserCredential = await firebase
            .auth()
            .signInWithCredential(credential);
            //ao se fazer o login o
            firebase.auth().onAuthStateChanged(async (user) => {
                if (user != null) {
                
                    console.log("Usuario autenticado");
                    console.log(user.providerData[0])
                    firebase.database().ref('/usuarios/'+user.providerData[0].uid).once('value',async (snapshot)=>{
                        //Checando se o usuario está sem o user.uid
                        if(!user.providerData[0].uid || (user.providerData[0].uid === undefined)){
                            //se está sem o uid mostrar um alerta que n foi possivel logar e apaga a credencial
                            //removendo a credencial
                            AsyncStorage.removeItem('credential')
                            Alert.alert(
                                'Algum erro aconteceu no login do facebook',
                                'Login pelo facebook indisponível. Tente novamente em alguns instantes.',
                                [
                
                                    { text: 'OK', onPress: () => console.log('saiu') },
                                ],
                                { cancelable: true },
                            );
                            return

                        }

                   /*     firebase.messaging().getToken()
                        .then((fcmToken) => {
                            if (fcmToken) {
                                var token = fcmToken
                                console.log('token', token)
                                firebase.database().ref('/usuarios/' + user.providerData[0].uid).update({token:token})
                                
                                
                            }
                        }).catch((err) => console.log('err', err + ' ops')) */
                        //firebase.database().ref('/usuarios/' + user.providerData[0].uid).update({token:fcmToken})
                        

                        usuario = snapshot.val()
                        if( usuario !== null){
                            this.props.navigation.navigate("Inicio", { usuario:{ ...usuario} })
                        await  AsyncStorage.setItem('USUARIO', JSON.stringify({...usuario}))

                            try{
                                AsyncStorage.setItem('credential', credential)
                                this.checkPermission()
                            }catch(error){
                                console.log(error)
                            }
                        }else{
 //                           this.checkPermission()


                            firebase.database().ref('/usuarios/' + user.providerData[0].uid).update({ uid:user.providerData[0].uid,token:this.checkPermission(),nome:user.displayName ,displayName:user.displayName,email:user.email,photoURL:user.photoURL })
                            await AsyncStorage.setItem('USUARIO', JSON.stringify({ uid:user.providerData[0].uid,token:this.checkPermission(),nome:user.displayName ,displayName:user.displayName,email:user.email,photoURL:user.photoURL}))
                            this.props.navigation.navigate("Inicio", { usuario:{  uid:user.providerData[0].uid,token:this.checkPermission(),nome:user.displayName ,displayName:user.displayName,email:user.email,photoURL:user.photoURL} })
                            try{
                                AsyncStorage.setItem('credential', credential)
                            }catch(error){
                                console.log(error)
                            }

                        }
                    })
                
                
                }

                
            });
        
        }
        
       
    }
    render() {
        const { width, height } = Dimensions.get('window');
        return (
            <View style={styles.container}>
                <View style={[styles.logoicone, { marginTop: height * 0.05 }]}>
                    <Image style={styles.icone} resizeMode='cover' source={require('../../assets/logofinal.jpg')} />
                </View>
                <View style={styles.mensagemcontainer}>
                {
                        this.state.fontLoaded ? (<Text style={styles.textprincipal}>Abaixo Assinado</Text>) : null
                }
                   
                  
                </View>
                <View style={[styles.loginform, { width: width * 0.9, }]}>
                  <Botao icone={true} onpress={this.goHome} titulo='Logar com Facebook' />
                </View>
              
          
               

            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        width: '100%',
        height: '100%',
        marginTop:height * 0.05
    },
    logoicone: {
        justifyContent: 'center',
        alignItems: 'center',

    },
    icone: {
        width: width ,
        height: height * 0.6
    },
    mensagemcontainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        position:'absolute',
        right:0,
        left:0,
        top:(height/2.04)
    },
    textprincipal: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        fontFamily:'comfortae'
    },
    textmensagem: {
        fontSize: 15,
        color: '#238BFE'
    },
    loginform: {
        marginTop: 20,
        flexDirection: 'column'
    },
    textinput: {
        marginBottom: 15,
        marginTop: 15,
        fontSize: 15,
        alignSelf: 'flex-start',
        fontWeight: 'bold',
        color: '#6e6e7f'
    },
    botoescontainer: {
        marginTop: 10
    },
    textbotoes: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15
    },
    textnovousuario: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    textloguese: {
        fontSize: 15,
        color: '#238BFE',
        fontWeight: 'bold',
        marginLeft: 2
    }
})
const mapStateToProps = state => ({
  
});
const mapDispatchToProps = dispatch =>{
    return{
    
      iniciarAtualizarUsuario(usuario){
        dispatch(iniciarAtualizarUsuario(usuario))
      }
    }
};
export default connect(mapStateToProps,mapDispatchToProps)(Login);