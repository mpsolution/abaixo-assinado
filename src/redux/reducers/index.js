import {combineReducers} from 'redux'
import app from './app'
import login from './login'
import perfil from './perfil'
import usuario from './usuario'
import pagamento from './pagamento'




export default combineReducers({
  app,
  login,
  perfil,
  usuario,
  pagamento
})
