import React, { Component } from 'react';
import { Text, StyleSheet, TouchableOpacity ,Dimensions} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
const  {width,height} = Dimensions.get('window')
const sizeIcone =  (width /height) * 50
export default class Botao extends Component {
    constructor(props) {
        super(props)
        this.state={
            fontLoaded:true
        }
        
    }
    
    
    render() {
        return (

            <TouchableOpacity onPress={this.props.onpress} style={styles.botao}>
            {
                    this.state.fontLoaded ? (<Text style={[styles.textbotao, { fontFamily: 'comfortae',}]}>{this.props.titulo}</Text>) : null
            }
                
               {this.props.icone && <MaterialCommunityIcons size={sizeIcone} name='facebook-box' style={{marginLeft: width * 0.1}} color='#fff' />}
            </TouchableOpacity>

        )
    }
}
const styles = StyleSheet.create({

    botao: {
        width: '100%',
        height: height * 0.09,
        backgroundColor: '#4267B2',
        borderRadius: 5,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',        
      
    },
    textbotao: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold'
    }
})