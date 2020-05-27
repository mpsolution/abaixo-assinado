import React, { Component } from 'react'
import { View ,Text,TouchableOpacity,StyleSheet,Dimensions} from 'react-native'
import LinearGradient from 'react-native-linear-gradient';


const {height} = Dimensions.get('window')
export default class BotaoLista extends Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
            <LinearGradient style={styles.container} colors={['#fda117', '#fd9417','#fd8817','#fd7317']} >
            <TouchableOpacity style={styles.botao}  onPress={this.props.onPress}>

      
                   <Text style={{fontSize:20,color:'#fff'}}>Pagar</Text>
      
            </TouchableOpacity>    
            </LinearGradient>          

        )
    }
}
const styles =StyleSheet.create({
    container:{
        width:150,
        height:60,
        borderRadius: 25,
    position:'absolute',
    top:height * 0.67,
    bottom:10,
    right:15,
    elevation:50,
    justifyContent:'center',
    alignItems: 'center',
    },
    botao:{
        width:150,
        height:60,
        borderRadius: 25,
        justifyContent:'center',
        alignItems: 'center',
    }
    
})
