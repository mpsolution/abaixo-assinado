import React, { Component } from 'react'
import { View, Text, StyleSheet,ActivityIndicator,TextInput, Dimensions,FlatList ,TouchableWithoutFeedback} from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height';
import AsyncStorage from '@react-native-community/async-storage';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import  firebase from 'react-native-firebase'
import Card from '../componentes/card'
import Header from '../componentes/header'
import BotaoAdicionar from '../componentes/botaoAdicionar'

const { width, height } = Dimensions.get('window')
const sizeuniversal = (width / height) * 41
export default class ListaPedidos extends Component {
    constructor(props) {
        super(props)
        state={
            dados:[],
            loading:true
        }
    }
     static navigationOptions = ({ navigation }) => {
        
        const { params = {} } = navigation.state;
        // headerTitle instead of title
        return {
            header: <Header titulo={'Abaixo Assinados'} filtro={()=>params.filtro()}  navigation={navigation} back={true} menu={true} setting={false} />,
           
        }

    }
    state = {
        dados:[],
        dadosoriginais:[],
        loading:true,
        ativarBusca:false,
        buscar:'',
        dataHoje:''
    }
    goAbaixoassinado = async (abaixo) =>{
        //Verifica se esta na opcao de abaixos salvos
        //Se estiver vai pra pagina de edicao de abaix
        //caso nao esteje vai pra tela do abaixo assinado
        menu = await this.props.navigation.getParam('menu')
        if(menu===2) this.props.navigation.navigate('Editar',{abaixo})
        else this.props.navigation.navigate('Abaixoassinado', { abaixo })
       
    }
     GetFormattedDate = (Time) =>{

   
    Time = new Date(Time)
    var mes = Time.getMonth() + 1;

    var dia = Time.getDate();

    var ano = Time.getFullYear();

    return dia + "/" + mes + "/" + ano;

}
    daysBetween = (first, second) => {
        first = new Date(first)
        second = new Date(second)
        // Copy date parts of the timestamps, discarding the time parts.
        var one = new Date(first.getFullYear(), first.getMonth(), first.getDate());
        var two = new Date(second.getFullYear(), second.getMonth(), second.getDate());

        // Do the math.
        var millisecondsPerDay = 1000 * 60 * 60 * 24;
        var millisBetween = two.getTime() - one.getTime();
        var days = millisBetween / millisecondsPerDay;

        // Round down.
        let dias = Math.round(days)
        if ((dias) <= 0) return 'Encerrado'
        return dias;
    }
    _renderItem = ({ item }) =>{ 
        let dataCriacao = 'Sem data'
        let prazo = 'sem prazo'
        if(item.dataCriacao) {dataCriacao = this.GetFormattedDate(item.dataCriacao)
            prazo = this.daysBetween(this.state.dataHoje, item.prazo)

         
                            }
       
        return (        
        <View style={styles.cardContainer}>
            <Card abaixo={item} nome={item.nome} dataCriacao={dataCriacao} prazo={prazo} indiceAssinaturas={item.indiceAssinaturas} onpress={()=>this.goAbaixoassinado(item)}
            />
        </View>
     
    )};
    componentDidMount = async () =>{
        this.setState({dataHoje:Date.now()})
        try {
            categoria = await this.props.navigation.getParam('categoria')
            if (categoria) {
                firebase.database().ref('manifestos').orderByChild('categoria').equalTo(categoria).on('value', (snapshot) => {
                    try{
                        let snap = snapshot.toJSON();
                        let dados = []
                        if (snap === null) this.setState({ loading: false })
                        else{
                            let chaves = Object.keys(snap)



                            for (let index = 0; index < chaves.length; index++) {
                                dados.push({ id: chaves[index], ...snap[chaves[index]] })

                            }
                            //Ordena o resultado por data de criação
                            dados.sort(function (a, b) {

                                return new Date(b.dataCriacao) - new Date(a.dataCriacao);
                            });
                            this.setState({
                                dados: dados,
                                dadosoriginais: dados
                            })

                        }
                                               
                    }catch(error){
                        console.log('SEM ITENS DA CATEGORIA')
                        this.setState({ loading: false })
                    }
                    this.setState({ loading: false })
                })
                
               
                
            }
          
        } catch (error) {
            
            this.setState({ loading: false })
        }
        try {
            menu = await this.props.navigation.getParam('menu')
            if (menu === 0) {
                let usuario = await AsyncStorage.getItem('USUARIO')
                usuario = JSON.parse(usuario)
                firebase.database().ref('usuarios/' + usuario.uid + '/participacoes').once('value', (snapshot) => {
                    let snap = snapshot.toJSON();
                    let dados = []
                    if (snap === null) this.setState({ loading: false })
                    else{
                        let chaves = Object.keys(snap)

                        console.log('QUANTIDADE DE ITENS', chaves)
                        for (let index = 0; index < chaves.length; index++) {
                            dados.push(snap[chaves[index]])

                        }
                        console.log('DADOS', dados)
                        this.setState({
                            dados: dados,
                            dadosoriginais: dados
                        })
                        this.setState({ loading: false })
                    }
                 
                })

            }

        } catch (error) {

            this.setState({ loading: false })
        }
        try {
            menu = await this.props.navigation.getParam('menu')
            if (menu === 1) {
                let usuario = await AsyncStorage.getItem('USUARIO')
                    usuario = JSON.parse(usuario)                
                firebase.database().ref('manifestos').orderByChild('criadopor').equalTo(usuario.uid).once('value', (snapshot) => {
                    try{
                        let snap = snapshot.toJSON();
                        let dados = []
                        if (snap === null) this.setState({loading:false})
                        else{
                            let chaves = Object.keys(snap)

                            for (let index = 0; index < chaves.length; index++) {
                                dados.push(snap[chaves[index]])

                            }

                            this.setState({
                                dados: dados,
                                dadosoriginais: dados
                            })
                            this.setState({ loading: false })
                        }
                        
                    }catch(error){
                        this.setState({ loading: false })

                    }
                    
                })
               
            }
              
        } catch (error) {
            
            this.setState({ loading: false })
        }
        try {
            menu = await this.props.navigation.getParam('menu')
            if (menu === 2) {
                let usuario = await AsyncStorage.getItem('USUARIO')
                usuario = JSON.parse(usuario)
                console.log('USUARIO',usuario)
                firebase.database().ref('manifestosemedicao').orderByChild('criadopor').equalTo(usuario.uid).once('value', (snapshot) => {
                    try{
                        let snap = snapshot.toJSON();
                        console.log('SNAPSHOT',snap)
                        let dados = []
                        if (snap === null) this.setState({ loading: false })

                        let chaves = Object.keys(snap)

                        console.log('QUANTIDADE DE ITENS', chaves)
                        for (let index = 0; index < chaves.length; index++) {
                            dados.push(snap[chaves[index]])

                        }
                        console.log('DADOS', dados)
                        this.setState({
                            dados: dados,
                            dadosoriginais:dados
                        })
                        this.setState({ loading: false })
                    }catch(error){
                        console.log(error)
                        this.setState({ loading: false })
                    }
                   
                })

            }

        } catch (error) {
            console.log(error)
            this.setState({ loading: false })
        }
       
       
     
    }
    pesquisar = () =>{
        this.setState({loading:true})
        let resultado = []
        for (let index = 0; index < this.state.dados.length; index++) {
            const dado = this.state.dados[index];
            if(dado.nome.toLowerCase().includes(this.state.buscar.toLowerCase())) resultado.push(dado)
            
        }
        this.setState({loading:false,dados:resultado , })
    }
    _keyExtractor = (item, index) => item + index + '';
    render() {
        
        if (this.state.loading)
            return (
                <View style={{ height, width,marginTop:height * 0.029, justifyContent: 'flex-start', alignItems: 'center', }}>
                    {
                        !this.state.ativarBusca &&
                        <TouchableWithoutFeedback onPress={() => { this.setState({ ativarBusca: true }) }}>
                            <View style={styles.bordarcontainer}>
                                <View style={{
                                    alignItems: 'center',
                                    backgroundColor: '#fff', flexDirection: 'row', width: '100%', height: '100%', borderTopRightRadius: (getStatusBarHeight()) * 2,
                                    borderTopLeftRadius: (getStatusBarHeight()) * 2, justifyContent: 'center'
                                }}>
                                    <MaterialIcons name='search' color='#336699' size={25} style={{ marginLeft: 10, }} />



                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    }
                    {
                        this.state.ativarBusca &&
                        <TouchableWithoutFeedback onPress={() => { this.setState({ ativarBusca: false }) }}>
                            <View style={styles.bordarcontainer}>
                                <View style={{
                                    alignItems: 'center',
                                    backgroundColor: '#fff', flexDirection: 'row', width: '100%', height: '100%', borderTopRightRadius: (getStatusBarHeight()) * 2,
                                    borderTopLeftRadius: (getStatusBarHeight()) * 2, justifyContent: 'center'
                                }}>
                                    <TextInput style={{ width: '40%', fontFamily: 'comfortae', color: '#336699' }} selectionColor='#336699' clearButtonMode={'always'} value={this.state.buscar} onChangeText={(text) => { this.setState({ buscar: text }) }} autoFocus={true} />

                                    <MaterialIcons name='close' color='#336699' size={25} style={{ marginLeft: 10, }} />

                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    }
                    <ActivityIndicator size="large" color="#58727F" />
                    <BotaoAdicionar navigation={this.props.navigation}  />

                </View>

            )
         if( (this.state.dados.length <= 0 ) && !this.state.loading) {
             return(
                 <View style={{ height, marginTop: height * 0.035, width, justifyContent: 'flex-start', alignItems: 'center', }}>
                     {
                         !this.state.ativarBusca &&
                         <TouchableWithoutFeedback onPress={() => { this.setState({ ativarBusca: true }) }}>
                             <View style={styles.bordarcontainer}>
                                 <View style={{
                                     alignItems: 'center',
                                     backgroundColor: '#fff', flexDirection: 'row', width: '100%', height: '100%', borderTopRightRadius: (getStatusBarHeight()) * 2,
                                     borderTopLeftRadius: (getStatusBarHeight()) * 2, justifyContent: 'center'
                                 }}>
                                     <MaterialIcons name='search' color='#336699' size={25} style={{ marginLeft: 10, }} />



                                 </View>
                             </View>
                         </TouchableWithoutFeedback>
                     }
                     {
                         this.state.ativarBusca &&
                         <TouchableWithoutFeedback onPress={() => {
                             if (this.state.dados.length <= this.state.dadosoriginais.length) this.setState({ dados: this.state.dadosoriginais })
                             this.setState({ ativarBusca: false, buscar: '' }) }}>
                             <View style={styles.bordarcontainer}>
                                 <View style={{
                                     alignItems: 'center',
                                     backgroundColor: '#fff', flexDirection: 'row', width: '100%', height: '100%', borderTopRightRadius: (getStatusBarHeight()) * 2,
                                     borderTopLeftRadius: (getStatusBarHeight()) * 2, justifyContent: 'center'
                                 }}>
                                     <TextInput style={{ width: '40%', fontFamily: 'comfortae', color: '#336699' }} selectionColor='#336699' clearButtonMode={'always'} value={this.state.buscar} onChangeText={(text) => { this.setState({ buscar: text }) }} autoFocus={true} />

                                     <MaterialIcons name='close' color='#336699' size={25} style={{ marginLeft: 10, }} />

                                 </View>
                             </View>
                         </TouchableWithoutFeedback>
                     }
                   <Text style={styles.text}>Sem Abaixos Assinados</Text>
                    <BotaoAdicionar navigation={this.props.navigation}  />

                 </View>
             )
         }
        return (
            <View style={styles.container}>
                {
                    !this.state.ativarBusca &&
                    <TouchableWithoutFeedback onPress={() => { this.setState({ ativarBusca: true }) }}>
                        <View style={styles.bordarcontainer}>
                            <View style={{
                                alignItems: 'center',
                                backgroundColor: '#fff', flexDirection: 'row', width: '100%', height: '100%', borderTopRightRadius: (getStatusBarHeight()) * 2,
                                borderTopLeftRadius: (getStatusBarHeight()) * 2, justifyContent: 'center'
                            }}>
                                <MaterialIcons name='search' color='#336699' size={25} style={{ marginLeft: 10, }} />



                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                }
                {
                    this.state.ativarBusca &&
                    <TouchableWithoutFeedback onPress={() => { 
                        if(this.state.dados.length <= this.state.dadosoriginais.length) this.setState({dados:this.state.dadosoriginais})
                        this.setState({ ativarBusca: false ,buscar:''}) }}>
                        <View style={styles.bordarcontainer}>
                            <View style={{
                                alignItems: 'center',
                                backgroundColor: '#fff', flexDirection: 'row', width: '100%', height: '100%', borderTopRightRadius: (getStatusBarHeight()) * 2,
                                borderTopLeftRadius: (getStatusBarHeight()) * 2, justifyContent: 'center'
                            }}>
                                <TextInput onSubmitEditing={()=>{this.pesquisar()}} style={{ width: '40%', fontFamily: 'comfortae', color: '#336699' }} selectionColor='#336699' clearButtonMode={'always'} value={this.state.buscar} onChangeText={(text) => { this.setState({ buscar: text }) }} autoFocus={true} />

                                <MaterialIcons name='close' color='#336699' size={25} style={{ marginLeft: 10, }} />

                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                }
                <FlatList
                    keyboardShouldPersistTaps='always'
                    contentContainerStyle={{
                        paddingLeft: width * 0.01,
                        paddingBottom: (getStatusBarHeight()) * 8,

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
const styles = StyleSheet.create({
    container: {
        width,
        height,
        backgroundColor:'#fff',
        
        paddingRight: width * 0.01,
        marginTop: height * 0.029,
    },
    text: {
        fontSize: sizeuniversal * 0.8,
        fontWeight: 'bold',
        alignSelf: 'center',
        color: '#58727F',
    },
    bordarcontainer: {
        backgroundColor: '#ff6600',
        width,
        height: (getStatusBarHeight()) * 2,
        zIndex: 0,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'

    },
    cardContainer:{
        marginTop:height * 0.01
    }
})