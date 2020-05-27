//Reducer com informações sobre o pagamento
const initial_state = {
  idSessao:'',
  creditCardToken:'',
  hash:'',
  senderName:'',
  senderCPF:'',          
  senderAreaCode:'2',
  senderPhone:'',   
  senderEmail:'aaaaa@sandbox.pagseguro.com.br',
  installmentValue:'1.00',
  creditCardHolderName:'',
  creditCardHolderCPF:'',
  creditCardHolderBirthDate:'',
  creditCardHolderAreaCode:'',
  creditCardHolderPhone:'',
  billingAddressStreet:'',
  billingAddressNumber:'',
  billingAddressDistrict:'',
  billingAddressPostalCode:'',
  billingAddressCity:'',
  billingAddressState:'',
  reference:{
    idManifestos:[],
    idUsuario:'',
    dataPagamento:''
  },
  itemAmount1:'0.00',  
}
const pagamento = (state = initial_state, action) => {
    switch (action.type) {
      case'INICIAR_SESSAOPAGAMENTO_SUCCESS':{
          return {...state,...action}
      }
      case 'INICIAR_SESSAOPAGAMENTO_FAILED':{
          return{...state}
      }
      case 'ATUALIZAR_ABAIXOS_CARRINHO_SUCCESS':{
        return{...state,reference:{...action.reference},itemAmount1:action.itemAmount1}
      }
    }
    return state
  }
  
  export default  pagamento
  