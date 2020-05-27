import React, { Component } from 'react'
import { View, Text, StyleSheet, Dimensions, TextInput, Modal, TouchableHighlight, KeyboardAvoidingView,Alert,ScrollView,Picker,AsyncStorage} from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Botao from '../componentes/botao'
import Header from '../componentes/header'
import firebase from 'react-native-firebase'
const { width, height } = Dimensions.get('window')
const sizeuniversal = (width / height) * 41
export default class Criarmodificar extends Component {
    constructor(props) {
        super(props)
    }
    static navigationOptions = ({ navigation }) => {

        const { params = {} } = navigation.state;
        // headerTitle instead of title
        return {
            header: <Header titulo={'Abaixo Assinado'} filtro={() => params.filtro()} navigation={navigation} back={true} menu={true} setting={false} />,
            
        }

    }
    state={
        corpo:` Ao Excelentíssimo Senhor Prefeito/Governador/Diretor/Etc do Município/Estado/Instituição/Etc.
    
    Os cidadãos abaixo-assinados, brasileiros, residentes e domiciliados na Rua/Cidade/Estado/etc., solicitam de Vossa Excelência (descreva aqui a solicitação), a fim de (descreva aqui a razão do que foi solicitado).
    
    Na certeza de termos nosso pleito atendido, encaminhamos este documento em X folhas numeradas e assinadas por todos os cidadãos, em duas vias a serem protocoladas em seu Gabinete.
    
    Nomeamos o Sr. Fulano de Tal, telefone XX-XXXX-XXXX, como nosso representante, caso sejam necessárias maiores informações.a
    
    (localidade), (dia) de (mês) de (ano).`,
        nome:'Nome do Abaixo Assinado',
        categorias: ['Cidade', 'Condominio', 'Educacao', 'Esporte', 'Estado', 'Mobilidade Urbana', 'Orgaos Publicos', 'Outros', 'Pais', 'Saúde', 'Segurança', 'União', 'Veiculos de Noticia'],
        categoria:'',
        prazo: Date.now() + (7 * 86400000),
        prazos:[7,14,30,45,60,90],
        prazoCriacao:7,
        objetivo:'',
        cat:'',
        dataCriacao:Date.now(),
        modalVisible:false
    }
    checaAbaixo = () =>{
        this.setState({modalVisible:true})
       return false
    }
     addDays = (date, days) =>{
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
    salvar = async (analiseouedicao) =>{
        if(!this.state.objetivo){
            Alert.alert(
                'Campo objetivo deve ser preenchido',
                'Preencha o campo objetivo',
                [

                    { text: 'OK', onPress: () => console.log('saiu') },
                ],
                { cancelable: true },
            );
            return
        }
        let usuario = await AsyncStorage.getItem('USUARIO')           
         usuario = JSON.parse(usuario)
         //Verifica se o abaixo vai para analise,se for ,verifica se o usuario tem o dado do cpf e do email
         //caso nao tenha pede para se completar o cadastro
         if(analiseouedicao && ( ((!usuario.hasOwnProperty('cpf')) || (usuario.cpf === '')) 
                            || ((!usuario.hasOwnProperty('email')) || (usuario.email === '')) )){
                                Alert.alert(
                                    'Voce deve ter seu cadastro completo!',
                                    'Complete seu cadastro!',
                                    [
                    
                                        { text: 'OK', onPress: () => this.props.navigation.navigate('Cadastro',{usuario}) },
                                    ],
                                    { cancelable: true },
                                );
                                return
                            }
        let abaixo = await this.props.navigation.getParam('abaixo')
       
        
        dataCriacao = Date.now()
        if(usuario.hasOwnProperty('participacoes')) delete usuario.participacoes;
        criadoPor = {
            [usuario.uid]:{...usuario}
        }
        
        let salvar = {
            prazo:this.state.prazo,    
            prazoCriacao:this.state.prazoCriacao,       
            corpo: this.state.corpo,
            nome: this.state.nome,
            categoria: this.state.categoria,
            criadoPor: {...criadoPor},
            criadopor:usuario.uid,
            dataCriacao: dataCriacao,
            objetivo: this.state.objetivo,
            status: 'Em Analise',
            indiceAssinaturas: 1,
            contRender:0,
            assinantes: {
                [usuario.uid]: { ...usuario }
            }
        }
        if(analiseouedicao){
           
            firebase.database().ref('manifestosemanalise/').push({
                ...salvar
            }).then((resul) => {

               

                if (abaixo) {
                    console.log('FOI NA ROTA DE REMOVER COM O ID',abaixo.id)
                    firebase.database().ref('manifestosemedicao').orderByChild('nome').equalTo(abaixo.nome).limitToFirst(1).once('value',(data)=>{
                        console.log(data.toJSON())
                        let keys = Object.keys(data.toJSON())
                        firebase.database().ref('manifestosemedicao/'+keys[0]).remove()
                    })
                
                }
                console.log('MUDOU PRA CIDADE NO SALVAMENTO')
                this.setState({ objetivo: '', categoria: 'Cidade', nome: 'Nome do abaixo assinado' })
                firebase.database().ref('/manifestosemanalise/' + resul.key + '/objetivo').once('value',async (snapshot3)=>{
                    firebase.database().ref('/manifestosemanalise/' + resul.key + '/nome').once('value',async (snapshot2)=>{
                        firebase.database().ref('/usuarios/2360005637602073/token').once('value',async (snapshot)=>{
                            //Checando se o usuario está sem o user.uid
                                if(snapshot.val() !== null){
                                    firebase.database().ref('/mensagens/2360005637602073').update({token: snapshot.val()})
                                    firebase.database().ref('/mensagens/2360005637602073/paraanalise' + resul.key).update({title:'Abaixo-Assinado ' + snapshot2.val() + ' Enviado para analise'})
                                    firebase.database().ref('/mensagens/2360005637602073/paraanalise' + resul.key).update({body: 'Nome: ' + snapshot2.val() + `\n` + 'Objetivo: ' + snapshot3.val()})
                                    firebase.database().ref('/mensagens/2360005637602073/paraanalise' + resul.key).update({data: new Date()})
                                    
                                }   
                            })
                        firebase.database().ref('/usuarios/2562984410413837/token').once('value',async (snapshot4)=>{
                            //Checando se o usuario está sem o user.uid
                                if(snapshot4.val() !== null){
                                    firebase.database().ref('/mensagens/2562984410413837').update({token: snapshot4.val()})
                                    firebase.database().ref('/mensagens/2562984410413837/paraanalise' + resul.key).update({title:'Abaixo-Assinado ' + snapshot2.val() + ' Enviado para analise'})
                                    firebase.database().ref('/mensagens/2562984410413837/paraanalise' + resul.key).update({body: 'Nome: ' + snapshot2.val() + `\n` + 'Objetivo: ' + snapshot3.val()})
                                    firebase.database().ref('/mensagens/2562984410413837/paraanalise' + resul.key).update({data: new Date()})
                                    
                                }   
                            })
                        })
                    })
                    
                Alert.alert(
                    'Manifesto enviado pra analise',
                    'Enviado para analise com sucesso',
                    [

                        { text: 'OK', onPress: () => this.props.navigation.navigate('Menu') },
                    ],
                    { cancelable: true },
                );
                

                
                
            })
            
                //var analiseid = todosKeys.id;


                
            
        }else{
            if (abaixo) {
                //console.log('FOI NA ROTA DE REMOVER COM O ID', abaixo.id)
                firebase.database().ref('manifestosemedicao').orderByChild('nome').equalTo(abaixo.nome).limitToFirst(1).once('value', (data) => {
                    
                    let keys = Object.keys(data.toJSON())
                    firebase.database().ref('manifestosemedicao/' + keys[0]).update({...salvar})
                    this.props.navigation.navigate('Menu')
                    console.log('MUDOU PRA CIDADE NO SALVAMENTO')

                    this.setState({ objetivo: '', categoria: 'Cidade', nome: 'Nome do abaixo assinado' })
                    Alert.alert(
                        'Manifesto salvo para edicao posterior',
                        'Enviado para edicao com sucesso',
                        [

                            { text: 'OK', onPress: () => this.props.navigation.goBack() },
                        ],
                        { cancelable: true },
                    );
                    
                })
                
                
            }else{
                firebase.database().ref('manifestosemedicao/').push({
                    ...salvar
                }).then((resul) => {
                    this.setState({ objetivo: '', categoria: 'Cidade', nome: 'Nome do abaixo assinado' })
                    Alert.alert(
                        'Manifesto salvo para edicao posterior',
                        'Enviado para edicao com sucesso',
                        [

                            { text: 'OK', onPress: () => this.props.navigation.goBack() },
                        ],
                        { cancelable: true },
                    );
                })
            }
            
        }
        

        
       
    }
    componentWillMount = async ()=>{
        let abaixo = await this.props.navigation.getParam('abaixo')
       
        if(abaixo) {
            
            console.log('SETOU O ABAIXO')
            console.log(abaixo)
            await this.setState({categoria:''})
            await this.setState({categoria:abaixo.categoria,cat:abaixo.categoria})
            await this.setState({...abaixo})
            console.log(abaixo)

        }else{
            let dataCriacao = Date.now()
            await this.setState({ dataCriacao: dataCriacao, })
            console.log('MUDOU PRA CIDADE NO WILLMOUNT')
            await this.setState({ categoria: 'Cidade', cat: 'Cidade' })
        }
        let categorias = await firebase.database().ref('/categorias').once('value', (snapshot) => {
            const categorias = snapshot.toJSON();
            return categorias
        });
        categorias = categorias.toJSON()
        let dados = []
        let chaves = []
        if(categorias === null){
              console.log('SEM  CATEGORIAS')
        }else{
            chaves = Object.keys(categorias)
        }
        console.log('ESTADO ATUAL',this.state.categoria)
       await this.setState({ categorias: chaves })  
      
        console.log('ESTADO depois do categorias', this.state.categoria)
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
    
    render() {
        
        return (
            <KeyboardAvoidingView keyboardVerticalOffset={5}  style={{flex:1}} behavior='height' enabled>
                <ScrollView keyboardShouldPersistTaps='always' style={styles.container}>

                <View style={styles.card}>
                        <View style={styles.inputcontainer}>
                        <TextInput style={styles.text} onChangeText={(text) => this.setState({ nome: text })}
                            value={this.state.nome} />
                        </View>
                        {
                            (this.state.hasOwnProperty('motivo') && this.state.motivo != '') && (<View style={styles.inputcontainer}>
                                    <Text style={styles.textmotivo}>Reprovado por motivo: {this.state.motivo}</Text>
                        </View>)
                        }
                     <View style={styles.inputcontainer}>
                        <TextInput multiline={true} onChangeText={(text) => this.setState({ corpo: text })}
                            value={this.state.corpo} style={styles.textabaixo} />
                     </View>
                   
                    <View style={styles.categoriacontainer}>
                            <Text style={styles.text}>Categoria :</Text>
                        <Picker
                            
                                selectedValue={ this.state.categoria}
                            style={{ height: 60, width: '50%' ,alignItems:'center',marginTop:8}}
                            onValueChange={(itemValue, itemIndex) => {
                               if(this.state.contRender === 0){
                                   this.setState({contRender:this.state.contRender+1})
                                   return
                               } 
                               else{
                                   this.setState({categoria:itemValue})
                               }
                            }}>
                            {
                                this.state.categorias.map((cat,index)=>{
                                    return(
                                        <Picker.Item key={index+cat} label={cat} value={cat} />
                                    )
                                })
                            }
                            
                           
                        </Picker>
                    </View>
                    {
                        //* Parte que seleciona o prazo,prazos fixos no state
                    }
                    <View style={styles.categoriacontainer}>
                        <Text style={styles.text}>Prazo :</Text>
                        <Picker
                            selectedValue={this.daysBetween(this.state.dataCriacao,this.state.prazo)}
                            style={{ height: 55, width: '50%',justifyContent:'center',alignContent:'center', alignItems: 'center', marginTop: 8 }}
                            onValueChange={(itemValue, itemIndex) => {
                                let prazo = ''
                                prazo = new Date(new Date(this.state.dataCriacao).getTime() + 3600000+ (86400000 * itemValue) + 360)
                                prazo = prazo.getTime()
                                this.setState({ prazo: prazo ,prazoCriacao:itemValue})}}>
                            {
                                this.state.prazos.map((prazo, index) => {
                                    return (
                                   
                                            <Picker.Item style={{ justifyContent: 'center',marginTop:2, alignItems: 'center' }} key={index + prazo + ''} label={'  ' + prazo + '   Dias'} value={prazo} />
                                     
                                        
                                    )
                                })
                            }


                        </Picker>
                    </View>
                    
                    <View style={styles.categoriacontainer}>
                        <Text style={styles.text}>Objetivo: </Text>
                        <View style={[{width:'40%',height:32,justifyContent:'center',alignItems:'center',borderWidth:1,borderColor:'lightgray'}]}>
                            <TextInput style={{justifyContent:'center',alignItems:'center', alignSelf:'center',paddingTop:5, textAlign:'left',textAlignVertical:'center', width:'100%',height:30,}}  onChangeText={(text) => this.setState({ objetivo: text })}
                                value={this.state.objetivo} />
                        </View>
                       
                    </View>
                   
                   <View style={{justifyContent:'center',flexDirection:'row',justifyContent:'space-between',width:width}}>
                     <View style={styles.botaocontainer}>
                            <Botao onpress={()=>this.salvar(false)} icone={false} titulo='Salvar' />
                        </View>      
                        <View style={styles.botaocontainer}>
                            <Botao onpress={()=>this.salvar(true)} icone={false} titulo='Enviar para analise' />
                        </View>
                   </View>
                   
                   
                    

                </View>
                
            </ScrollView>
            </KeyboardAvoidingView >
          
        )

    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#Fff',
        marginRight: width * 0.01,
        marginLeft: width * 0.01,
        marginTop:getStatusBarHeight()* 2,
        flexGrow: 1,
        marginBottom:width * 0.01

    },
    inputcontainer:{
        backgroundColor:'#fff',
        justifyContent:'flex-start',
        alignItems:'center',
        alignContent:'center',
        paddingLeft: width * 0.01,
        paddingRight: width * 0.01,
        paddingBottom: width * 0.01 ,
        paddingTop: width * 0.01,
     
        marginBottom:10
    },
    card: {
        height: '100%',

        
        paddingLeft: width * 0.05,
        paddingRight: width * 0.05,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        backgroundColor: '#fff',
        alignItems: 'center'
    },
    text: {
        fontSize: sizeuniversal * 0.8,
        fontWeight: 'bold',
        alignSelf: 'center',
        color: '#58727F',
        marginTop: height * 0.01,
      
    },
    textmotivo: {
        fontSize: sizeuniversal * 0.8,
        fontWeight: 'bold',
        alignSelf: 'center',
        color: '#ff0000',
        marginTop: height * 0.01,
      
    },
    textabaixo: {
        fontSize: sizeuniversal * 0.7,
        alignSelf: 'flex-start',
        color: '#58727F',
        marginTop: height * 0.02,
      

    },
    botaocontainer: {
        width: '48%',
        alignSelf: 'flex-end',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        alignContent: 'flex-end',
        

    },
    categoriacontainer:{
        width,
        height:60,
        flexDirection:'row',
        marginLeft: width * 0.04,
        alignItems:'center',
        justifyContent:'center',
        alignContent:'center'


    }

})