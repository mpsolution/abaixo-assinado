import React, { Component } from 'react'
import { View, Text, StyleSheet,ActivityIndicator,TextInput,Alert, Dimensions,FlatList ,TouchableWithoutFeedback} from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height';
import  MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {connect} from 'react-redux'
import {iniciarGetAbaixos,iniciarAtualizarAbaixosCarrinho} from '../../redux/actions/index'
import {formatarAbaixos} from '../../util/funcoes'
import BottomTab from './bottomtab'
import firebase from 'react-native-firebase'
import CardCarrinho from './cardcarrinho'
import Header from '../../componentes/header'
import BotaoAdicionar from '../../componentes/botaoAdicionar'
import {validarUsuario} from '../../util/funcoes.js'

import BotaoLista from './botaolistapagamentos'
function snapshotToArray(snapshot) {
    var returnArr = [];

    let chaves = Object.keys(snapshot)
    for (let index = 0; index < chaves.length; index++) {
        returnArr.push({ id: chaves[index], ...snapshot[chaves[index]] })

    }

    return returnArr;
};
const { width, height } = Dimensions.get('window')
const sizeuniversal = (width / height) * 41
 class Carrinho extends Component {
    constructor(props) {
        super(props)
        this.state={
            dados:[],
            loading:true,
            dadosoriginais:[],
            loading:false,
            abaixosCarrinho:[]
        }
    }
     static navigationOptions = ({ navigation }) => {
        
        const { params = {} } = navigation.state;
        // headerTitle instead of title
        return {
            header: <Header titulo={'Abaixos para Destacar'} filtro={()=>params.filtro()}  navigation={navigation} backnull={true} menu={true} setting={false} />,
           
        }

    }
    state = {
        dados:[],
        dadosoriginais:[],
        loading:true,
        ativarBusca:false,
        buscar:'',
        dataHoje:'',
        abaixosCarrinho:[]
    }
    goAbaixoassinado = async (abaixo) =>{
        
    }
    
    _renderItem = ({ item }) =>{        
        let estanocarrinho = false
        if(this.props.abaixosCarrinho !== undefined && this.props.abaixosCarrinho !== null && Array.isArray(this.props.abaixosCarrinho)){
            estanocarrinho = this.props.abaixosCarrinho.includes(item.id)
        }
        return (        
        <View style={styles.cardContainer}>
            <CardCarrinho 
                       estanocarrinho={estanocarrinho} 
                       abaixo={item} 
                       nome={item.nome} 
                       dataCriacao={item.dataCriacao} 
                       prazo={item.prazo} 
                       indiceAssinaturas={item.indiceAssinaturas} 
                          onpress={()=>{
                              this.props.iniciarAtualizarAbaixosCarrinho(item)
                              setTimeout(()=>{
                                this.setState({ativarBusca:this.state.ativarBusca})

                              },100)
                            }}
            />
        </View>
     
    )};
    componentDidMount = async () =>{
        this.setState({dataHoje:Date.now()})

        firebase.database()
            .ref('manifestos')
            .orderByChild('dataCriacao')
            .on('value',async (abaixos)=>{
               // console.log('abaixos carregados',abaixos.toJSON())
                let dados= formatarAbaixos(snapshotToArray(abaixos.toJSON()))
                  //  console.log(dados)
                    let naoImpulsionados = []
                    for (let index = 0; index < dados.length; index++) {
                        const dado = dados[index];
                        try{
                           
                                if((dado.impulsionado == false)&&(dado.prazo !== 'Encerrado')){
                                    naoImpulsionados.push(dado)
                                }
                                                      

                        }catch(e){
                            console.log('ERRO NO DADO',e)
                            console.log(dado)
                            naoImpulsionados.push(dado)
                        }
                        
                    }
                  //  dados = dados.filter((dado)=>!dado.impulsionado)
                  console.log(naoImpulsionados)
                let dadosoriginais = naoImpulsionados
               await this.setState({dados:naoImpulsionados,dadosoriginais})
            })
    

     
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
        
        if (this.props.loading)
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
                    <BotaoLista onPress={()=>{ //Caso o usuario tenha todos os dados preenchidos e tenha escolhido algum abaixo
                         if(this.props.itemAmount1 !== '0.00'){
                            if(validarUsuario(this.props.usuario)){
                                this.props.navigation.navigate('Pagamento')
                            }else{
                                //console.log(this.props.usuario)
                                Alert.alert(
                                    'Alerta',
                                    'Seu cadastro deve está completo para o pagamento.',
                                    [
                                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                                    ],
                                    {cancelable: false},
                                );
                            }
                     }else{
                        Alert.alert(
                                    'Alerta',
                                    'Você deve escolher um abaixo para destacar',
                                    [
                                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                                    ],
                                    {cancelable: false},
                                );
                     }}} />

                </View>

            )
         if( (this.state.dados.length <= 0 ) && !this.props.loading) {
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
                   <BotaoLista onPress={()=>{ //Caso o usuario tenha todos os dados preenchidos e tenha escolhido algum abaixo
                         if(this.props.itemAmount1 !== '0.00'){
                            if(validarUsuario(this.props.usuario)){
                                this.props.navigation.navigate('Pagamento')
                            }else{
                                //console.log(this.props.usuario)
                                Alert.alert(
                                    'Alerta',
                                    'Seu cadastro deve está completo para o pagamento.',
                                    [
                                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                                    ],
                                    {cancelable: false},
                                );
                            }
                     }else{
                        Alert.alert(
                                    'Alerta',
                                    'Você deve escolher um abaixo para destacar',
                                    [
                                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                                    ],
                                    {cancelable: false},
                                );
                     }}} />

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
                        contentContainerStyle={{
                            paddingLeft: width * 0.01,

                        }}
                        ListHeaderComponent={
                            <BottomTab navigation={this.props.navigation}  valor={this.props.valor} qtd={this.props.abaixosCarrinho}  reflesh={this.state.ativarBusca} />

                        }
                        stickyHeaderIndices={[0]}
                        data={this.state.dados}
                        renderItem={this._renderItem}
                        keyExtractor={this._keyExtractor}
                    />
            
            
                

               
                        <BotaoLista onPress={()=>{ //Caso o usuario tenha todos os dados preenchidos e tenha escolhido algum abaixo
                         if(this.props.itemAmount1 !== '0.00'){
                            if(validarUsuario(this.props.usuario)){
                                this.props.navigation.navigate('Pagamento')
                            }else{
                                //console.log(this.props.usuario)
                                Alert.alert(
                                    'Alerta',
                                    'Seu cadastro deve está completo para o pagamento.',
                                    [
                                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                                    ],
                                    {cancelable: false},
                                );
                            }
                     }else{
                        Alert.alert(
                                    'Alerta',
                                    'Você deve escolher um abaixo para destacar',
                                    [
                                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                                    ],
                                    {cancelable: false},
                                );
                     }}} />

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
const mapStateToProps = state => { 
return{
    abaixos:state.app.abaixos,
    abaixosOriginais:state.app.abaixos,
    loading:state.app.loading,
    abaixosCarrinho:state.pagamento.reference.idManifestos,
    valor:state.pagamento.itemAmount1,
    usuario:state.usuario.usuario,
    itemAmount1:state.pagamento.itemAmount1,
    usuario:state.usuario.usuario
}
  
};
const mapDispatchToProps = dispatch =>{
    return{
     
      iniciarGetAbaixos(abaixos){
        dispatch(iniciarGetAbaixos(abaixos))
      },
      iniciarAtualizarAbaixosCarrinho(abaixo){
          dispatch(iniciarAtualizarAbaixosCarrinho(abaixo))
      }
    
    }
};
export default connect(mapStateToProps,mapDispatchToProps)(Carrinho);