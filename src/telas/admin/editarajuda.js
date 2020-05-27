import React, { Component } from 'react'
import { View, Text, StyleSheet, Dimensions, TextInput, Modal, TouchableHighlight, KeyboardAvoidingView, Alert, ScrollView, Picker, AsyncStorage } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height';

import Botao from '../../componentes/botao'
import Header from '../../componentes/header'
import firebase from 'react-native-firebase'
const { width, height } = Dimensions.get('window')
const sizeuniversal = (width / height) * 41
export default class EditarAjuda extends Component {
    constructor(props) {
        super(props)
    }
    static navigationOptions = ({ navigation }) => {

        const { params = {} } = navigation.state;
        // headerTitle instead of title
        return {
            header: <Header titulo={'Editar Ajuda'} filtro={() => params.filtro()} navigation={navigation} back={true} menu={true} setting={false} />,

        }

    }
    state = {
        ajuda: ` Aqui estará a mensagem de ajuda para o usuario.`,

        modalVisible: false
    }

    componentDidMount = () =>{
        firebase.database().ref('/ajuda').on('value', (snapshot) => {
            try {
                let ajuda = snapshot.toJSON()
                //Data vindo o banco de dados

                console.log(ajuda)
                if (ajuda.salvar) {
                    this.setState({ ajuda: ajuda.salvar })

                }
            } catch (e) {
                console.log(e)
            }

        })
    }
    salvar = async () => {

        let salvar = this.state.ajuda
        firebase.database().ref('ajuda').update({
        salvar
        }).then((resul) => {

            Alert.alert(
                'Tela ajuda Atualizada com Sucesso',
                'Atualizada com Sucesso',
                [

                    { text: 'OK', onPress: () => this.props.navigation.navigate('AdminMenu') },
                ],
                { cancelable: true },
            );
        })
       



    }
    
    render() {

        return (
            <KeyboardAvoidingView keyboardVerticalOffset={5} style={{ flex: 1 }} behavior='height' enabled>
                <ScrollView keyboardShouldPersistTaps='always' style={styles.container}>

                    <View style={styles.card}>
                      
                        <View style={styles.inputcontainer}>
                            <TextInput multiline={true} autoFocus={true} onChangeText={(text) => this.setState({ ajuda: text })}
                                value={this.state.ajuda} style={styles.textabaixo} />
                        </View>                    


                        <View style={styles.botaocontainer}>
                            <Botao onpress={() => this.salvar()} icone={false} titulo='Salvar' />
                        </View>
                     

                    </View>

                </ScrollView>
            </KeyboardAvoidingView>

        )

    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#Fff',
        marginRight: width * 0.01,
        marginLeft: width * 0.01,
        marginTop: getStatusBarHeight() * 2,
        flexGrow: 1,
        marginBottom: width * 0.01,
        height,
      

    },
    inputcontainer: {
        backgroundColor: '#fff',
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignContent: 'center',
        paddingLeft: width * 0.01,
        paddingRight: width * 0.01,
        paddingBottom: width * 0.01,
        paddingTop: width * 0.01,
        height:height  * 0.6,
        marginBottom: 10
    },
    card: {
        height: '100%',


        paddingLeft: width * 0.05,
        paddingRight: width * 0.05,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        backgroundColor: '#fff',
        alignItems: 'center'
    },
    text: {
        fontSize: sizeuniversal * 0.8,
        fontWeight: 'bold',
        alignSelf: 'center',
        color: '#58727F',
        marginTop: height * 0.01,

    },
    textabaixo: {
        fontSize: sizeuniversal * 0.7,
        alignSelf: 'flex-start',
        color: '#58727F',
        marginTop: height * 0.02,


    },
    botaocontainer: {
        width: '100%',
        alignSelf: 'flex-end',
        justifyContent: 'flex-end',
        borderWidth: 1,
        borderColor: 'lightgray',
        alignItems: 'flex-end',
        alignContent: 'flex-end',
        


    },
    categoriacontainer: {
        width,
        height: 60,
        flexDirection: 'row',
        marginLeft: width * 0.04,
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center'


    }

})