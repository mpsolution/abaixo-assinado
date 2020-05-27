import {getAbaixos } from '../../firebaseapi/api'
import {formatarAbaixos} from '../../util/funcoes'
import { call, put, select,fork} from 'redux-saga/effects'

export function* getAbaixosSaga(action){
    yield put({type:'SHOW_LOADING'})
    try{
        let a = formatarAbaixos(action.abaixos)
        yield put({type:'GET_ABAIXOS_SUCCESS',a})
     
    }catch(e){
        console.log(e)
        yield put({type:'GET_ABAIXOS_FAILED'})
    }
    yield put({type:'HIDE_LOADING'})

}
export function* atualizarAbaixosCarrinhoSaga(action){
    yield put({type:'SHOW_LOADING'})
    try{
        let {reference} = yield select(store=>store.pagamento)
        let {usuario}   = yield select(store=>store.usuario)
        if(reference.idManifestos.includes(action.abaixo.id)){
            const index = reference.idManifestos.indexOf(action.abaixo.id);
            reference.idManifestos.splice(index, 1);
        }else{
            if(reference.idUsuario === ''){
                reference.idUsuario = usuario.uid
            }
            reference.idManifestos.push(action.abaixo.id)
        }
        let itemAmount1 = reference.idManifestos.length * 1 
            itemAmount1 = `${itemAmount1}.00`
            console.log('ITEMAMOUNT NO SAGA',itemAmount1)
        yield put({type:'ATUALIZAR_ABAIXOS_CARRINHO_SUCCESS',reference,itemAmount1})

    }catch(e){
        console.log(e)
        yield put({type:'ATUALIZAR_ABAIXOS_CARRINHO_FAILED'})
    }
    yield put({type:'HIDE_LOADING'})

}