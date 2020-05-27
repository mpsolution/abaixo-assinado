import React, { Component } from 'react'
import { View, Text, StyleSheet, Dimensions ,TouchableWithoutFeedback} from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import CheckBox from 'react-native-check-box'
import {connect} from 'react-redux'
const { width, height } = Dimensions.get('window')
const sizeuniversal = (width / height) * 41
class CardCarrinho extends Component {
    constructor(props) {
        super(props)
        this.state ={
            abaixosCarrinho:{idManifestos:[]}
        }
    }
    
    componentWillReceiveProps = (nxtprops) =>{
        console.log('NOVASS PROPS RECEBIDAS')
        this.setState({abaixosCarrinho:nxtprops.abaixosCarrinho})
    }
    render() {       
      
       
        return (
             
            <TouchableWithoutFeedback onPress={this.props.onpress} >
             
               
                <View style={styles.container}  >
                <Text style={[styles.text,{fontFamily:'comfortae'}]} >
                    {this.props.nome}
                 
                </Text>
               
                       
                <View style={{flexDirection:'row',alignSelf:'flex-start'}}>
                        <View style={styles.containerInfo}>
                            <View style={[styles.iconeContainer, { paddingRight: 10 }]}>
                                <MaterialIcons name='person' color='#336699' size={sizeuniversal} style={styles.icone} />
                                <Text style={[styles.texticone, { fontFamily: 'comfortae' }]}>Assinantes: </Text>
                                <Text style={[styles.textassinantes, { fontFamily: 'comfortae' }]}>{this.props.indiceAssinaturas}</Text>
                            </View>
                            <View style={[styles.iconeContainer, { paddingRight: 10 }]}>
                                <MaterialIcons name='date-range' color='#336699' size={sizeuniversal} style={styles.icone} />
                                <Text style={[styles.texticone, { fontFamily: 'comfortae' }]}>Data de Criacao: </Text>
                                <Text style={[styles.textassinantes, { fontFamily: 'comfortae' }]}>{this.props.dataCriacao}</Text>
                            </View>


                        </View>
                        <View style={styles.containerInfo}>
                            <View style={[styles.iconeContainer, { paddingRight: 10 }]}>
                                <MaterialIcons name='access-alarm' color='#336699' size={sizeuniversal} style={styles.icone} />
                                <Text style={[styles.texticone, { fontFamily: 'comfortae' }]}>Encerra em </Text>

                            </View>

                            <View style={[styles.iconeContainer, { alignSelf:'center', flexDirection:'row',flex:1, alignItems:'center',justifyContent:'center' }]}>
                               
                                
                                <Text style={[styles.textassinantes, { fontFamily: 'comfortae', alignSelf:'center' }]}> {this.props.prazo} </Text>
                                {this.props.prazo !== 'Encerrado' &&
                                    <Text style={[styles.textassinantes, { fontFamily: 'comfortae', alignSelf: 'center' }]}> 
                                        Dias
                                    </Text>
                                }
                            </View>
                        </View>
                </View>
                <View style={{position:'absolute',bottom:5,right:10}}>
                   {
                       this.props.estanocarrinho &&  <MaterialIcons name='check' color='#fd7317' size={sizeuniversal} style={styles.icone} />
                   }
                </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        height:height * 0.15,
        width:'100%',
        borderRadius: height * 0.01,
        borderWidth: 0.5,
        borderColor: '#465779',
        paddingLeft: width * 0.04,
        paddingRight: width * 0.02,
        flexDirection:'column',
        justifyContent:'flex-start',
        backgroundColor:'#fff',
        alignItems:'center'
       
    },
    containercategoria:{
        height: height * 0.15,
        width: '100%',
        borderRadius: height * 0.01,
        borderWidth: 0.5,
        borderColor: '#465779',
        paddingLeft: width * 0.03,
        paddingRight: width * 0.01,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        backgroundColor: '#fff',
        alignItems:'center'
    },
    textcategoria:{
        fontSize: sizeuniversal * 0.8,      
        fontWeight: 'bold',
        alignSelf: 'center',
        color: '#336699',
      
    },
    text: {
        fontSize: sizeuniversal,
       // fontWeight: 'bold',
        alignSelf: 'flex-start',
        color:'#336699',
        
    },
    textassinantes:{
        fontWeight:'bold'
    },
    iconeContainer:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center'
    },
    texticone:{
        fontSize: sizeuniversal/2,
        color:'#336699'
    },
    containerInfo:{
        flexDirection:'column',
        alignItems: 'flex-start',
        justifyContent:'center',
        marginTop: 2,
        alignSelf:'flex-start'
    },
    icone:{
        marginRight:width * 0.01
    },
    impulsionado:{
        width:30,
        height:30,
        borderRadius: 15,
    position:'absolute',
    bottom:5,
    right:5,
    justifyContent:'center',
    alignItems: 'center',
    },
    botao:{
        width:50,
        height:50,
        borderRadius: 25,
        justifyContent:'center',
        alignItems: 'center',
    }
})
const mapStateToProps = (state) => {
    return{
        abaixosCarrinho : state.pagamento.reference.idManifestos

    }
    
};
const mapDispatchToProps = dispatch =>
  ({

  })
export default connect(mapStateToProps,mapDispatchToProps)(CardCarrinho)