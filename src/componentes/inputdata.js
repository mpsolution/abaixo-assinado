import React, { Component,PureComponent } from 'react';
import { Text, StyleSheet, TouchableOpacity ,Dimensions,View,TextInput} from 'react-native';
const {width,height } = Dimensions.get('window');
export default class InputData extends Component {
    constructor(props) {
        super(props)
       
    }
    render() {
        return (
                <View style={styles.container}>
                    <Text style={styles.text}>{this.props.titulo}</Text>
                    <View style={styles.textcontainer}>
                        <Text>{this.props.dataNascimento}</Text>
                    </View>
                </View>

        )
    }
}
const styles = StyleSheet.create({
    container:{
        width:'100%',
        paddingLeft: width * 0.05,
        paddingRight: width * 0.05,
        height:height * 0.1,
        flexDirection:'column',
        alignItems:'flex-start'

    },
    textcontainer:{
        borderColor:'lightgray',
        borderWidth: 1,
        padding:width * 0.01,
        width:'100%'
    }
    ,
    text:{
        paddingLeft:width * 0.01,
        color:'gray',
        fontWeight: 'bold',
    }
})