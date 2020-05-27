import React, { Component ,} from 'react'
import { View, Text, StyleSheet, WebView,Share, Dimensions,ActivityIndicator,  ScrollView} from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height';
import AsyncStorage from '@react-native-community/async-storage';
import Dialog from "react-native-dialog";
import  firebase from 'react-native-firebase'
import Botao from '../../componentes/botao'
import Header from '../../componentes/header'
const { width, height } = Dimensions.get('window')
const sizeuniversal = (width / height) * 41
export default class AbaixoAdmin extends Component {
    constructor(props) {
        super(props)
        state={
            abaixo:{},
            jaAssinou:false,
            loading:true,
            admin:false,
            fontLoaded:true
        }
    }
    state={
        abaixo:{},
        jaAssinou:false,
        loading:true,
        admin:false,
        uriPdf:'',
        dono:false,
        dialog:false,
        dialogcadastroimcompleto:false,
        motivo:'',
        
    }
    
    static navigationOptions = ({ navigation }) => {

        const { params = {} } = navigation.state;
        // headerTitle instead of title
        return {
            header: <Header titulo={'Abaixo Assinado'} filtro={() => params.filtro()} navigation={navigation} back={true} menu={true} setting={false} />,
          
        }

    }
   
    
    
    aprovarReprovar = async (aprovarreprovar) =>{
        let abaixo = this.state.abaixo
        //vejo se o abaixo tem prazo de criacao
        if(abaixo.hasOwnProperty('prazoCriacao') && (abaixo.prazoCriacao !== null)){
            //se tiver mudo a data de criacao para a data atual,e a diferenca entre os dias com a multiplicacao do prazo
            abaixo.dataCriacao = new Date()
            //mudo a data do prazo para a multiplicao dos dias da data de criacao
            abaixo.prazo = new Date(new Date(abaixo.dataCriacao).getTime() + 3600000+ (86400000 * abaixo.prazoCriacao) + 360)
        }
        if(aprovarreprovar){            
            abaixo.status = 'Aprovado'
            Object.assign(abaixo,{
                impulsionado:false
            })
            if(abaixo.hasOwnProperty('motivo')){
                delete abaixo.motivo
            }

            await firebase.database().ref('/manifestosemanalise/' + this.state.abaixo.id + '/criadopor').once('value',async (snapshot2)=>{
                await firebase.database().ref('/usuarios/' + snapshot2.val() + '/token').once('value',async (snapshot)=>{
                    //Checando se o usuario está sem o user.uid
                    if(snapshot.val() !== null){
                        firebase.database().ref('/mensagens/' + snapshot2.val()).update({token: snapshot.val()})
                        firebase.database().ref('/mensagens/' + snapshot2.val() + '/aprovado' + this.state.abaixo.id).update({title:'Abaixo-Assinado aprovado'})
                        firebase.database().ref('/mensagens/' + snapshot2.val() + '/aprovado' + this.state.abaixo.id).update({body: 'Seu Abaixo-Assinado ' + abaixo.nome + ' foi aprovado e já se encontra disponível para assinaturas. Compartilhe-o pelo Facebook e Whatsapp através dos links das redes sociais na tela do próprio abaixo.'})
                        firebase.database().ref('/mensagens/' + snapshot2.val() + '/aprovado' + this.state.abaixo.id).update({data: new Date()})
                        
                    }   
                })
            })

           await firebase.database().ref('manifestos/' + this.state.abaixo.id).update({...abaixo })
           await firebase.database().ref('manifestosemanalise/'+this.state.abaixo.id).remove()
            this.props.navigation.navigate('AdminMenu')
        }else{
            await this.setState({ dialog: true })
        }
        

    }
    reprovar = async ()=>{
        let abaixo = this.state.abaixo
        abaixo.status = 'Reprovado'
        Object.assign(abaixo,{
            motivo:this.state.motivo
        })
        await firebase.database().ref('/manifestosemanalise/' + this.state.abaixo.id + '/criadopor').once('value',async (snapshot2)=>{
            await firebase.database().ref('/usuarios/' + snapshot2.val() + '/token').once('value',async (snapshot)=>{
            //Checando se o usuario está sem o user.uid
                if(snapshot.val() !== null){
                    firebase.database().ref('/mensagens/' + snapshot2.val()).update({token: snapshot.val()})
                    firebase.database().ref('/mensagens/' + snapshot2.val() + '/rejeitado' + this.state.abaixo.id).update({title:'Seu Abaixo-Assinado ' + abaixo.nome + ' não foi aprovado'})
                    firebase.database().ref('/mensagens/' + snapshot2.val() + '/rejeitado' + this.state.abaixo.id).update({body: 'Motivo:' + motivo + `\n` + 'Vá até "Meus Manifestos Salvos", entre no seu abaixo, faça as devidas correções e envie-o outra vez para analise'})
                    firebase.database().ref('/mensagens/' + snapshot2.val() + '/rejeitado' + this.state.abaixo.id).update({data: new Date()})
                }   
            })
        })

        await firebase.database().ref('manifestosemedicao').push(abaixo)        
        await firebase.database().ref('manifestosemanalise/' + this.state.abaixo.id).remove()
         this.props.navigation.navigate('AdminMenu')
        
        

    }
    //Funcao que tira a diferenca de dias do prazo do abaixo e da data de criacao
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
        let dias = Math.floor(days)
        if ((dias) <= 0) return 'Encerrado'
        return dias;
    }
    //Faz o carregamento de duas formas diferentes se for admin habilita os botoes
    // salvar e reprovar,se for usuario comum habilita o botao assinar
    //se for o usuario que criou diz que o abaixo ja foi assinado pelo proprio usuario
    componentDidMount = async () =>{
        //console.log('TELA DE ABAIXO MONTOU PELO MENU')
        
      
        
        try{
            let abaixo = await this.props.navigation.getParam('abaixo')
          //  console.log('ABAIXO',abaixo)
            if(abaixo) {
                
                this.setState({abaixo : abaixo})
                let usuario = await AsyncStorage.getItem('USUARIO')
                    usuario = JSON.parse(usuario)
           

            }
        }catch(error){
            //console.log('NAO FOI POSSIVEL BAIXAR O ABAIXO')
        }
      this.setState({loading:false})
    }
    //faz carregamento da fonte caso n tenha sido feita
   
    render() {
       //Loading emquanto carrega os dados
       if(this.state.loading) 
        return(
            <View style={{height,width,justifyContent:'center',alignItems: 'center',}}>
                <ActivityIndicator size="large" color="#58727F" />
               
            </View>
        )

       return (
           //scrollview contendo o abaixo assinado
           <View style={styles.container}>
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
                       justifyContent: 'space-around',
                       alignItems: 'center',
                       flexDirection: 'row',
                       backgroundColor: '#fff', width: '100%', height: '100%', borderTopRightRadius: (getStatusBarHeight()) * 2,
                       borderTopLeftRadius: (getStatusBarHeight()) * 2,
                   }}>



                   </View>
               </View>
               <ScrollView >
                   <Dialog.Container visible={this.state.dialogcadastroimcompleto}>
                       <Dialog.Title>Por favor preencha todos seus dados do cadastro para poder assinar</Dialog.Title>

                       <Dialog.Button label="Ok" onPress={async () => {
                           this.setState({ dialogcadastroimcompleto: false })
                           let usuario = await AsyncStorage.getItem('USUARIO')
                           this.props.navigation.navigate('Cadastro', { usuario })
                       }} />

                   </Dialog.Container>
                   <Dialog.Container visible={this.state.dialog}>
                       <Dialog.Title>Escreva o motivo do reprovamento</Dialog.Title>

                       <Dialog.Input autoFocus={true} label='Motivo' onChangeText={(text) => this.setState({ motivo: text })} />
                       <Dialog.Button label="Cancelar" onPress={() => {

                           this.setState({ dialog: false })

                       }} />
                       <Dialog.Button label="Ok" onPress={() => {

                           this.setState({ dialog: false })
                           this.reprovar()
                       }} />

                   </Dialog.Container>

                   <View style={styles.card}>

                       <Text style={[styles.text, { fontFamily: 'comfortae' }]} >
                           {this.state.abaixo.nome}
                       </Text>
                       <Text style={[styles.textabaixo, { fontFamily: 'comfortae', marginBottom: height * 0.05, marginTop: height * 0.05 }]}>
                           {this.state.abaixo.corpo}
                       </Text>
                       <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', justifyContent: 'flex-start' }}>
                           <Text style={[styles.text, { fontFamily: 'comfortae', marginRight: 10 }]} >
                               Objetivo:
                         </Text>
                           <Text style={[styles.textabaixo, { fontFamily: 'comfortae', width: '75%' }]}>
                               {this.state.abaixo.objetivo}
                           </Text>
                       </View>
                       <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', justifyContent: 'flex-start' }}>
                           <Text style={[styles.text, { fontFamily: 'comfortae', marginRight: 10 }]} >
                               Categoria:
                                </Text>
                           <Text style={[styles.textabaixo, { fontFamily: 'comfortae' }]}>
                               {this.state.abaixo.categoria}
                           </Text>
                       </View>
                       <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', justifyContent: 'flex-start' }}>
                           <Text style={[styles.text, { fontFamily: 'comfortae', marginRight: 10 }]} >
                               Prazo:
                                        </Text>
                           <Text style={[styles.textabaixo, { fontFamily: 'comfortae' }]}>
                               {
                                   this.daysBetween(this.state.abaixo.dataCriacao, this.state.abaixo.prazo)
                               }
                           </Text>
                           <Text style={[styles.textabaixo, { fontFamily: 'comfortae', marginLeft: 10 }]} >
                               Dias
                                        </Text>

                       </View>




                   </View>
                   <View style={[{
                       width: '100%',
                       alignSelf: 'flex-end',
                       justifyContent: 'flex-end',

                       alignItems: 'flex-end',
                       alignContent: 'flex-end',
                       marginTop: 10
                   }]}>

                       <Botao icone={false} onpress={() => this.aprovarReprovar(true)} titulo='Aprovar' />


                   </View>
                   <View style={[{
                       width: '100%',
                       alignSelf: 'flex-end',
                       justifyContent: 'flex-end',

                       alignItems: 'flex-end',
                       alignContent: 'flex-end',
                       marginTop: 10
                   }]}>

                       <Botao icone={false} onpress={() => this.aprovarReprovar(false)} titulo='Reprovar' />


                   </View>




               </ScrollView>
               </View>
          
        )

    }
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#fff',             
        marginBottom:  width * 0.01,
        marginTop: height * 0.029,
        height
        
    },
    card: {
       
       
       
        paddingLeft: width * 0.05,
        paddingRight: width * 0.05,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        backgroundColor: '#fff',
        alignItems: 'center',
       
    },
    text: {
        fontSize: sizeuniversal * 0.8,
        fontWeight: 'bold',
        alignSelf: 'center',
        color: '#58727F',
     
    },
    textabaixo: {
        fontSize: sizeuniversal * 0.7,
        alignSelf: 'flex-start',
        color: '#58727F',
       

    },
    botaocontainer:{
        width:'100%',
        alignSelf:'flex-end',
        justifyContent:'flex-end',
        
        alignItems:'flex-end',
        alignContent: 'flex-end',
        marginTop:height * 0.1
      
    }
    
})