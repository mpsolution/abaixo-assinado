import React, { Component,PureComponent } from 'react';
import { Text, StyleSheet, TouchableOpacity ,Dimensions,View,TextInput} from 'react-native';
const {width,height } = Dimensions.get('window');
export default class Input extends Component {
    constructor(props) {
        super(props)
       
    }
    render() {
        return (
                <View style={styles.container}>
                    <Text style={styles.text}>{this.props.titulo}</Text>
                    <View style={styles.textcontainer}>
                         <TextInput key selectionColor='lightgray' 
                                    keyboardType={this.props.keyboardType}
                                    value={this.props.value}
                                    maxLength={this.props.lenght}
                                    onChangeText={(text)=>this.props.onChangeText(text,this.props.campo)} />
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
        flexDirection:'column',
        alignItems:'flex-start'

    },
    textcontainer:{
        borderColor:'lightgray',
        borderWidth: 1,
        width:'100%',
        marginTop:5
    }
    ,
    text:{
        paddingLeft:width * 0.01,
        color:'gray',
        fontWeight: 'bold',
    }
})