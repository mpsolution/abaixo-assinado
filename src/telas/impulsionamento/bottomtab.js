import React, { Component } from 'react'
import { View,Text ,StyleSheet,Dimensions ,TouchableOpacity , Alert} from 'react-native'
import {connect} from 'react-redux'
const {width,height} = Dimensions.get('window')
class BottomTab extends Component{
    constructor(props){
        super(props)
    }
    componentDidMount = () =>{
      
    }
    render(){
            return(
                <View style={styles.container}>
                    
                    <View style={styles.textcontainer}>
                        <Text style={styles.text}>Abaixos :</Text>
                        {
                            Array.isArray(this.props.idManifestos) && ( <Text style={styles.text}>{this.props.idManifestos.length}</Text>)
                        }
                       
                       
                    </View>
                    <View style={styles.textcontainer}>
                         <Text style={styles.text}>Valor :</Text>
                        <Text style={styles.text}>R$: {`${this.props.itemAmount1}`}</Text>
                    </View>
                    <TouchableOpacity 
                     onPress={()=>{
                        this.props.navigation.navigate('ListaPagamentos')
                     }}
                     style={styles.textcontainer}>
                        <Text style={styles.text}>Notas</Text>
                    </TouchableOpacity>
                 
    
                </View>
            )
        
       
    }
}
const styles = StyleSheet.create({
    container:{
        width,
        height:height*0.08,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'space-around',
        backgroundColor:'#ff6600'
    },
    text:{
        color:'#fff'
    },
    textcontainer:{
        justifyContent:'center',
        alignItems:'center'
    }
})
const mapStateToProps = state => ({
      idManifestos:state.pagamento.reference.idManifestos,
      itemAmount1:state.pagamento.itemAmount1,
      usuario:state.usuario.usuario
});
const mapDispatchToProps = dispatch =>{
    return{
     
      
    
    }
};
export default connect(mapStateToProps,mapDispatchToProps)(BottomTab)