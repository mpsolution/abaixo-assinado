import { call, put,  select} from 'redux-saga/effects'
import {Alert} from 'react-native'
import {iniciarSessaoPagseguro,enviarPagamento,validarPagamento} from '../../util/funcoes'

export function* iniciarSessaoPagamento(action){
    try{
      yield put({type:'SHOW_EXECUTANDO'})
      yield put({type:'ATUALIZANDO_MENSAGEM',mensagem:'Iniciando sessão de pagamento.'})
      const idSessao  = yield call(iniciarSessaoPagseguro)
      if(idSessao !== '' && idSessao !== undefined){
          let usuario = yield select(store=>store.usuario.usuario)
          let senderName = usuario.nome
          let senderCPF  = usuario.cpf        
          let senderAreaCode = usuario.ddd
          let senderPhone    = usuario.telefone
          let senderEmail         = usuario.email
          let creditCardHolderBirthDate = usuario.dataNascimento     
          let creditCardHolderCPF      = usuario.cpf  
          let creditCardHolderAreaCode = usuario.ddd
          let creditCardHolderPhone = usuario.telefone
          let billingAddressStreet = usuario.rua
          let billingAddressNumber = usuario.numero
          let billingAddressDistrict = usuario.bairro
          let billingAddressPostalCode = usuario.cep
          let billingAddressCity = usuario.cidade
          let billingAddressState = usuario.estado
          
          yield put({type:'INICIAR_SESSAOPAGAMENTO_SUCCESS',
                  idSessao,
                  senderName,
                  senderCPF,
                  senderAreaCode,
                  senderPhone,
                  senderEmail,
                  creditCardHolderBirthDate,
                  creditCardHolderCPF,
                  creditCardHolderAreaCode,
                  creditCardHolderPhone,
                  billingAddressStreet,
                  billingAddressNumber,
                  billingAddressDistrict,
                  billingAddressPostalCode,
                  billingAddressCity,
                  billingAddressState
                 })     
          }else{
                  throw({error:'nao foi possivel iniciar a sessão'})
                }

              }catch(e){
                console.log(e)
                yield put({type:'INICIAR_SESSAOPAGAMENTO_FAILED'})
              }
              yield put({type:'HIDE_EXECUTANDO'})
              yield put({type:'ATUALIZANDO_MENSAGEM',mensagem:''})
}

export function* enviarPagamentoSaga(action){
    yield put({type:'SHOW_EXECUTANDO'})
    yield put({type:'ATUALIZANDO_MENSAGEM',mensagem:'Fazendo Pagamento'})
    try{
      let pagamento                  = yield select(store=>store.pagamento)
      pagamento.creditCardToken      = action.creditCardToken
      pagamento.hash                 = action.hash
      pagamento.creditCardHolderName = action.creditCardHolderName
      pagamento.billingAddressState  = pagamento.billingAddressState.toUpperCase()
      pagamento.reference.dataPagamento = Date.now()
      pagamento.reference            = JSON.stringify(pagamento.reference)
      pagamento.installmentValue     = pagamento.itemAmount1
      //Retira o traço do CEP
      if(pagamento.billingAddressPostalCode.includes('-')){
        pagamento.billingAddressPostalCode = pagamento.billingAddressPostalCode.split('-').join('')
      }
      delete pagamento.type;
      if(validarPagamento(pagamento)){
        console.log('VALOR DO PAGAMENTO ENVIADO',pagamento.itemAmount1)
        resposta = yield call(enviarPagamento,pagamento)
        
       
        console.log('PAGSEGURO',resposta)
        if(resposta.hasOwnProperty('error') && resposta.error.hasOwnProperty('message')){
          yield put({type:'PAGAMENTO_FAILED'})
          Alert.alert(
            'Pagamento',
            'Error'+resposta.error.message,
            [
              {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            {cancelable: false},
          );
        }else{
          yield put({type:'PAGAMENTO_SUCCESS',resposta})
          if(resposta.hasOwnProperty('code')){
            Alert.alert(
              'Pagamento',
              'Pagamento feito com sucesso.',
              [
                {text: 'OK', onPress: () => console.log('OK Pressed')},
              ],
              {cancelable: false},
            );
    
          }
          yield put({type:'ATUALIZANDO_MENSAGEM',mensagem:'Pagamento Feito Com Sucesso'})
          
        }
        yield put({type:'HIDE_EXECUTANDO'})
        
      }else{

        Alert.alert(
          'Pagamento',
          'Erro ao fazer o pagamento.',
          [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ],
          {cancelable: false},
        );
        Alert.alert(
          'Pagamento',
          'Dados Faltando para efetuar pagamento.',
          [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ],
          {cancelable: false},
        );
        yield put({type:'ATUALIZANDO_MENSAGEM',mensagem:'Erro ao fazer o pagamento'})

        throw({error:'Dados Faltando para efetuar pagamento'})

      }
        yield put({type:'HIDE_EXECUTANDO'})
        
  
      }
    
  
    catch(e){
      let error  = ''
      if(e.hasOwnProperty('error')){error = e.error}
      else error = 'Não foi possivel concluir o pagamento'
      console.log(error)
      yield put({type:'ATUALIZANDO_MENSAGEM',mensagem:'Erro ao fazer o pagamento'})
      yield put({type:'PAGAMENTO_FAILED',error})
      yield put({type:'HIDE_EXECUTANDO'})
      Alert.alert(
        'Pagamento',
        'Não foi possivel concluir o pagamento.',
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
        {cancelable: false},
      );
  
    }
  }