import React, { Component ,} from 'react'
import { CameraRoll, View, Text, StyleSheet, WebView,Share, Dimensions, TouchableWithoutFeedback, ActivityIndicator, Linking , ScrollView,AsyncStorage} from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height';
import firebase from 'react-native-firebase'
import Header from '../componentes/header'
const { width, height } = Dimensions.get('window')
const sizeuniversal = (width / height) * 41
export default class Sobre extends Component {
    constructor(props) {
        super(props)
        state={
         sobre:'',
         loading:true
        }
    }
    state={
      sobre:''
        
    }
    static navigationOptions = ({ navigation }) => {

        const { params = {} } = navigation.state;
        // headerTitle instead of title
        return {
            header: <Header titulo={'Sobre'} filtro={() => params.filtro()} navigation={navigation} backnull={true} menu={true} setting={false} />,
          
        }

    }
  
    componentDidMount = async () =>{
        //console.log('TELA DE ABAIXO MONTOU PELO MENU')
        firebase.database().ref('/sobre').on('value', (snapshot)=>{
            try{
                   let sobre = snapshot.toJSON()
           //Data vindo o banco de dados
           
           console.log(sobre)
           if(sobre.salvar){
               this.setState({ sobre: sobre.salvar })

           }
            }catch(e){
                console.log(e)
            }
         
       })
      
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
           //scrollview contendo a pagina sobre
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
               <ScrollView keyboardShouldPersistTaps='always' style={styles.container}> 
            
             
                    <View  style={styles.card}>
                        <Text style={[styles.textabaixo,{fontFamily:'comfortae',marginBottom:height *  0.05,marginTop:height *0.01}]}>
                           {this.state.sobre}
                        </Text>
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