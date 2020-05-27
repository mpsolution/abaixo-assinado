const INITIAL_STATE = {
  mensagem:'',
  executando:false,
  abaixos:[],
  loading:false
}

const app = (state = INITIAL_STATE, action) => {
  switch(action.type){
    case 'SHOW_EXECUTANDO':{
      return{...state,executando:true}
    }
    case 'HIDE_EXECUTANDO':{
      return{...state,executando:false}
    }
    case 'ATUALIZANDO_MENSAGEM':{
      return {...state,mensagem:action.mensagem}
    }
    case 'RESETANDO_MENSAGEM':{
      return{...state,mensagem:''}
    }
    case 'GET_ABAIXOS_SUCCESS':{
      return{...state,abaixos:action.abaixos}
    }
    case 'SHOW_LOADING':{
      return{...state,loading:true}
    }
    case 'HIDE_LOADING':{
      return{...state,loading:false}
    }
  }


  return state

}

export default app
