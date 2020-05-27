import { takeLatest } from 'redux-saga/effects'
import {atualizarEnderecoUsuario,atualizarUsuario} from './usuariosaga'
import {iniciarSessaoPagamento,enviarPagamentoSaga} from './pagamentosaga'
import {getAbaixosSaga, atualizarAbaixosCarrinhoSaga} from './abaixos'

function* rootSaga() {
  yield takeLatest('INICIAR_ATUALIZAR_USUARIO',atualizarUsuario)
  yield takeLatest('BUSCAR_ENDERECO',atualizarEnderecoUsuario)
  yield takeLatest('INICIAR_SESSAO_PAGAMENTO',iniciarSessaoPagamento)
  yield takeLatest('ENVIAR_PAGAMENTO',enviarPagamentoSaga)
  yield takeLatest('INICIAR_GET_ABAIXOS',getAbaixosSaga)
  yield takeLatest('INICIAR_ATUALIZAR_ABAIXOS_CARRINHO',atualizarAbaixosCarrinhoSaga)

}

export default rootSaga;
