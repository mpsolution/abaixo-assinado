import React, { Component } from 'react'
import { View, Text, StyleSheet, ActivityIndicator, Dimensions,Picker, FlatList, AsyncStorage ,TouchableWithoutFeedback,TextInput} from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { withNavigationFocus } from 'react-navigation';

import firebase from 'react-native-firebase'
import Card from '../../componentes/card'
import Header from '../../componentes/header'

const { width, height } = Dimensions.get('window')
const sizeuniversal = (width / height) * 41
 class Adminmanifestos extends Component {
    constructor(props) {
        super(props)
        state = {
            dados: [],
            loading: true
        }
    }
    static navigationOptions = ({ navigation }) => {

        const { params = {} } = navigation.state;
        // headerTitle instead of title
        return {
            header: <Header titulo={'Abaixo Assinados'} filtro={() => params.filtro()} navigation={navigation} adminback={true} menu={true} setting={false} />,

        }

    }
    state = {
        dados: [],
        dadosoriginais: [],
        loading: true,
        categorias: ['Todos','Cidade', 'Condominio', 'Educacao', 'Esporte', 'Estado', 'Mobilidade Urbana', 'Orgaos Publicos', 'Outros', 'Pais', 'Saúde', 'Segurança', 'União', 'Veiculos de Noticia'],
        ativarBusca:false,
        categoria:'Todos',
        buscar:''
    }
    goAbaixoassinado = (abaixo) => {
        console.log('ABAIXO', abaixo)
        this.props.navigation.navigate('AbaixoAdmin', { abaixo ,admin:true})
    }
    pesquisar = () => {
        this.setState({ loading: true })
        let resultado = []
        for (let index = 0; index < this.state.dados.length; index++) {
            const dado = this.state.dados[index];
            if (dado.nome.toLowerCase().includes(this.state.buscar.toLowerCase())) resultado.push(dado)

        }
        this.setState({ loading: false, dados: resultado, })
    }
    filtrarManifestos = () =>{
        //Função que faz o filtro nas categorias
        //Se a categoria selecionada for igual a todos retorna todos os manifestos
        if(this.state.categoria === 'Todos') {
            console.log('ESTA NO FILTRAR MANIFESTOS')
            this.setState({dados:this.state.dadosoriginais})
            return
        }else{
            //Cria um vetor pra armazenar a filtragem
            let dadosfiltrados = []
            for (let index = 0; index < this.state.dadosoriginais.length; index++) {
                const manifesto = this.state.dadosoriginais[index];
                if (manifesto.categoria === this.state.categoria){
                    dadosfiltrados = [...dadosfiltrados,manifesto]
                }
        }
        //Apos isso armazanea a variavel em dados filtrados
        this.setState({dados:dadosfiltrados})
        }
        
    }
    GetFormattedDate = (Time) => {


        Time = new Date(Time)
        var mes = Time.getMonth() + 1;

        var dia = Time.getDate();

        var ano = Time.getFullYear();

        return dia + "/" + mes + "/" + ano;

    }
    daysBetween = (first, second) => {
         first = new Date(first)
         second = new Date(second)
        // Copy date parts of the timestamps, discarding the time parts.
        var one = new Date(first.getFullYear(), first.getMonth(), first.getDate());
        var two = new Date(second.getFullYear(), second.getMonth(), second.getDate());

        // Do the math.
        var millisecondsPerDay = 1000 * 60 * 60 * 24;
        var millisBetween = two.getTime() - one.getTime();
        var days = millisBetween / millisecondsPerDay;

        // Round down.
        let dias = Math.round(days)
        if ((dias) <= 0 ) return 'Encerrado'
        return dias;
    }
    _renderItem = ({ item }) =>{ 
        let dataCriacao = 'Sem data'
        let prazo = ' Sem prazo '        
        if (item.dataCriacao) {
            dataCriacao = this.GetFormattedDate(item.dataCriacao)
            if(item.hasOwnProperty('prazoCriacao') && (item.prazoCriacao !== null)){
                prazo = item.prazoCriacao
            }else{
                prazo = this.daysBetween(item.dataCriacao,item.prazo)
            }
            
            
        }
        return (
        <View style={styles.cardContainer}>
            <Card nome={item.nome} dataCriacao={dataCriacao} prazo={prazo}  indiceAssinaturas={item.indiceAssinaturas} onpress={() => this.goAbaixoassinado(item)}
            />
        </View>

    )};
    componentDidMount = async () => {
        try {

                firebase.database().ref('manifestosemanalise').orderByChild('dataCriacao').on('value', (snapshot) => {
                    try {
                        let snap = snapshot.toJSON();
                        let dados = []
                        if(snap === null) {
                            this.setState({loading:false})
                        }else{
                            let chaves = Object.keys(snap)
                            console.log('QUANTIDADE DE ITENS', chaves)
                            for (let index = 0; index < chaves.length; index++) {
                                dados.push({ id: chaves[index], ...snap[chaves[index]] })

                            }
                            console.log('DADOS', dados)
                            this.setState({
                                dados: dados,
                                dadosoriginais:dados
                            })
                        }
                        

                    } catch (error) {
                        console.log('SEM ITENS DA CATEGORIA')
                        this.setState({ loading: false })

                    }
                    this.setState({ loading: false })
                })
            let categorias = await firebase.database().ref('/categorias').once('value', (snapshot) => {
                const categorias = snapshot.toJSON();
                return categorias
            });
            categorias = categorias.toJSON()
            let dados = []
            let chaves = []
            if (categorias === null) {
                console.log('SEM  CATEGORIAS')
            } else {
                chaves = Object.keys(categorias)
            }
            console.log('ESTADO ATUAL', this.state.categoria)
            await this.setState({ categorias: ['Todos',...chaves] ,categoria:'Todos'})

            console.log('ESTADO depois do categorias', this.state.categoria)




        } catch (error) {
            console.log(error)
            this.setState({ loading: false })
        }
        

    }
    _keyExtractor = (item, index) => item + index + '';
    render() {

        if (this.state.loading)
            return (
                <View style={{ height, width, marginTop: height * 0.035, justifyContent: 'flex-start', alignItems: 'center', }}>
                    {
                        !this.state.ativarBusca &&
                        <TouchableWithoutFeedback onPress={() => { 
                            this.filtrarManifestos()
                            this.setState({ ativarBusca: true }) }}>
                            <View style={styles.bordarcontainer}>
                                <View style={{
                                    alignItems: 'center',
                                    backgroundColor: '#fff', flexDirection: 'row', width: '100%', height: '100%', borderTopRightRadius: (getStatusBarHeight()) * 2,
                                    borderTopLeftRadius: (getStatusBarHeight()) * 2, justifyContent: 'center'
                                }}>
                                    <MaterialIcons name='search' color='#336699' size={25} style={{ marginLeft: 10, }} />



                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    }
                    {
                        this.state.ativarBusca &&
                        <TouchableWithoutFeedback onPress={async () => { 
                            console.log('ESTA NA ACAO FECHAR BUSCA')
                           await this.setState({ ativarBusca: false })
                            this.filtrarManifestos()
                            }}>
                            <View style={styles.bordarcontainer}>
                                <View style={{
                                    alignItems: 'center',
                                    backgroundColor: '#fff', flexDirection: 'row', width: '100%', height: '100%', borderTopRightRadius: (getStatusBarHeight()) * 2,
                                    borderTopLeftRadius: (getStatusBarHeight()) * 2, justifyContent: 'center'
                                }}>
                                    <TextInput style={{ width: '40%', fontFamily: 'comfortae', color: '#336699' }} selectionColor='#336699' clearButtonMode={'always'} value={this.state.buscar} onChangeText={(text) => { this.setState({ buscar: text }) }} autoFocus={true} />

                                    <MaterialIcons name='close' color='#336699' size={25} style={{ marginLeft: 10, }} />

                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    }
                    <ActivityIndicator size="large" color="#58727F" />

                </View>
            )
        if ((this.state.dados.length <= 0) && !this.state.loading) {
            return (
                <View style={{ height, marginTop: height * 0.035, width, justifyContent: 'flex-start', alignItems: 'center', }}>
                    {
                        !this.state.ativarBusca &&
                        <TouchableWithoutFeedback onPress={() => { 
                            this.filtrarManifestos()
                            this.setState({ ativarBusca: true }) }}>
                            <View style={styles.bordarcontainer}>
                                <View style={{
                                    alignItems: 'center',
                                    backgroundColor: '#fff', flexDirection: 'row', width: '100%', height: '100%', borderTopRightRadius: (getStatusBarHeight()) * 2,
                                    borderTopLeftRadius: (getStatusBarHeight()) * 2, justifyContent: 'center'
                                }}>
                                    <MaterialIcons name='search' color='#336699' size={25} style={{ marginLeft: 10, }} />



                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    }
                    {
                        this.state.ativarBusca &&
                        <TouchableWithoutFeedback onPress={async () => {
                            if (this.state.dados.length <= this.state.dadosoriginais.length) 
                                this.filtrarManifestos()
                            this.setState({ ativarBusca: false, buscar: '' }) }}>
                            <View style={styles.bordarcontainer}>
                                <View style={{
                                    alignItems: 'center',
                                    backgroundColor: '#fff', flexDirection: 'row', width: '100%', height: '100%', borderTopRightRadius: (getStatusBarHeight()) * 2,
                                    borderTopLeftRadius: (getStatusBarHeight()) * 2, justifyContent: 'center'
                                }}>
                                    <TextInput style={{ width: '40%', fontFamily: 'comfortae', color: '#336699' }} selectionColor='#336699' clearButtonMode={'always'} value={this.state.buscar} onChangeText={(text) => { this.setState({ buscar: text }) }} autoFocus={true} />

                                    <MaterialIcons name='close' color='#336699' size={25} style={{ marginLeft: 10, }} />

                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    }
                    <Text style={styles.text}>Sem Abaixos Assinados</Text>
                    <View style={styles.categoriacontainer}>
                        <Text style={styles.text}>Categoria :</Text>
                        <Picker

                            selectedValue={this.state.categoria}
                            style={{ height: 60, width: '50%', alignItems: 'center', marginTop: 8 }}
                            onValueChange={async (itemValue, itemIndex) => {
                                console.log('ESTA NA AÇÃO DA CATEGORIA DE MUDANÇA', itemValue)
                                await this.setState({ categoria: itemValue })
                                this.filtrarManifestos()

                            }}>
                            {
                                this.state.categorias.map((cat, index) => {
                                    return (
                                        <Picker.Item key={index + cat} label={cat} value={cat} />
                                    )
                                })
                            }


                        </Picker>
                    </View>

                </View>
            )
        }
        return (
            <View style={styles.container}>
                {
                    !this.state.ativarBusca &&
                    <TouchableWithoutFeedback onPress={() => { this.setState({ ativarBusca: true }) }}>
                        <View style={styles.bordarcontainer}>
                            <View style={{
                                alignItems: 'center',
                                backgroundColor: '#fff', flexDirection: 'row', width: '100%', height: '100%', borderTopRightRadius: (getStatusBarHeight()) * 2,
                                borderTopLeftRadius: (getStatusBarHeight()) * 2, justifyContent: 'center'
                            }}>
                                <MaterialIcons name='search' color='#336699' size={25} style={{ marginLeft: 10, }} />
                                


                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                }
                {
                    this.state.ativarBusca &&
                    <TouchableWithoutFeedback onPress={() => {
                        if (this.state.dados.length <= this.state.dadosoriginais.length) this.filtrarManifestos()
                        this.setState({ ativarBusca: false, buscar: '' })
                    }}>
                        <View style={styles.bordarcontainer}>
                            <View style={{
                                alignItems: 'center',
                                backgroundColor: '#fff', flexDirection: 'row', width: '100%', height: '100%', borderTopRightRadius: (getStatusBarHeight()) * 2,
                                borderTopLeftRadius: (getStatusBarHeight()) * 2, justifyContent: 'center'
                            }}>
                                <TextInput onSubmitEditing={() => { this.pesquisar() }} style={{ width: '40%', fontFamily: 'comfortae', color: '#336699' }} selectionColor='#336699' clearButtonMode={'always'} value={this.state.buscar} onChangeText={(text) => { this.setState({ buscar: text }) }} autoFocus={true} />

                                <MaterialIcons name='close' color='#336699' size={25} style={{ marginLeft: 10, }} />

                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                }
                {
                    this.state.dados.length > 1 ? (<Text style={{ alignSelf: 'center', color: '#336699', }}>{this.state.dados.length} Abaixos Encontrados</Text>) : (<Text style={{ alignSelf: 'center', color: '#336699',}}>{this.state.dados.length} Abaixo Encontrado</Text>)
                }
                <View style={styles.categoriacontainer}>
                    <Text style={styles.text}>Categoria :</Text>
                    <Picker

                        selectedValue={this.state.categoria}
                        style={{ height: 60, width: '50%', alignItems: 'center', marginTop: 8 }}
                        onValueChange={ async (itemValue, itemIndex) => {
                            console.log('ESTA NA AÇÃO DA CATEGORIA DE MUDANÇA',itemValue)
                            await this.setState({ categoria: itemValue })
                            this.filtrarManifestos()
                            
                        }}>
                        {
                            this.state.categorias.map((cat, index) => {
                                return (
                                    <Picker.Item key={index + cat} label={cat} value={cat} />
                                )
                            })
                        }


                    </Picker>
                </View>
                <FlatList
                    contentContainerStyle={{

                        paddingBottom: (getStatusBarHeight()) * 8,

                    }}
                    data={this.state.dados}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                />
            </View>
        )
    }
}
export default withNavigationFocus(Adminmanifestos)
const styles = StyleSheet.create({
    container: {
        width,
        height,
        backgroundColor: '#fff',
        
        marginTop: height * 0.035,
        //justifyContent:'flex-start'
    },
    bordarcontainer: {
        backgroundColor: '#ff6600',
        width,
        height: (getStatusBarHeight()) * 2,
        zIndex: 0,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'

    },
    text: {
        fontSize: sizeuniversal * 0.8,
        fontWeight: 'bold',
        alignSelf: 'center',
        color: '#58727F',
    },
    cardContainer: {
        marginTop: height * 0.01
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