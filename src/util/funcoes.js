import {AsyncStorage} from 'react-native'
const urlpagamento =  'http://mail.mpitsolutions.com.br/pagseguro/efetuarpagamento.php'

export const fazerHtmlAbaixo = (abaixo) =>{
     
    let assinantes = abaixo.assinantes;
    let linha      = "";
    if(Object.keys(assinantes).length>0){
           
           for (let index = 0; index < Object.keys(assinantes).length; index++) {
               linha += '<tr>'
               const assinante = assinantes[Object.keys(assinantes)[index]];
               linha += `  <td>${index + 1}</td>`
               linha += `  <td>${assinante.nome}</td>`
               linha += `  <td>${assinante.email}</td>`
               linha += `  <td>${assinante.cpf}</td>`
               linha += '</tr>'
           }
          
    }else{
        linha += '<tr>'
        linha += `  <td>Sem assinantes</td>`
        linha += `  <td>Sem assinantes</td>`
        linha += `  <td>sem assinantes</td>`
        linha += '</tr>'
    }
   
  let html =  `<Strong>Titulo :</Strong> ${abaixo.nome} <br><br>
    <Strong>Objetivo:</Strong>  ${abaixo.objetivo}  <br><br>
    ${abaixo.corpo} <br><br>
    <h1>Assinantes </h1>
    <br><br>
    <table style="width:100%" >
 <thead>
   <tr>
     <th>#</th>
     <th>Nome</th>
     <th>Email</th>
     <th>CPF</th>
    
   </tr>
 </thead>
 <tbody>
   ${linha}
 </tbody>
</table>
    
    `
    return html

}
export const  daysBetween = (first, second) => {
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
  let dias = Math.floor(days)
  if ((dias) <= 0) return 'Encerrado'
  return dias;
}
export const GetFormattedDate = (Time) =>{

   
  Time = new Date(Time)
  var mes = Time.getMonth() + 1;

  var dia = Time.getDate();

  var ano = Time.getFullYear();

  return dia + "/" + mes + "/" + ano;

}
export function salvarObjAsyncStorage(nome,obj){
  obj = JSON.stringify(obj)
 return AsyncStorage.setItem(nome,obj)
}
export  function testarCpf(strCPF){
  var Soma;
  var Resto;
  Soma = 0;
  if (strCPF == "00000000000") return false;

  for (i = 1; i <= 9; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
  Resto = (Soma * 10) % 11;

  if ((Resto == 10) || (Resto == 11)) Resto = 0;
  if (Resto != parseInt(strCPF.substring(9, 10))) return false;

  Soma = 0;
  for (i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
  Resto = (Soma * 10) % 11;

  if ((Resto == 10) || (Resto == 11)) Resto = 0;
  if (Resto != parseInt(strCPF.substring(10, 11))) return false;
  return true;
}
export function buscarEndereco(cep){
  return new Promise(async resolve=>{
    try{
        endereco = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        });
        endereco = await endereco.json();
        return resolve(endereco);
    }catch(e){
        console.log(e);
        resolve({error:'Nao foi possivel pegar o endereco'})
    }
   

 })
}
//FUNÇÕES DE PAGAMENTOS

export function iniciarSessaoPagseguro(){
 return  fetch('http://mail.mpitsolutions.com.br/pagseguro/iniciarsessao.php', {
  method: 'get',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
 
}).then(res=>res.json())
  .then(res=>{
        try{
          console.log('ID DA SESSAO ',res.id)
          return res.id
        }catch(e){
          return e
        }
        
      })
  .catch((e)=>{
    console.log('ERROR',e)
    return e
  
  });
}
export function validarPagamento(pagamento){
  console.log('FUNCAO DE VALIDÇÃO DE PAGAMENTO')
  let valido = true
  for (const key in pagamento) {   
      const dado = pagamento[key];
      if(dado === '' || dado === undefined || dado === null){
         valido = false
         break;
      }
  }
  console.log('ESTADO DO PAGAMENTO',valido)
  return valido
}
export function validarUsuario(usuario){
  let campos = ['nome','cpf','ddd','telefone','email',
                'dataNascimento','numero','bairro','cep',
                'cidade','estado']
  
  console.log('FUNÇÃO DE VALIDAÇÃO DOS DADOS DO USUARIO',usuario)
  let valido = true
  for (let index = 0; index < campos.length; index++) {
    const dado = usuario[campos[index]];
    if(dado === '' || dado === undefined || dado === null){
      console.log(usuario[campos[index]])
      console.log(campos[index])
      console.log(dado)
      valido = false
      break;
   }
  }
  
  return valido
}
montarFormDataBody = (pagamento) =>{
  console.log('ESTA NA FUNÇÃO MONTAR FORMDATA')
  let body = new FormData();
  for (const key in pagamento) {
      const dado = pagamento[key];
      body.append(key,dado)    
  }
  console.log('FORMDATA MONTADO',body)
  return body
}
export function enviarPagamento(pagamento){
  console.log('ESTA NA FUNÇÃO ENVIAR PAGAMENTO')
  body = montarFormDataBody(pagamento)
  return fetch(urlpagamento, {
      method: "POST",
      body,
      headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data"
      }
  }).then((res)=>{
    console.log('RESPOSTA DO SERVIDOR PAGSEGURO',res)
    res = JSON.stringify(res)
    res = JSON.parse(res)
    console.log('RESPOSTA DO SERVIDOR',res._bodyText);
    return JSON.parse(res._bodyText)
  
  }).catch(e=>{
    return e
  });
  
}
export function formatarAbaixos(abaixos){
  if(abaixos.length > 0){
    let abaixosformatados = []
    let dataCriacao = 'Sem data'
    let dataHoje = Date.now()
    let abaixo = ''
  
    for (let index = 0; index < abaixos.length; index++) {
      try{
         abaixo = abaixos[index];
         if(abaixo.hasOwnProperty('dataCriacao')){
          if(abaixo.dataCriacao) {abaixo.dataCriacao = GetFormattedDate(abaixo.dataCriacao)
            abaixo.prazo = daysBetween(dataHoje, abaixo.prazo)                              
           }else{
             abaixo.dataCriacao = 'Sem data'
           }
         }else{
           abaixo.dataCriacao = 'Sem data'
         }
        
      }catch(e){
        console.log(e)
      }
      abaixosformatados.push(abaixo)
    }
    return abaixosformatados
  }else{
    return abaixos
  }
}