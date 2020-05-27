import React, { Component } from 'react'
import { View, Text, StyleSheet, Dimensions,TouchableOpacity, ScrollView, KeyboardAvoidingView,AsyncStorage,Alert,TextInput} from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height';

import firebase from 'react-native-firebase'
import Input from '../componentes/input'
import InputData from '../componentes/inputdata'

import Botao from '../componentes/botao'
import {connect } from 'react-redux'
import {iniciarAtualizarUsuario,buscarEndereco} from '../redux/actions/index'
import {testarCpf} from '../util/funcoes'
import DateTimePicker from "react-native-modal-datetime-picker";

import Header from '../componentes/header'
const {width,height} = Dimensions.get('window')
const sizeuniversal = (width / height) 
 class Cadastros extends Component{
    constructor(props){
        super(props)
    }
    
    state = {
       email:'',
       nome:'',
       sobrenome:'',
       cpf:'',
       rua:'',
       numero:'',
       bairro:'',
       cidade:'',
       estado:'',
       cep:'',
       ddd:'',
       tel:'',
       dataNascimento:'00/00/0000',
       isDateTimePickerVisible:false
    }
    showDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: true });
      };
     
      hideDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: false });
      };
     
      handleDatePicked = date => {
        console.log("A date has been picked: ", date);
        let dia = ''
        let mes = ''
        let ano = date.getFullYear()
        if(date.getDate()<10){
            dia = `0${date.getDate()}`
        }else{
            dia = `${date.getDate()}`
        }
        if(date.getMonth() <10){
            mes = `0${date.getMonth()+1}`
        }else{
            mes = `${date.getMonth()+1}`
        }

        dataNascimento = `${dia}/${mes}/${ano}`
        this.setState({dataNascimento})
        this.hideDateTimePicker();
      };
    componentDidMount = async () =>{
        firebase.database()
                .ref('/usuarios/'+this.props.usuario.uid)
                .on('value',(snapshot=>{
                    let usuario = snapshot.toJSON()
                    this.setState({...usuario})
                }))
                
    }
    onChangeText = (text,campo) =>{
        this.setState({[campo]:text})
    }
    onChangeCep = (cep,campo)=>{
        this.setState({cep})
        if(cep.length === 8 && !cep.includes('-') ){
            this.props.buscarEndereco(cep)
        }
    }
   
    salvar = async () => {
       
        if(testarCpf(this.state.cpf)){
            if(!this.props.usuario.uid){
                Alert.alert(
                    'Erro',
                    'Não foi possivel atualizar seus dados tente novamente mais tarde!',
                    [

                        { text: 'OK', onPress: () => console.log('saiu') },
                    ],
                    { cancelable: true },
                );

            }else{
                this.props.iniciarAtualizarUsuario({...this.state,uid:this.props.usuario.uid})
                this.props.navigation.goBack(null)
            }
        }else{
            {
                Alert.alert(
                    'Campo cpf deve ser preenchido',
                    'Cpf sem preencher ou invalido,cpf não deve conter . ou -',
                    [

                        { text: 'OK', onPress: () => console.log('saiu') },
                    ],
                    { cancelable: true },
                );
                return
            }
        }
       
        
    }
    render(){
        return(
            <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
               
                <ScrollView keyboardShouldPersistTaps='always' style={{
                    width, height: height * 2, marginBottom: getStatusBarHeight(),
      }}>
        <DateTimePicker
          datePickerModeAndroid='spinner'
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={this.handleDatePicked}
          onCancel={this.hideDateTimePicker}
        />
                    
                    <View style={styles.card}>
                        <Text style={styles.titulo}>Dados Pessoais</Text>
                        <Input titulo={'Email'} value={this.state.email} onChangeText={this.onChangeText} campo={'email'} />
                        <Input titulo={'Nome'} value={this.state.nome} onChangeText={this.onChangeText} campo={'nome'} />
                        <Input titulo={'Sobrenome'} value={this.state.sobrenome} onChangeText={this.onChangeText} campo={'sobrenome'} />
                        <View style={styles.containerinput}>
                            <Text style={styles.text}>CPF</Text>
                            <View style={styles.textcontainer}>
                                <TextInput keyboardType='decimal-pad' selectionColor='lightgray' value={this.state.cpf} onChangeText={(text) => this.setState({cpf:text})} />
                            </View>
                            
                        </View>
                        
                  </View>
                    <View style={styles.card}>
                        <Text style={styles.titulo}>Informações</Text>
                        <View style={{flexDirection:'row' ,width:'100%'}}>
                             <View style={{width:'20%'}}>
                                 <Input titulo={'DDD'} 
                                       value={this.state.ddd} 
                                       keyboardType='phone-pad' 
                                       lenght={3} onChangeText={this.onChangeText} 
                                       campo={'ddd'} />
                            </View>
                            <View style={{ width: '80%' }}>
                                <Input titulo={'Telefone'} 
                                       keyboardType='phone-pad'
                                       value={this.state.telefone} 
                                       onChangeText={this.onChangeText} 
                                       campo={'telefone'} />
                            </View>
                      
                            
                        </View>
                        <Input titulo={'CEP'} 
                               keyboardType='phone-pad' 
                               value={this.state.cep} 
                               onChangeText={this.onChangeCep} 
                               campo={'cep'} />

                        <Input titulo={'Rua'} value={this.state.rua} onChangeText={this.onChangeText} campo={'rua'} />
                        <View style={{flexDirection:'row' ,width:'100%'}}>
                            <View style={{ width: '80%' }}>
                                <Input titulo={'Bairro'} value={this.state.bairro} onChangeText={this.onChangeText} campo={'bairro'} />
                            </View>
                            <View style={{width:'20%'}}>
                            <Input titulo={'Nº'} 
                                   keyboardType={'phone-pad'}
                                   value={this.state.numero} 
                                   onChangeText={this.onChangeText} 
                                   campo={'numero'} />
                            </View>
                            
                        </View>
                        <View style={{ flexDirection: 'row', width: '100%' }}>
                             <View style={{width:'75%'}}>
                                <Input titulo={'Cidade'} value={this.state.cidade} onChangeText={this.onChangeText} campo={'cidade'} />
                             </View>
                            <View style={{width:'25%'}}>
                                <Input titulo={'Estado'} value={this.state.estado} onChangeText={this.onChangeText} campo={'estado'} />  
                            </View>
                        </View>                      
                        <TouchableOpacity
                        onPress={()=>{
                            this.setState({isDateTimePickerVisible:true})
                        }}
                        >
                           <InputData titulo={'Data de Nascimento'}  dataNascimento={this.state.dataNascimento}/>  
                        </TouchableOpacity>

                    </View>
                    <Botao titulo={'Atualizar'} onpress={this.salvar} />
                </ScrollView>
               
            </KeyboardAvoidingView>
        )
    }
}
const styles = StyleSheet.create({
    container:{
       height:height,
       justifyContent:'center',
       alignItems: 'center',
        marginTop: getStatusBarHeight(),
        marginBottom: getStatusBarHeight(),
    },
    
    card:{
        marginLeft:width * 0.01,
        marginRight: width * 0.01,
        borderWidth: 1,
        borderColor: '#58727F',
        justifyContent:'center',
        marginTop: (getStatusBarHeight() / 2),
    },
    titulo:{
        fontSize: sizeuniversal * 0.8,      
        fontWeight: 'bold',
        alignSelf: 'center',
        color: '#58727F',
    },
    containerinput: {
        width: '100%',
        paddingLeft: width * 0.05,
        paddingRight: width * 0.05,
        
        flexDirection: 'column',
        alignItems: 'flex-start'

    },
    textcontainer: {
        borderColor: 'lightgray',
        borderWidth: 1,
        width: '100%',
        marginBottom:4
   
    }
    ,
    text: {
        paddingLeft: width * 0.01,
        color: 'gray',
        fontWeight: 'bold',
    }
})
const mapStateToProps = state => ({
  usuario:state.usuario.usuario
});
const mapDispatchToProps = dispatch =>{
    return{
      buscarEndereco(cep){
          dispatch(buscarEndereco(cep))
      },
      iniciarAtualizarUsuario(usuario){
        dispatch(iniciarAtualizarUsuario(usuario))
      }
    }
};
export default connect(mapStateToProps,mapDispatchToProps)(Cadastros);