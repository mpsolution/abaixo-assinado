import React, { Component } from 'react'
import { View,Text,StyleSheet ,Dimensions,Image,ScrollView,FlatList,TouchableOpacity,ActivityIndicator} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';

import { getStatusBarHeight } from 'react-native-status-bar-height';
//import { auth } from '../firebase';

import Modal from "react-native-modal";

import firebase from 'react-native-firebase'
import {daysBetween,GetFormattedDate}  from '../util/funcoes'
import {connect} from 'react-redux'

import Header               from '../componentes/header'
import Card                 from '../componentes/card'
import BotaoAdicionar       from '../componentes/botaoAdicionar'

/*export default class Loading extends Component {
    async componentDidMount() {
        auth.onAuthStateChanged(user => {
            this.checkPermission()
            this.props.navigation.navigate(user ? 'principal' : 'login')
        })
    }
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
        let fcmToken = await AsyncStorage.getItem('fcmToken', value);
        if (!fcmToken) {
            fcmToken = await firebase.messaging().getToken();
            if (fcmToken) {
                // user has a device token
                await AsyncStorage.setItem('fcmToken', fcmToken);
            }
        }
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
}  */  

const {width,height} = Dimensions.get('window')
 class Inicio extends Component{
    constructor(props){
        super(props)
        this.state = {
            usuario:{},
            dados:[],
            dadosoriginais:[],
            loading:false,
            dataHoje:'',
            executando:false
        }

    }
    static navigationOptions = ({ navigation }) => {
        
        const { params = {} } = navigation.state;
        // headerTitle instead of title
        return {
            header: <Header titulo={'Bem Vindo'} filtro={()=>params.filtro()}  navigation={navigation} back={false} menu={true} setting={false} />,
           
        }

    }
    componentWillMount = async () =>{
        this.setState({dataHoje:Date.now()})
        let usuario = await AsyncStorage.getItem('USUARIO')
            usuario = JSON.parse(usuario)
            console.log('USUARIO DO INICIO',usuario)
           await this.setState({usuario})
    }
    componentDidMount = () =>{
        this.setState({loading:true})
        firebase.database().ref('manifestos').orderByChild('dataCriacao').on('value', (snapshot) => {
            try{
                let snap = snapshot.toJSON();
                let dados = []
                if (snap === null) this.setState({ loading: false })
                else{
                    let chaves = Object.keys(snap)
                    for (let index = 0; index < chaves.length; index++) {
                        dados.push({ id: chaves[index], ...snap[chaves[index]] })

                    }
                    //COLOCA OS DADOS NA ORDEM DE CRIAÇÃO DO MAIS RECENTE AO MAIS ANTIGO
                    dados.sort(function(a,b){
                        var c = new Date(a.dataCriacao);
                        var d = new Date(b.dataCriacao);
                        return c-d;
                        })
                     dados.reverse()
                    let dadosimpulsionados = []
                    let dadosnaoimpulsionados = []
                    //COLOCA OS DADOS IMPULSIONADOS COMO PRIMEIROS NO ARRAY
                    for (let index = 0; index < dados.length; index++) {
                        const element = dados[index];
                        if(element.impulsionado){
                            dadosimpulsionados.push(element)
                        }else{
                            dadosnaoimpulsionados.push(element)
                        }

                        
                    }
                    dados = dadosimpulsionados.concat(dadosnaoimpulsionados)
                   
                    this.setState({
                        dados: dados,
                        dadosoriginais: dados,
                        loading: false
                    })

                }
                                       
            }catch(error){
                console.log('SEM ITENS DA CATEGORIA')
                this.setState({ loading: false })
            }
           
        })
    }
    _keyExtractor = (item, index) => item + index + '';
    _renderItem = ({ item }) =>{ 
        let dataCriacao = 'Sem data'
        let prazo = 'Sem prazo'
        //Formata a data e prazo para o card
        if(item.dataCriacao) {dataCriacao = GetFormattedDate(item.dataCriacao)
            prazo = daysBetween(this.state.dataHoje, item.prazo)
                            }
       
        return (        
        <View style={styles.cardContainer}>
            <Card 
                abaixo={item}
                nome={item.nome} 
                dataCriacao={dataCriacao} 
                prazo={prazo} 
                indiceAssinaturas={item.indiceAssinaturas} 
                onpress={()=>this.props.navigation.navigate('AbaixoInicio', { abaixo:item})}
            />
        </View>
     
    )};
    render(){
        return(
            <View style={styles.container}>
                  <Modal 
                   useNativeDriver={true}
                   style={styles.bottomModal}
                   isVisible={this.state.loading}>
                    <View style={styles.content}>
                        <View
                        style={{
                          height:height* 0.05,
                          paddingHorizontal:5,
                          justifyContent:'center',
                          alignItems:'center',
                          alignSelf:'center',
                          flexDirection:'row',
                          backgroundColor:"#fff"}}>
                          <Text style={styles.contentTitle}>Carregando...</Text>
                          <ActivityIndicator size="small" color="#ff6600" />
                        </View>
                      
                  </View>
                </Modal>
                <View style={{
                        backgroundColor: '#ff6600',
                        width,
                        height: (getStatusBarHeight()) * 2,
                        zIndex: 0,
                        overflow: 'hidden',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row'
                    }}>
                        <View style={{
                            backgroundColor: '#fff', width: '100%', height: '100%', borderTopRightRadius: (getStatusBarHeight()) * 2,
                            borderTopLeftRadius: (getStatusBarHeight()) * 2,
                        }}>
                        </View>
                    </View>
                    <View 
                        style={styles.usuarioContainer}>    
                        
                        {
                            //Verifica se o usuario tem uma foto de perfil
                            (this.props.usuario && this.props.usuario.hasOwnProperty('photoURL') && this.props.usuario.photoURL) && 
                                 <Image source={{ uri: this.props.usuario.photoURL }} resizeMode='contain' style={{ width: 80, height: 80, borderRadius: 80 / 2,  }} />
                        }                
               
                        <View style={styles.usuariotextContainer}>
                            <Text style={styles.text}>Olá,</Text>
                            {
                                //So mostra o primeiro nome do usuario
                                (this.props.usuario && this.props.usuario.hasOwnProperty('nome') && this.props.usuario.nome) &&  <Text style={styles.texticone}>{this.props.usuario.nome.split(' ')[0]}</Text>
                            }
                           
                        </View>
                     </View>
                     <FlatList
                    keyboardShouldPersistTaps='always'
                    refreshing={this.state.loading}
                    contentContainerStyle={{
                        paddingLeft: width * 0.01,
                        paddingBottom: (getStatusBarHeight()) * 8,

                    }}
                    style={{                           
                           paddingLeft: width * 0.01,
                           paddingRight: width * 0.01,
                           }}
                    data={this.state.dados}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                />
                    <BotaoAdicionar navigation={this.props.navigation} />
                           </View>
        )
    }
}
styles=StyleSheet.create({
    container:{
        width,
        height,
        backgroundColor: '#fff',
        marginTop: height * 0.029,
        overflow: 'visible',
    },
    usuarioContainer:{
        flexDirection:'row',
        alignItems: 'center',
        justifyContent:'center',
        backgroundColor:'#fff',
        borderColor:'#336699',
        paddingLeft:10,
        borderRadius:5,
        marginTop:-15,
        marginBottom:5
            },
    usuariotextContainer:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center'
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
    cardContainer:{
        marginTop:height * 0.01
        
    }
})
 const mapStateToProps = state => ({
  usuario:state.usuario.usuario
});
const mapDispatchToProps = dispatch =>{
    return{
     
    
    }
};

export default connect(mapStateToProps,mapDispatchToProps)(Inicio)