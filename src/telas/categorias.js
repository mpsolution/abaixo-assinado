import React, { Component } from 'react'
import { View, Text, StyleSheet, Dimensions, FlatList, } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height';

import  firebase from 'react-native-firebase';
import Card from '../componentes/card'
import Header from '../componentes/header'
import BotaoAdicionar from '../componentes/botaoAdicionar'

const { width, height } = Dimensions.get('window')

export default class Categorias extends Component {
    constructor(props) {
        super(props)
    }
    static navigationOptions = ({ navigation }) => {

        const { params = {} } = navigation.state;
        // headerTitle instead of title
        return {
            header: <Header titulo={'Categorias'} filtro={() => params.filtro()} navigation={navigation} back={false} menu={true} setting={false} />
        }

    }
    /** 
     * 
     *   icones : {
            cidade: 'city',
            condominio: 'city-variant',
            educacao: 'school',
            esporte: 'soccer',
            estado: 'google-analytics',
            mobilidadeUrbana: 'bus',
            orgaosPublicos: 'libray-plus',
            outros: 'sync',
            pais: 'hail',
            saude: 'hospital',
            seguranca: 'security',
            uniao: 'source-branch',
            veiculosNoticias: 'library-books'
        }
    */
    state = {
          dados:[],
       // dados: ['Cidade', 'Condomínio', 'Educação', 'Esporte', 'Estado', 'Mobilidade Urbana', 'Orgãos Públicos', 'Outros', 'Pais', 'Saúde', 'Segurança', 'União', 'Veículos de Notícia'],
          icones: ['city', 'home-group', 'school', 'soccer', 'bank', 'bus', 'hail', 'sync', 'flag', 'hospital', 'security', 'gavel', 'television' ],
      
    }
    goCategoria = (categoria) =>{
        this.props.navigation.navigate('Home',{categoria})
    }
    _renderItem = ({ index,item }) =>{
        let icone = 'city';
        switch(item){
            case 'Cidade'               : {icone = this.state.icones[0];break;}
            case 'Condomínio'           : {icone = this.state.icones[1];break;}
            case 'Educação'             : {icone = this.state.icones[2];break;}
            case 'Esporte'              : {icone = this.state.icones[3];break;}
            case 'Estado'               : {icone = this.state.icones[4];break;}
            case 'Mobilidade Urbana'    : {icone = this.state.icones[5];break;}
            case 'Orgãos Públicos'      : {icone = this.state.icones[6];break;}
            case 'Outros'               : {icone = this.state.icones[7];break;}
            case 'Pais'                 : {icone = this.state.icones[8];break;}
            case 'Saúde'                : {icone = this.state.icones[9];break;}
            case 'Segurança'            : {icone = this.state.icones[10];break;}
            case 'União'                : {icone = this.state.icones[11];break;}
            case 'Veículos de Notícia'  : {icone = this.state.icones[12];break;}
        }
        return (
        <View style={styles.cardContainer}>
            <Card icone={icone} titulo={item} onpress={()=>this.goCategoria(item)} categorias={true}
            />
        </View>

    )};
    _keyExtractor = (item, index) => item + index + '';
    componentDidMount = async () =>{

        let categorias = await firebase.database().ref('/categorias').once('value', (snapshot) => {
            const categorias = snapshot.toJSON();
            return categorias
        });
        categorias = categorias.toJSON()
        this.setState({dados:Object.keys(categorias)})
       

    }
    render() {
        return (
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
                    backgroundColor: '#fff', width: '100%', height: '100%', borderTopRightRadius: (getStatusBarHeight()) * 2,
                    borderTopLeftRadius: (getStatusBarHeight()) * 2,}}>
                    </View>
                </View>
            
                
                <FlatList
                    keyboardShouldPersistTaps='always'
                        contentContainerStyle={{
                        
                        paddingBottom: (getStatusBarHeight()) * 7,
                      
                        }}
                        style={{
                           
                            paddingLeft: width * 0.01,
        paddingRight: width * 0.01,}}
                    data={this.state.dados}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                />
               <BotaoAdicionar navigation={this.props.navigation}  />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        width,
        height,
        backgroundColor: '#fff',    
        marginTop:height * 0.029,
        overflow: 'visible',
        
       
       
    },
    text: {

    },
    cardContainer: {
        marginTop: height * 0.01,
        overflow: 'visible',
       
    }
})