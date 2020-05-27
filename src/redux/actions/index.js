//PAGAMENTO
export const iniciarSessaoPagamento = {
  type:'INICIAR_SESSAO_PAGAMENTO'
}
export const enviarPagamento = (creditCardToken,hash,creditCardHolderName)=>({
  type:'ENVIAR_PAGAMENTO',
  creditCardToken,
  hash,
  creditCardHolderName
})
// Usuario
export const criarUsuario = (usuario) => ({
  type: 'CRIAR_USUARIO',
  usuario: usuario
})

export const editUsuario = (usuario) => ({
  type: 'EDIT_USUARIO',
  usuario: usuario
})
export const iniciarAtualizarUsuario = (usuario)=>({
  type:'INICIAR_ATUALIZAR_USUARIO',
  usuario
})
export const removeUsuario = (usuario) => ({
  type: 'REMOVE_USUARIO',
  usuario: usuario
})
export const iniciarCarregarUsuario = {
  type:'INICIAR_CARREGAR_USUARIO'
}
export function iniciarLogin(login,senha){
  return{
    type:'INICIAR_LOGIN',
    login,
    senha
  }
}

//APP
export function buscarEndereco(cep){
 return{
   type:'BUSCAR_ENDERECO',
   cep
 }
}
export const iniciarGetAbaixos = (abaixos)=>( {
 
    type:'INICIAR_GET_ABAIXOS',
    abaixos
  
})
export const iniciarAtualizarAbaixosCarrinho = (abaixo) =>({
  type:'INICIAR_ATUALIZAR_ABAIXOS_CARRINHO',
  abaixo
})