import PouchDB from 'pouchdb';
import { deleteData } from './Utils';

// const server = 'http://187.44.93.73:8080';

export const server = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.hostname === "") ? 'http://localhost:3001/api': 'https://macropecasweb.sytes.net:8080/api';
const db = new PouchDB('macropecas', {auto_compaction: true});


function createTable(table, callback){
    console.log('aqui')
    db.put(table).then((res) => {
        callback(res)
    }).catch((err) => {
        console.log(err)
    })
}



export function newDelete(tabela, nomepk, valorpk){
    return new Promise ((resolve) => {
        let sql = 'DELETE FROM '+tabela+' WHERE '+nomepk+' = '+valorpk;
        db.get('log').then(function(doc) {
            let newLog = {
                    _id: 'log',
                    data:  doc.data,
                    _rev: doc._rev
            }
            newLog.data.qty.delete += 1
            newLog.data.delete.push(sql)
            console.log(newLog.data)
            return db.put(newLog)
        }).then(function(response) {
            console.log('done:', response)
            resolve(response)
        }).catch(function (err) {
            console.log(err)
            if (err.name === 'not_found') {
                let log = {
                    _id: 'log',
                    data: {
                        qty: {
                            create: 0,
                            update: 0,
                            delete: 1
                        },
                        create: [],
                        update: [],
                        delete: []
                    }
                }
                log.data.delete.push(sql)
                createTable(log, (res) => {
                    resolve(res)
                })
            } else {
                resolve(err)
            }
        })
    })
}



export function newCreate(tabela, fields, values, nomepk){
    return new Promise ((resolve) => {
        let sql = 'INSERT INTO '+tabela+' ('+fields;
        db.get('log').then(function(doc) {
            let newLog = {
                    _id: 'log',
                    data:  doc.data,
                    _rev: doc._rev
            }
            newLog.data.qty.create += 1
            sql = sql + ','+nomepk+') values ('+values+','+newLog.data.qty.create+')';
            newLog.data.create.push(sql)
            console.log(newLog.data)
            return db.put(newLog)
        }).then(function(response) {
            console.log('done:', response)
            resolve(response)
        }).catch(function (err) {
            console.log(err)
            if (err.name === 'not_found') {
                let log = {
                    _id: 'log',
                    data: {
                        qty: {
                            create: 1,
                            update: 0,
                            delete: 0
                        },
                        create: [],
                        update: [],
                        delete: []
                    }
                }
                sql = sql + ','+nomepk+') values ('+values+',1)';
                log.data.create.push(sql)
                createTable(log, (res) => {
                    resolve(res)
                })
            } else {
                resolve(err)
            }
        })
    })
}


function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}


export function newUpdate(tabela, item, nomepk, valorpk){
    return new Promise ((resolve) => {
        let fields = JSON.stringify(Object.getOwnPropertyNames(item))
        let values = JSON.stringify(Object.values(item))
        let update = []
        fields = fields.split('"').join('').split('[').join('').split(']').join('').split(',')
        values = values.split('[').join('').split(']').join('').split(',')
        console.log(fields)
        console.log(values)
        fields.map((element, index) => {
            update[index]= element+'='+values[index]
        })
        update = JSON.stringify(update).split('"').join("").split('[').join("").split(']').join("").split('\\').join("'")
        
        let sql = 'UPDATE '+tabela+' SET '+update+' WHERE '+nomepk+'='+valorpk
        db.get('log').then(function(doc) {
            let newLog = {
                    _id: 'log',
                    data:  doc.data,
                    _rev: doc._rev
            }
            newLog.data.qty.update += 1
            newLog.data.update.push(sql)
            console.log(newLog.data)
            return db.put(newLog)
        }).then(function(response) {
            console.log('done:', response)
            resolve(response)
        }).catch(function (err) {
            console.log(err)
            if (err.name === 'not_found') {
                let log = {
                    _id: 'log',
                    data: {
                        qty: {
                            create: 0,
                            update: 1,
                            delete: 0
                        },
                        create: [],
                        update: [],
                        delete: []
                    }
                }
                log.data.update.push(sql)
                createTable(log, (res) => {
                    resolve(res)
                })
            } else {
                resolve(err)
            }
        })
    })
}





export function teste(){
    console.log('Step 1 - Start Sync: started!')
    startSync().then((res) => {
        console.log(res)
        console.log('Step 1 - Start Sync: done!')
        console.log('Step 2 - Identify SQLs: started!')
        identifySql().then((res) => {
            console.log(res)
            console.log('Step 2 - Identify SQLs: done!')
            console.log('Step 3 - Send SQLs: started!')
            sendSql().then((res) => {
                console.log(res)
                console.log('Step 3 - Send SQLs: done!')
            })
        })
    })
}

export function teste2(tabela, fields, nomepk, valorpk){
    newUpdate(tabela, fields, nomepk, valorpk)
}

function startSync(){
    return new Promise ((resolve) => {
        let usuario = localStorage.getItem("macropecas")
        fetch(server+'/startSync?user='+usuario).then(r => r.json()).then(r => resolve(r))
    })
}

function identifySql(){
    return new Promise ((resolve) => {
        let usuario = localStorage.getItem("macropecas")
        db.get('log').then((doc) => {
            console.log(doc.data)
            fetch(server+'/identifySync?user='+usuario+'&create='+doc.data.qty.create+'&update='+doc.data.qty.update+'&delete='+doc.data.qty.delete).then(r => r.json()).then(r => resolve(r)) 
        })
               
    })
}

async function sendSql(){
    return new Promise ((resolve) => {
        let usuario = localStorage.getItem("macropecas")
        db.get('log').then((doc) => {
            console.log(doc.data)
            sendType(doc.data.create, usuario, 'create').then((res) => {
                sendType(doc.data.update, usuario, 'update').then((res) => {
                    sendType(doc.data.delete, usuario, 'delete').then((res) => {
                        console.log('terminou')
                    })
                })
            })
        })        
        
    })
}


async function sendType(data, usuario, type){
    return new Promise (async (resolve) => {
        await asyncForEach(data, async (item) => {
            await sendItem(item,usuario, type)
        })
        resolve()
    })
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

function sendItem(item, usuario, type, callback){
    return new Promise (async (resolve) => {
        await fetch(server+'/sendSQL?user='+usuario+'&type='+type+'&sql='+item).then(r => r.json()).then(r => {
            console.log(r)
            resolve(r)
        })
    })

}


function startTransaction (){
    return new Promise (async (resolve) => {
        let usuario = localStorage.getItem("macropecas")
        await fetch(server+'/startTransaction?user='+usuario).then(r => r.json()).then(r => {
            console.log(r)
            resolve(r)
        })
    })

}

function getData(){
    return new Promise ((resolve) => {
        
    })
}

function sync(){
    console.log("*******************************")
    console.log("Synchronization:")
    console.log('Step 1 - Start Sync: started!')
    startSync().then((res) => {

        console.log('Step 1 - Start Sync: done!')
        console.log('Step 2 - Identify SQLs: started!')
        identifySql().then((res) => {

            console.log('Step 2 - Identify SQLs: done!')
            console.log('Step 3 - Send SQLs: started!')
            sendSql().then((res) => {

                console.log('Step 3 - Send SQLs: done!')
                console.log('Step 4 - Transaction: started!')
                startTransaction().then((res) => {

                    console.log('Step 4 - Transaction: done!')
                    console.log('Step 5 - Get Data: started!')
                    getData().then((res) => {

                        console.log('Step 5 - Get Data: done!')
                    })
                })
            })
        })  
    })
}




