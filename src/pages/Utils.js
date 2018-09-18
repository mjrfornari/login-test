// import React from "react";
// import namor from "namor";
// import { render } from "react-dom";
import "../App.css";
import PouchDB from 'pouchdb';

const db = new PouchDB('macropecas');

export function makeData(tabela) {

}

export function readData(callback){
    db.get('read', function(err, doc) {
      if (err) {
          return console.log(err);
      } else {
        callback(doc);
      }
    })

}




export function syncData(user){

    fetch('http://192.168.0.251:3001/clientes/'+user).then(r => r.json()).then(r => {
      let result = {
        _id: 'base',
        data: {
          clientes: r
        }
      }

      db.get('base').then(function(doc) {
        let newResult = {
          _id: 'base',
          data:  result.data,
          _rev: doc._rev
        }     
        return db.put(newResult);
      }).then(function(response) {
        console.log('Base updated!')
      }).catch(function (err) {
        if (err.name === 'not_found') {
          db.put(result).then(function (response) {
              console.log('Base Created!')
          }).catch(function (err) {
            console.log(err);
          });
        }
      });

      let read = {
        _id: 'read',
        data: {
          clientes: r
        }        
      }

      db.get('read').then(function(doc) {
        let newRead = {
          _id: 'read',
          data:  result.data,
          _rev: doc._rev
        }     
        return db.put(newRead);
      }).then(function(response) {
        console.log('Read updated!')
      }).catch(function (err) {
        if (err.name === 'not_found') {
          db.put(read).then(function (response) {
              console.log('Read Created!')
          }).catch(function (err) {
            console.log(err);
          });
        }
      });

    })
    

    

}
