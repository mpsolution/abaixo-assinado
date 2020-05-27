import React, { Component } from 'react'
import { View, Text, StyleSheet, Dimensions, FlatList } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height';

import Card from '../componentes/card'
import Header from '../componentes/header'
import BotaoAdicionar from '../componentes/botaoAdicionar'

const { width, height } = Dimensions.get('window')
export default class Menu extends Component {
    constructor(props) {
        super(props)
    }
    static navigationOptions = ({ navigation }) => {

        const { params = {} } = navigation.state;
        // headerTitle instead of title
        return {
            header: <Header titulo={'Abaixos Assinados'} filtro={() => params.filtro()} navigation={navigation} back={false} menu={true} setting={false} />
        }

    }
    state = {
        dados: ['Minhas Participações', 'Meus Abaixos Assinados', 'Meus Manifestos Salvos',],
        icones: ['star-circle', 'account-box-multiple','book-minus']
    }
    goCategoria = (menu) => {
        console.log('ESTA INDO NA NO ABAIXO ASSINADO POR MENU',menu)
        this.props.navigation.navigate('Meusabaixos',{menu})
    }
    _renderItem = ({index, item }) => (
      
        <View style={styles.cardContainer}>

            <Card icone={this.state.icones[index]} titulo={item} onpress={()=>this.goCategoria(index)} menu={true} 
            />
        </View>

    );
    _keyExtractor = (item, index) => item + index + '';
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
                <FlatList
                    keyboardShouldPersistTaps='always'
                    contentContainerStyle={{
                        marginTop: (getStatusBarHeight())*2,
                        paddingBottom: (getStatusBarHeight()) * 7,
                        paddingLeft: width * 0.01,
                        paddingRight: width * 0.01,


                    }}
                    data={this.state.dados}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                />
                <BotaoAdicionar navigation={this.props.navigation} />
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
        marginTop: height * 0.01
    }
})