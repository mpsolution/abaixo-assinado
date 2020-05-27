import React, { Component } from 'react'
import { View, Text, StyleSheet, Dimensions, FlatList, Alert} from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Dialog from "react-native-dialog";
import  firebase from 'react-native-firebase'


import Card from '../../componentes/card'
import Header from '../../componentes/header'

const { width, height } = Dimensions.get('window')

export default class AdminMenu extends Component {
    constructor(props) {
        super(props)
    }
    static navigationOptions = ({ navigation }) => {

        const { params = {} } = navigation.state;
        // headerTitle instead of title
        return {
            header: <Header titulo={'Administrador'}  navigation={navigation} backnull={true} menu={true} setting={false} />
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
        dados: ['Manifestos', 'Pagina Sobre','Pagina Ajuda', 'Link Compartilhamento', ],
        icones: ['script-text', 'information', 'help-circle','share-variant', ],
        dialogLink:false,
        link:'play.google.com/store'

    }
    goCategoria = (categoria) => {
        if(categoria === 'Usuarios'){
            return null
        }else 
        if(categoria === 'Manifestos'){
            this.props.navigation.navigate('Adminmanifestos')
        }else
        if(categoria === 'Pagina Sobre'){
            this.props.navigation.navigate('EditarSobre')
        }else
        if(categoria === 'Pagina Ajuda'){
            this.props.navigation.navigate('EditarAjuda')
        }else
        if(categoria === 'Link Compartilhamento'){
            this.setState({dialogLink:true})
            return null
        }

       
    }
    salvarLink = () => {
        firebase.database().ref('/link').update(
           {link:this.state.link}
        ).then((resul)=>{
            console.log(resul)
            Alert.alert(
                'Link Salvo Com Sucesso',
                'Link Salvo Com Sucesso',
                [

                    { text: 'OK', onPress: () => console.log('saiu') },
                ],
                { cancelable: true },
            );
        })
  
    }
    _renderItem = ({ index, item }) => (
        <View style={styles.cardContainer}>
            <Card icone={this.state.icones[index]} titulo={item} onpress={() => this.goCategoria(item)} categorias={true}
            />
        </View>

    );
    _keyExtractor = (item, index) => item + index + '';
    componentDidMount = async () => {
        //Faz o carregamento do link no banco de dados caso haja algum erro usa o link padrao salvo no estado atual desta tela
        firebase.database().ref('/link').once('value',(snapshot)=>{
            try{
                let link = snapshot.toJSON();
                this.setState({ link: link.link })
            } catch(e)  {
                console.log('HOUVE UM ERRO NO CARREGAMENTO TO LINK CARREGANDO LINK PADRAO')
            }
            
           
        })
        


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
                        borderTopLeftRadius: (getStatusBarHeight()) * 2,
                    }}>
                    </View>
                </View>
              
                <Dialog.Container visible={this.state.dialogLink}>
                    <Dialog.Title>Link do facebook</Dialog.Title>
                    <Dialog.Input autoFocus={true} label='Link' value={this.state.link} onChangeText={(text) => this.setState({ link: text.toLowerCase() })} />
                    <Dialog.Button label="Cancelar" onPress={async () => {
                        this.setState({ dialogLink: false })

                    }} />
                    <Dialog.Button label="Salvar" onPress={async () => {
                        this.salvarLink()
                        this.setState({ dialogLink: false })

                    }} />

                </Dialog.Container>

                <FlatList
                    contentContainerStyle={{

                        paddingBottom: (getStatusBarHeight()) * 7,

                    }}
                    style={{

                        paddingLeft: width * 0.01,
                        paddingRight: width * 0.01,
                    }}
                    data={this.state.dados}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                />

            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        width,
        height,
        backgroundColor: '#fff',
        marginTop: height * 0.029,
        overflow: 'visible',



    },
    text: {

    },
    cardContainer: {
        marginTop: height * 0.01,
        overflow: 'visible',

    }
})