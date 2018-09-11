// import React from "react";
// import namor from "namor";
// import { render } from "react-dom";
import "../App.css";
import PouchDB from 'pouchdb';



export function makeData(tabela) {

}

export function exportaData(callback){
    //Requiring the package

    //Creating the database object
    let db = new PouchDB('macropecas');

    //Reading the contents of a Document
    db.get('002', function(err, doc) {
      if (err) {
          return console.log(err);
      } else {
        callback(doc);
      }
    })

}




export function syncData(){
    // let tabelas = {
    //     clientes:{},
    //     produtos:{}
    // }

    //CLIENTES
    fetch('http://192.168.0.251:3001/clientes').then(r => r.json()).then(r => {
      console.log(r) 
      localStorage.setItem('myStorage', JSON.stringify(r))})
    

    return localStorage.getItem('myStorage')

    // //PRODUTOS
    // fetch('http://192.168.0.251:3001/produtos').then(r => r.json()).then(r => {
    //   console.log(r) 
    //   localStorage.setItem('myStorage', JSON.stringify(r))})

    // console.log(localStorage.getItem('myStorage'))
    // // tabelas.produtos=JSON.stringify(localStorage.getItem('myStorage'))
    // console.log(JSON.stringify(tabelas))
    

}
