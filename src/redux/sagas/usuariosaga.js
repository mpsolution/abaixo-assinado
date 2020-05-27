import { call, put, select,fork} from 'redux-saga/effects'
import {salvarObjAsyncStorage,buscarEndereco} from '../../util/funcoes'
import {atualizarUsuarioFirebase } from '../../firebaseapi/api'

export function* atualizarEnderecoUsuario(action){
    try{
      const end = yield call(buscarEndereco,action.cep)
      if(end.cep === null || end.localidade === undefined || end.logradouro === null || end.bairro === undefined || end.uf === undefined){
        throw({error:'SEM ENDEREÇO'})
      }
      let usuario= yield select(store => store.usuario.usuario)
    
      Object.assign(usuario,{
       cep: end.cep,
       cidade:end.localidade,
       rua:end.logradouro,
       bairro:end.bairro,
       estado:end.uf
      }) 
      yield put({type:'INICIAR_ATUALIZAR_USUARIO',usuario})
      yield put({type:'BUSCAR_ENDERECO_SUCCESS'})
  
    }catch(e){
      yield put({type:'BUSCAR_ENDERECO_FAILED'})
    }
    
  
  }
 export  function* atualizarUsuario(action){
    try{
     yield fork(atualizarUsuarioFirebase,action.usuario)
     yield fork(salvarObjAsyncStorage,'USUARIO',action.usuario)
     yield put({type:'ATUALIZAR_USUARIO_SUCCESS',usuario:action.usuario})
    }catch(e){
      yield put({type:'ATUALIZAR_USUARIO_FAILED'})
    }
  }