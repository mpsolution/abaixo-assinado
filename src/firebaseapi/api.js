import React, { Component } from 'react'
import { Alert} from 'react-native'

import  firebase from 'react-native-firebase'
function snapshotToArray(snapshot) {
    var returnArr = [];

    snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        item.key = childSnapshot.key;

        returnArr.push(item);
    });

    return returnArr;
};

export function atualizarUsuarioFirebase(usuario){
    console.log('USUARIO A SE BUSCAR',usuario.uid)
   if(!usuario.hasOwnProperty('uid') || (usuario.uid == undefined)){
    Alert.alert(
        'Erro',
        'Não foi possivel atualizar seus dados tente novamente mais tarde!',
        [

            { text: 'OK', onPress: () => console.log('saiu') },
        ],
        { cancelable: true },
    );
    return null
       
   }
   return firebase.database()
          .ref('/usuarios/' +usuario.uid)
          .update({ ...usuario })
         
          
     
}

export function getAbaixos(){
    try{
        return new Promise((resolve)=>{
            firebase.database()
            .ref('manifestos')
            .orderByChild('dataCriacao')
            .once('value',(abaixos)=>{
                resolve(snapshotToArray(abaixos))
            })
        })
        
    }catch(e){
        console.log('ERRO NA BUSCA DO ABAIXO NO FIREBASE',e)
    }
    
    
}