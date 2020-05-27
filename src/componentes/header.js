import React, { Component } from 'react';
import { View, StyleSheet, Text, Dimensions, TouchableOpacity ,TextInput,TouchableWithoutFeedback} from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
const { height,width } = Dimensions.get('window')

export default class Header extends Component {
    constructor(props) {
        super(props)
        this.state={
            fontLoaded:true,
            buscar:'',
        }

    }
   
    render() {

        return (
            <View style={[styles.container, { height: height / 12, backgroundColor: '#ff6600', marginTop: getStatusBarHeight(),  }]}>
                <View style={{
                    marginTop: (getStatusBarHeight())*2,
                    height: height / 12,
                   
                    flexDirection: 'row', width, backgroundColor: '#ff6600', justifyContent: 'center',
                    alignItems: 'center',
                    alignContent: 'center',}}>
                    {
                        this.props.adminback && <TouchableOpacity onPress={() => { this.props.navigation.goBack(null) }} style={{ position: 'absolute', left: 10, }}>
                            <MaterialIcons name='keyboard-backspace' color='#fff' size={25} style={{ marginLeft: 10,padding:15}} />
                        </TouchableOpacity>

                    }

                {
                    this.props.back && <TouchableOpacity onPress={() => { this.props.navigation.goBack() }} style={{ position: 'absolute', left: 10, }}>
                        <MaterialIcons name='keyboard-backspace' color='#fff' size={25} style={{ marginLeft: 10, padding:15}} />
                    </TouchableOpacity>

                }
                    {
                        this.props.backnull && <TouchableOpacity onPress={() => { this.props.navigation.goBack(null) }} style={{ position: 'absolute', left: 10, }}>
                            <MaterialIcons name='keyboard-backspace' color='#fff' size={25} style={{ marginLeft: 10, padding: 15 }} />
                        </TouchableOpacity>

                    }
                {
                    this.props.menu && <TouchableOpacity onPress={() => { this.props.navigation.toggleDrawer() }} style={{ position: 'absolute', right: 10, }}>
                            <SimpleLineIcons name='settings' color='#fff' size={25} style={{ marginLeft: 10, padding:15}} />
                    </TouchableOpacity>
                }
                {
                        this.state.fontLoaded ? (<Text style={styles.text}>{this.props.titulo}</Text>) : null
                } 
                {
                    this.props.setting && <TouchableOpacity onPress={() => { this.props.filtro() }} style={{ position: 'absolute', right: 10, }}>
                        <SimpleLineIcons name='equalizer' color='#fff' size={25} style={{ marginLeft: 10, transform: [{ rotate: '90deg' }] ,padding:5}} />
                    </TouchableOpacity>
                }
                   
                </View>
               
            
           
                
                
                 
              

                  
               
               
            </View>



        )
    }
}
//    <View style={styles.bordarcontainer}>
//   <View style={{
// backgroundColor: '#fff', width: '100%', height: '100%', borderTopRightRadius: (getStatusBarHeight()) * 2,
//  borderTopLeftRadius: (getStatusBarHeight()) * 2,}}>
//  </View>
// </View>
//
//
//
const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        width,
        backgroundColor:'black',
        


    },
    bordarcontainer:{
        backgroundColor:'#ff6600',
        width,
        height:(getStatusBarHeight(true)) * 2,      
        zIndex:0,
                overflow:'hidden',
                justifyContent:'center',
                alignItems:'center',
                flexDirection:'row'

    },
    text: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 20,
        fontFamily:'comfortae'
    }
})