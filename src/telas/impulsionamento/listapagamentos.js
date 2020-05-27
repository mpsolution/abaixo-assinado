import React, { Component } from 'react'
import { View,Text ,ScrollView,StyleSheet ,Dimensions} from 'react-native'
import {connect} from 'react-redux'
import Header from '../../componentes/header'

const {width,height}  = Dimensions.get('window')

class ListaPagamentos extends Component{
    constructor(props){
        super(props)
        this.state = {
            pgs:[]
        }
    }
    static navigationOptions = ({ navigation }) => {
        
        const { params = {} } = navigation.state;
        // headerTitle instead of title
        return {
            header: <Header titulo={'Pagamentos'} filtro={()=>params.filtro()}  navigation={navigation} back={true} menu={true} setting={false} />,
           
        }

    }
    componentDidMount = () =>{
        let pgs = []
        if(this.props.usuario.hasOwnProperty('pagamentos')){
            for (const key in this.props.usuario.pagamentos) {
                if (this.props.usuario.pagamentos.hasOwnProperty(key)) {
                    const pagamento = this.props.usuario.pagamentos[key];
                    pgs.push({pagamento,nota:key})
                    
                }
            }
        }
        console.log('ARRAY COM AS NOTAS',pgs)
        this.setState({pgs})
    }
    render(){
       
        return(
            <ScrollView style={styles.container}>
                {
                    this.state.pgs.map((pagamento,index)=>(
                        <View key={index} style={styles.nota}>
                                        <Text>Nota : {pagamento.nota} </Text>
                                        <Text>Situação {pagamento.pagamento.Situacao}</Text>
                                    </View>
                    )) 
                }
             

            </ScrollView>
        )
    }
}
const styles = StyleSheet.create({
    container:{
        flex:1
    },
    nota:{
        height:height *0.2,
        width,
        borderWidth: 0.5,
        borderColor: 'black',
        paddingHorizontal: 10,
        paddingVertical: 10,
        justifyContent:'center',
        alignItems: 'center',
        alignContent: 'center',
        marginBottom: 10,
    }
})
const mapStateToProps = state => ({
  usuario:state.usuario.usuario

});
const mapDispatchToProps = dispatch =>{
    return{
     
     
    }
};
export default connect(mapStateToProps,mapDispatchToProps)(ListaPagamentos)