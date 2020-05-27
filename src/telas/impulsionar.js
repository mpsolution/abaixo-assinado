import React, { Component } from 'react'
import { View,Text ,StyleSheet,WebView ,Button,ActivityIndicator, Dimensions , Alert} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { CreditCardInput } from "react-native-credit-card-input";
import Modal from "react-native-modal";
import {connect } from 'react-redux'
import {iniciarSessaoPagamento,enviarPagamento} from '../redux/actions/index'
import pagseguroHelper from '../util/pagsegurohelper.html'
import Header from '../componentes/header'
import Botao from '../componentes/botao'

const {width,height} = Dimensions.get('window')

class Impulsionar extends Component{
    constructor(props){
        super(props)
        this.webView = null;
      
        creditCard=''
        this.state = {
          idSessao:'',
          creditCardToken:'',
          hash:'',
      
        }
    }
   
    static navigationOptions = ({ navigation }) => {

      const { params = {} } = navigation.state;
      // headerTitle instead of title
      return {
          header: <Header titulo={'Impulsionar'}  navigation={navigation} back={false} menu={true} setting={false} />
      }

  }
  
    onMessage= async ( event )=>{
      console.log( "On Message voltou pro react native", event.nativeEvent.data );
      Alert.alert(
        'Mensagem recebida',
        'Mensagem da webview' + event.nativeEvent.data,
        [
         
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
        {cancelable: false},
      );
      let respostadaWebView = JSON.parse(event.nativeEvent.data)
      try{
        if(respostadaWebView.comando === 'HASH'){
          console.log('HASH DA SESSÃO DE PAGAMENTO',respostadaWebView.payload)
        }
      }catch(e){

      }
      try{
        if(respostadaWebView.hasOwnProperty('card')){
          console.log('TOKEN DO CARTAO DE CREDITO',respostadaWebView.card.token)
          await this.setState({ creditCardToken:respostadaWebView.card.token,hash:respostadaWebView.hash})
          this.props.enviarPagamento(this.state.creditCardToken,this.state.hash,this.state.creditCard.values.name)
        }
      }catch(e){
        console.log('ERRO AO CHECKAR SE RESPOSTA TEM TOKEN')
      }
      
       }

      sendPostMessage=(mensagem)=>{
          console.log( "Sending post message" );
          
          this.webView.postMessage( mensagem );
      }
    
    componentDidMount = async () =>{
      //this.iniciarSessaoPagamento()
      this.props.iniciarSessaoPagamento()
      let usuario = await AsyncStorage.getItem('USUARIO')
      usuario =  JSON.parse(usuario)
      console.log('USUARIO SALVO',usuario)

    }
    criarCardToken = () =>{
      if(this.state.hasOwnProperty('creditCard')){
        if(this.state.creditCard.valid){
          let mensagem = {
            comando:'CriarCardToken',
            creditCard:this.state.creditCard,
            idSessao:this.props.idSessao
          }
          this.sendPostMessage(JSON.stringify(mensagem))
        }else{
          Alert.alert(
            'Erro no Cartão',
            'Cartão de crédito inválido',
            [
             
              {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            {cancelable: false},
          );
        }

      }
    
     
    }
    
    state = { useLiteCreditCardInput: false };

    _onChange = (formData) => {
      this.setState({
        creditCard:formData
      })
      console.log(JSON.stringify(formData, null, " "))};
    _onFocus = (field) => console.log("focusing", field);
    _setUseLiteCreditCardInput = (useLiteCreditCardInput) => this.setState({ useLiteCreditCardInput });
  
    render(){
        return(
            <View style={{flex:1, marginTop: height * 0.029,}}>            
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
                <Modal 
                   useNativeDriver={true}
                   style={styles.bottomModal}
                   isVisible={this.props.executando}>
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
                          <Text style={styles.contentTitle}>{this.props.mensagem}</Text>
                          <ActivityIndicator size="small" color="#ff6600" />
                        </View>
                      
                  </View>
                </Modal>
                    {
                      //<Button onPress={this.onPressBroken} title={'CriarCardToken'} />
                      //<Button onPress={this.onPressWorks} title={'Works'} />
                      //
                    }
            <View style={{opacity:1,flex:1}}>
            <WebView 
               ref={ref => (this.webView = ref)}
               onMessage={(event)=>{this.onMessage(event)}}
               injectedJavaScript={
                `(function() {
  window.postMessage = function(data) {
    window.ReactNativeWebView.postMessage(data);
  };
})()`
               }
               javaScriptEnabledAndroid={true}
               onShouldStartLoadWithRequest={() => true}
               useWebKit={true}
               domStorageEnabled={true}
               originWhitelist={['*']}
              source={{uri:'https://mail.mpitsolutions.com.br/pagseguro/pagsegurohelper.html'}}

            />
            </View>
<CreditCardInput
              autoFocus
              name={''}
              requiresName
              requiresCVC              
              labels={
                  {number:"Numero do Cartao",
                  expiry:"Expira",
                  cvc:"CVC/CCV",
                  name:'Nome Completo'}

              }
              addtionalInputsProps = {
                {name: {
                  defaultValue: 'Nome',
                  maxLength: 20,
                },
                postalCode: {
                  returnKeyType: 'go',
                }}
              }
              
              placeholders={
                {number:"Numero do Cartão",
                  expiry:"Expira",
                  cvc:"CVC/CCV",
                  name:'Nome Completo'}
              }
              labelStyle={s.label}
              inputStyle={s.input}
              validColor={"black"}
              invalidColor={"red"}
              placeholderColor={"darkgray"}

              onFocus={this._onFocus}
              onChange={this._onChange} />  
              <View style={{
                width:width *0.8,
                justifyContent:'center',
                alignItems:'center',
                alignSelf:'center',
                marginTop:15

              }}>
                <Botao titulo={'Pagar'} onpress={()=>{this.criarCardToken()}} />
                 
              </View>
            </View>
        )
    }
}
const s = StyleSheet.create({
    switch: {
      alignSelf: "center",
      marginTop: 20,
      marginBottom: 20,
    },
    container: {
      backgroundColor: "#F5F5F5",
      marginTop: 60,
    },
    label: {
      color: "black",
      fontSize: 12,
    },
    input: {
      fontSize: 16,
      color: "black",
    },
    bottomModal: {
      justifyContent: 'flex-end',
      margin: 0,
  },
  content: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  contentTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color:'#fff'
},
  });
  const mapStateToProps = state => ({
    idSessao:state.pagamento.idSessao,
    creditCardToken:state.pagamento.creditCardToken,
    hash:state.pagamento.hash,
    senderName:state.pagamento.senderName,
    senderCPF:state.pagamento.cpf,          
    senderAreaCode:state.pagamento.senderAreaCode,
    senderPhone:state.pagamento.senderPhone,   
    installmentValue:state.pagamento.installmentValue,
    creditCardHolderName:state.pagamento.creditCardHolderName,
    creditCardHolderCPF:state.pagamento.creditCardHolderCPF,
    creditCardHolderBirthDate:state.pagamento.creditCardHolderBirthDate,
    creditCardHolderAreaCode:state.pagamento.creditCardHolderAreaCode,
    creditCardHolderPhone:state.pagamento.creditCardHolderPhone,
    billingAddressStreet:state.pagamento.billingAddressStreet,
    billingAddressNumber:state.pagamento.billingAddressNumber,
    billingAddressDistrict:state.pagamento.billingAddressDistrict,
    billingAddressPostalCode:state.pagamento.billingAddressPostalCode,
    billingAddressCity:state.pagamento.billingAddressCity,
    billingAddressState:state.pagamento.billingAddressState,
    reference:state.pagamento.reference,
    itemAmount1:state.pagamento.itemAmount1,
    mensagem:state.app.mensagem,
    executando:state.app.executando
   
  });
  const mapDispatchToProps = dispatch =>{
      return{
        iniciarSessaoPagamento(){
            dispatch(iniciarSessaoPagamento)
        },
        enviarPagamento(creditCardToken,hash,creditCardHolderName){
          dispatch(enviarPagamento(creditCardToken,hash,creditCardHolderName))
        }
      
      }
  };
  export default connect(mapStateToProps,mapDispatchToProps)(Impulsionar);