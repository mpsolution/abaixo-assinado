import React, { Component ,} from 'react'
import {  View, Text, StyleSheet,  Dimensions, TouchableWithoutFeedback, ActivityIndicator, ScrollView, Alert} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import { WebView } from 'react-native-webview';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Dialog from "react-native-dialog";
import firebase from 'react-native-firebase'
import Botao from '../componentes/botao'
import Header from '../componentes/header'
import {fazerHtmlAbaixo,GetFormattedDate,daysBetween} from '../util/funcoes'
import { ShareDialog } from 'react-native-fbsdk';

const { width, height } = Dimensions.get('window')
const sizeuniversal = (width / height) * 41

export default class Abaixoassinado extends Component {
    constructor(props) {
        super(props)
        state={
            abaixo:{},
            jaAssinou:false,
            loading:true,
            admin:false,
            dataHoje:''
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
        dialogAssinado:false,
        motivo:'',
        link:'play.google.com/store',
        dataHoje:'',
        share:false
        
    }
    static navigationOptions = ({ navigation }) => {

        const { params = {} } = navigation.state;
        // headerTitle instead of title
        return {
            header: <Header titulo={'Abaixo Assinado'} filtro={() => params.filtro()} navigation={navigation} back={true} menu={true} setting={false} />,
          
        }

    }
    
    downloadPdf = async ()=>{
       
       let usuario = await AsyncStorage.getItem('USUARIO')
            usuario = JSON.parse(usuario)
        try{
            if(usuario.email === null || !(usuario.email)){
                this.setState({dialogcadastroimcompleto:true})
            }
        }catch(e){
            console.log(e)
            this.setState({dialogcadastroimcompleto:true})

        }
       try{
        console.log('USUARIO ANTES DO ENVIO',usuario)
        RNHTMLtoPDF.convert({
        html: fazerHtmlAbaixo(this.state.abaixo),
        
        
     
    }).then(async (pdf) => {
        console.log('PDF  DO HTML',pdf)

        const body = new FormData();
        body.append("pdf", {
            uri:"file:" +pdf.filePath,
            name: 'abaixo.pdf',
            type: "application/pdf",
            
        });
        body.append('nome',usuario.nome)
        body.append('email',usuario.email.toLowerCase())
     
        const res = await fetch("https://mail.mpitsolutions.com.br/enviaremail.php", {
            method: "POST",
            body,
            headers: {
                Accept: "application/json",
                "Content-Type": "multipart/form-data"
            }
        });
        
         console.log('RESPOSTA DO SERVIDOR ',res)
         Alert.alert(
            'Email',
            'Email enviado com sucesso!'  ,         
            [                              
              {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            {cancelable: false},
          );
      



    })

       }catch(e){
           console.log('ERRO NO COMPARTILHAR PDF',e)
       }
         
       
      
     }
    //Faz a assinatura do abaixo assinado
    assinar= async () =>{
        //Carrega as informações do usuario salvas no celular
        let usuario = await AsyncStorage.getItem('USUARIO')
            usuario = JSON.parse(usuario)
            //console.log('USUARIO',usuario)
            //Faz a validação se todos os campos do usuario foram preenchidos
            if( (!usuario.hasOwnProperty('email')) || 
                ( (usuario.email==='')             || (usuario.email === null)) 
                                                   || (usuario.nome === '') 
                                                   || (!usuario.hasOwnProperty('cpf')) 
                                                   || (usuario.cpf === null) 
                                                   || (usuario.cpf === '') 
                                                   || !(usuario.email)  )
                    {
                    //Caso nao estejam preenchidos abre a caixa de cadastro para atualização dos dados
                    this.setState({dialogcadastroimcompleto:true})
                }else{
                    //Caso todos os dados estejam ok faz o assino do abaixo assinado
                await firebase.database().ref('manifestos/' + this.state.abaixo.id + '/assinantes/' + usuario.uid).update({ ...usuario })
                this.setState({ jaAssinou: true ,dialogAssinado:true})
                let assinaturas = parseInt(this.state.abaixo.indiceAssinaturas) + 1
                firebase.database().ref('manifestos/' + this.state.abaixo.id).update({ indiceAssinaturas: assinaturas })
                let abaixo = this.state.abaixo
                try{
                    Object.assign(abaixo.assinantes,{
                        [usuario.uid]:{...usuario}
                    })
                }catch(e){
                    Object.assign(abaixo,{
                        assinantes:{}
                    })
                    Object.assign(abaixo.assinantes,{
                        [usuario.uid]:{...usuario}
                    })
                }
              
                firebase.database().ref('usuarios/' + usuario.uid + '/participacoes/' + this.state.abaixo.id).update({ ...abaixo })

                }
       
    }
     onShare = async (event) => {
        const shareLinkContent = {
            contentType: 'link',
            contentUrl: this.state.link,
            quote: `Juntos podemos mais! Assine o abaixo-assinado "${this.state.abaixo.nome}" e compartilhe essa ideia. Faça a diferença você também!`,
          };
          var tmp = this;
          ShareDialog.canShow(shareLinkContent).then(
            function(canShow) {
              if (canShow) {
                return ShareDialog.show(shareLinkContent);
              }
            }
          ).then(
            function(result) {
              if (result.isCancelled) {
                console.log('Share cancelled');
              } else {
                console.log('Share success with postId: '
                  + result.postId);
                  Alert.alert(
                    'Obrigado por Compartilhar',
                    'Obrigado por divulgar o Abaixo Assinado',
                    [                        
                        { text: 'OK', onPress: () => console.log('OK Pressed') },
                    ],
                    { cancelable: false },
                );
              }
            },
            function(error) {
              console.log('Share fail with error: ' + error);
            }
          );
        /**
         *  if(this.state.share === false) return this.setState({share:true})
         else{
             if (event.title === 'Fechar esta guia'){
                 this.setState({share:false})
                 Alert.alert(
                     'Obrigado por Compartilhar',
                     'Obrigado por divulgar o Abaixo Assinado',
                     [                        
                         { text: 'OK', onPress: () => console.log('OK Pressed') },
                     ],
                     { cancelable: false },
                 );
                 return
             }
         }
         */
        
      
    };
    aprovarReprovar = async (aprovarreprovar) =>{
        let abaixo = this.state.abaixo
        if(aprovarreprovar){            
            abaixo.status = 'Aprovado'
           await firebase.database().ref('manifestos/' + this.state.abaixo.id).update({...abaixo })
           await     firebase.database().ref('manifestosemanalise/'+this.state.abaixo.id).remove()
            this.props.navigation.goBack()
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
        await firebase.database().ref('manifestosemedicao').push(abaixo)        
        await firebase.database().ref('manifestosemanalise/' + this.state.abaixo.id).remove()
        this.props.navigation.goBack()
    }
 
   
    //Faz o carregamento de duas formas diferentes se for admin habilita os botoes
    // salvar e reprovar,se for usuario comum habilita o botao assinar
    //se for o usuario que criou diz que o abaixo ja foi assinado pelo proprio usuario
    componentDidMount = async () =>{
        //console.log('TELA DE ABAIXO MONTOU PELO MENU')
      
       
        this.setState({dataHoje:Date.now()})
        try{
            let abaixo = await this.props.navigation.getParam('abaixo')
            //Recupera o abaixo enviado como parametro
            if(abaixo) {
               

               
                this.setState({abaixo : abaixo})
                let usuario = await AsyncStorage.getItem('USUARIO')
                    usuario = JSON.parse(usuario)
                let assinantes = Object.keys(abaixo.assinantes)
                //Verifica se o usuario ja assinou o abaixo assinado
                assinantes.includes(usuario.uid) ? this.setState({jaAssinou:true}) : null
                if(abaixo.criadopor === usuario.uid) {this.setState({dono:true})}

            }
        }catch(error){
            //console.log('NAO FOI POSSIVEL BAIXAR O ABAIXO')
        }
        //Carregamento do link a ser exibido no facebook
        firebase.database().ref('/link').once('value', (snapshot) => {
            try {
                let link = snapshot.toJSON();
                this.setState({ link: link.link })
            } catch (e) {
                console.log('HOUVE UM ERRO NO CARREGAMENTO TO LINK CARREGANDO LINK PADRAO')
            }


        })
      this.setState({loading:false})
    }

    render() {
       //Loading enquanto carrega os dados
       if(this.state.loading) 
        return(
            <View style={{height,width,justifyContent:'center',alignItems: 'center',}}>
                <ActivityIndicator size="large" color="#58727F" />
               
            </View>
        )
       if(this.state.share)
            return(
                <WebView
                    onNavigationStateChange={(event)=>{this.onShare(event)}}
                    source={{ uri: `https://www.facebook.com/sharer/sharer.php?u=https://${this.state.link}&quote=Juntos podemos mais! Assine o abaixo-assinado "${this.state.abaixo.nome}" e compartilhe essa ideia. Faça a diferença você também!` }}
                    style={{ marginTop: 20 }}
                />
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
                       <TouchableWithoutFeedback onPress={() => this.onShare()} >
                           <MaterialIcons name='share' color='#336699' size={25} style={{ marginLeft: 10, }} />
                       </TouchableWithoutFeedback>
                       {
                           this.state.dono && <TouchableWithoutFeedback onPress={() => this.downloadPdf()}>
                               <MaterialIcons name='picture-as-pdf' color='#336699' size={25} style={{ marginLeft: 10, }} />
                           </TouchableWithoutFeedback>

                       }




                   </View>
               </View>
               <ScrollView keyboardShouldPersistTaps='always' style={styles.container}> 
               <Dialog.Container visible={this.state.dialogAssinado}>
                   <Dialog.Title>Abaixo assinado com sucesso</Dialog.Title>

                   <Dialog.Button label="Ok" onPress={async () => {
                       this.setState({ dialogAssinado: false })
                       
                   }} />

               </Dialog.Container>
               <Dialog.Container visible={this.state.dialogcadastroimcompleto}>
                   <Dialog.Title>Por favor preencha todos seus dados do cadastro</Dialog.Title>

                   <Dialog.Button label="Ok" onPress={async () => {
                       this.setState({ dialogcadastroimcompleto: false })
                       let usuario = await AsyncStorage.getItem('USUARIO')
                       this.props.navigation.navigate('Cadastro',{usuario})
                   }} />

               </Dialog.Container>
               <Dialog.Container visible={this.state.dialog}>
                   <Dialog.Title>Escreva o motivo do reprovamento</Dialog.Title>
                  
                   <Dialog.Input autoFocus={true} label='Motivo' onChangeText={(text)=>this.setState({motivo:text})} />
                   <Dialog.Button label="Cancelar" onPress={() => {

                       this.setState({ dialog: false })
                       
                   }} />
                   <Dialog.Button label="Ok" onPress={()=>{
                                                           
                                                           this.setState({dialog:false})
                                                           this.reprovar()}}/>
                   
               </Dialog.Container>
             
                    <View  style={styles.card}>
                        
                        <Text style={[styles.text,{fontFamily:'comfortae'}]} >
                            {this.state.abaixo.nome}
                        </Text>
                        <Text style={[styles.textabaixo,{fontFamily:'comfortae',marginBottom:height *  0.05,marginTop:height *0.05}]}>
                           {this.state.abaixo.corpo}
                        </Text>
                        <View style={{flexDirection:'row',alignItems:'center',alignSelf:'flex-start', justifyContent:'flex-start'}}>
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
                                   daysBetween(this.state.dataHoje, this.state.abaixo.prazo)
                               }
                            </Text>
                           {
                               daysBetween(this.state.dataHoje, this.state.abaixo.prazo) !== 'Encerrado' &&
                               <Text style={[styles.textabaixo, { fontFamily: 'comfortae', marginLeft: 10 }]} >
                                   Dias
                                        </Text>
                           }
                     
                                        
                        </View>
                 

                   
                    
                 </View>
                {
                   this.state.admin && <View style={[{
                       width: '100%',
                       alignSelf: 'flex-end',
                       justifyContent: 'flex-end',

                       alignItems: 'flex-end',
                       alignContent: 'flex-end',
                       marginTop:10
                   }]}>
                       
                                   <Botao icone={false} onpress={() => this.aprovarReprovar(true)} titulo='Aprovar' />
                       

                   </View>
                }     
               {
                   this.state.admin && <View style={[{
                       width: '100%',
                       alignSelf: 'flex-end',
                       justifyContent: 'flex-end',

                       alignItems: 'flex-end',
                       alignContent: 'flex-end',
                       marginTop:10
                   }]}>

                       <Botao icone={false} onpress={() => this.aprovarReprovar(false)} titulo='Reprovar' />


                   </View>
               }   
               
               { //Caso o abaixo esteja encerrado exibe a mensagem encerrado caso contrario mostra o botao de assinar
                daysBetween(this.state.dataHoje, this.state.abaixo.prazo) === 'Encerrado' ? (
                       null
                   ) : (
                        
                           <View style={styles.botaocontainer}>
                                
                               {
                                   this.state.jaAssinou ?
                                       (
                                           <Text style={[styles.text, { fontFamily: 'comfortae' }]}>
                                              
                                             Já assinado
                               </Text>
                                       )

                                       : (
                                           !this.state.admin && <Botao icone={false} onpress={() => this.assinar()} titulo='Assinar' />
                                       )
                               }

                           </View>
                   )
               }     
               {
                   this.state.abaixo.motivo && <Text>Abaixo reprovado pelo motivo {this.state.abaixo.motivo} </Text>
               }            
              
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