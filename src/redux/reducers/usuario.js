
const usuario = (state = {
    usuario:{},
    resposta:''
}, action) => {
    switch (action.type) {
      case'ATUALIZAR_USUARIO_SUCCESS':{
          return {...state,usuario:action.usuario}
      }
      case 'ATUALIZAR_USUARIO_FAILED':{
          return{...state,usuario:{}}
      }
      case 'PAGAMENTO_SUCCESS':{
          return{...state,resposta:action.resposta}
      }
      case 'PAGAMENTO_FAILED':{
          return{...state,error:action.error}
      }
    }
    return state
  }
  
  export default  usuario
  