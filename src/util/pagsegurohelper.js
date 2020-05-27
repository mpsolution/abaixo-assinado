'use strict';
(function(){
    document.addEventListener('message', function(event) {
        console.log("Received post message", event);
        alert(event.data)
        try{
            let mensagem = JSON.parse(event.data)
            if(mensagem.id){
                /**  PagSeguroDirectPayment.setSessionId(mensagem.id);
                PagSeguroDirectPayment.getPaymentMethods({
                    amount: 500.00,
                    success: function(response) {
                        window.postMessage(JSON.stringify(response))
                        // Retorna os meios de pagamento disponíveis.
                    },
                    error: function(response) {
                        window.postMessage(JSON.stringify(response))
                        // Callback para chamadas que falharam.
                    },
                    complete: function(response) {
                        window.postMessage(JSON.stringify(response))
                        // Callback para todas chamadas.
                    }
                });
                 * 
                */
               
            }
            try{
                if(mensagem.comando === 'CriarCardToken'){
                    PagSeguroDirectPayment.setSessionId(mensagem.idSessao);
                    let creditCard = mensagem.creditCard
                    window.postMessage(JSON.stringify(`20${creditCard.values.expiry.split('/')[1]}`))
                    PagSeguroDirectPayment.onSenderHashReady(function(response){
                        if(response.status == 'error') {
                            console.log(response.message);
                            window.postMessage(JSON.stringify(response.message))
                            return false;
                        }
                        var hash = response.senderHash; //Hash estará disponível nesta variável.
                        let resposta = {comando:'HASH',payload:hash}
                        window.postMessage(JSON.stringify(resposta))
                        let mensagem = {
                            creditCardMandado:creditCard.values.number.split(' ').join('')
                        }
                        window.postMessage(JSON.stringify(mensagem))
                        try{
                            if(creditCard.values.type.includes('-')){
                                creditCard.values.type = creditCard.values.type.split('-').join('')
                                window.postMessage(JSON.stringify({marcadocartao:creditCard.valus.type}))
                            }
                        }catch(e){
                            window.postMessage({error:'HOUVE ERRO AO ACERTAR O TYPES',e})
                        }
                        
                        PagSeguroDirectPayment.createCardToken({
                            //cardNumer:'4111111111111111',
                            cardNumber:creditCard.values.number.split(' ').join(''),
                            brand:creditCard.values.type,
                            brand:creditCard.values.type,
                            cvv:creditCard.values.cvc,
                            //cvv:'123',
                            //expirationMonth:'12',
                            expirationMonth:`${creditCard.values.expiry.split('/')[0]}`,
                            //expirationYear:'2030',
                            expirationYear:`20${creditCard.values.expiry.split('/')[1]}`,
                            success:(response)=>{
                                Object.assign(response,{
                                    hash:hash
                                })
                                window.postMessage(JSON.stringify(response))
                            },
                            error:(response)=>{
                                window.postMessage(JSON.stringify(response))
                            },
                            complete:(response)=>{
                               // window.postMessage(JSON.stringify(response))
                            }
                        })
                    });
                    
            }   
            
            }catch(e){
                window.postMessage(JSON.stringify({error:'NAO FOI POSSIVEL FAZER O TOKEN'}))
            }
        }catch(e){
            alert(e)
        }
      
    });
    setTimeout(()=>{

      
    },2000)
    var log = document.querySelector("textarea");

    document.querySelector("button").onclick = function() {
        console.log("Send post message");

        logMessage("Sending post message from web..");
        window.postMessage("Veio da webview*");
    }

   

    function logMessage(message) {
        log.append((new Date()) + " " + message + "\n");
    }
})();