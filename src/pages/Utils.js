import React from "react";
import namor from "namor";
import "../App.css";
import PouchDB from 'pouchdb';


const range = len => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const newPerson = () => {
  const statusChance = Math.random();
  return {
    firstName: namor.generate({ words: 1, numbers: 0 }),
    lastName: namor.generate({ words: 1, numbers: 0 }),
    age: Math.floor(Math.random() * 30),
    visits: Math.floor(Math.random() * 100),
    progress: Math.floor(Math.random() * 100),
    status:
      statusChance > 0.66
        ? "relationship"
        : statusChance > 0.33 ? "complicated" : "single"
  };
};

export function makeData(tabela) {

}

export function exportaData(){
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
    });
}



export function syncData(){
    let tabelas = {
        clientes:{},
        produtos:{}
    }

    //CLIENTES
    fetch('http://192.168.0.251:3001/clientes').then(r => r.json()).then(r => {
      console.log(r) 
      localStorage.setItem('myStorage', JSON.stringify(r))})
    



    //PRODUTOS
    fetch('http://192.168.0.251:3001/produtos').then(r => r.json()).then(r => {
      console.log(r) 
      localStorage.setItem('myStorage', JSON.stringify(r))})

    // console.log(localStorage.getItem('myStorage'))
    // // tabelas.produtos=JSON.stringify(localStorage.getItem('myStorage'))
    // console.log(JSON.stringify(tabelas))
    

}

export const Logo = () =>
  <div style={{ margin: '1rem auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center'}}>
    For more examples, visit {''}
  <br />
    <a href="https://github.com/react-tools/react-table" target="_blank">
      <img
        src="https://github.com/react-tools/media/raw/master/logo-react-table.png"
        style={{ width: `150px`, margin: ".5em auto .3em" }}
      />
    </a>
  </div>;

export const Tips = () =>
  <div style={{ textAlign: "center" }}>
    <em>Tip: Hold shift when sorting to multi-sort!</em>
  </div>;
