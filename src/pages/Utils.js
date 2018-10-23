import React from "react";
// import namor from "namor";
// import { render } from "react-dom";
import "../App.css";
import PouchDB from 'pouchdb';

const server = 'http://192.168.0.251:3001';
const db = new PouchDB('macropecas');

export function removeAcento (text)
{       
    text = text.toLowerCase();                                                         
    text = text.replace(new RegExp('[ÁÀÂÃ]','gi'), 'a');
    text = text.replace(new RegExp('[ÉÈÊ]','gi'), 'e');
    text = text.replace(new RegExp('[ÍÌÎ]','gi'), 'i');
    text = text.replace(new RegExp('[ÓÒÔÕ]','gi'), 'o');
    text = text.replace(new RegExp('[ÚÙÛ]','gi'), 'u');
    text = text.replace(new RegExp('[Ç]','gi'), 'c');
    return text;                 
}


export function geraInput(fieldname, displayname, value, funcao, tamanho){
  if (tamanho !== null) {
    return (
      <div className="FormField">
        <label className="FormField__Label" htmlFor={fieldname}>{displayname}</label>
        <input type="text" id={fieldname} className="FormField__Input" style={{width : tamanho}}
        name={fieldname} value={value} onChange={(event) => funcao(event)}/>
      </div>
    )
  } else {
    return (
      <div className="FormField">
        <label className="FormField__Label" htmlFor={fieldname}>{displayname}</label>
        <input type="text" id={fieldname} className="FormField__Input" 
        name={fieldname} value={value} onChange={(event) => funcao(event)}/>
      </div>
    )
  }
  
  
}

export function mascaraCNPJ(texto){
    let cnpj = ''
    if (texto != null){
      cnpj=texto.substr(0,2)+'.'+texto.substr(2,3)+'.'+texto.substr(5,3)+'/'+texto.substr(8,4)+'-'+texto.substr(12,2)
    }
    return cnpj;  
}

export function garanteDate(texto){
    let data = ''
    if (texto != null){
      data=texto.substr(8,2)+'/'+texto.substr(5,2)+'/'+texto.substr(0,4)
    }
    return data;
}

export function zeraNull(texto){
    let valor = 0
    if (texto === null) {
      valor = 0
    } else {
      valor = texto
    }
    return valor
}


export function editData(tabela, item, id) {

  //console.log(item)
  readTable(Data => { 
       
        let read = Data
        db.get('read').then(function(doc) {
        let newRead = {
          _id: 'read',
          data:  Data.data,
          _rev: doc._rev
        }     
        newRead.data[tabela][id] = item  
        // newRead.data[tabela].map(function(_, i) { 
        //   if (_.PK_CLI == item.PK_CLI) {
        //     newRead.data[tabela][i] = item
        //   }
        // })

        return db.put(newRead)
      }).then(function(response) {
        console.log('Read updated!')
        
        updateTable(Data => {
          let update = Data
          db.get('update').then(function(doc) {
            let newUpdate = {
              _id: 'update',
              data:  Data.data,
              _rev: doc._rev
            } 
            item.read = id
            newUpdate.data[tabela].push(item)
            return db.put(newUpdate)
        }).then(function(response) {
          console.log('Update updated!')
          alert('Registro alterado com sucesso!') 
          return true
        }).catch(function (err) {
          if (err.name === 'not_found') {
            db.put(update).then(function (response) {
                console.log('Update Created!')
                alert('Registro alterado com sucesso!') 
                return true
            }).catch(function (err) {
              console.log(err);
            });
          }
        });})
      }).catch(function (err) {
        if (err.name === 'not_found') {
          db.put(read).then(function (response) {
              console.log('Read Created!')
          }).catch(function (err) {
            console.log(err);
          });
        }
      });})

  

}

export function appendData(tabela, item) {
        
  //console.log(item)
  readTable(Data => { 
        let id = 0
        let read = Data
        db.get('read').then(function(doc) {
        let newRead = {
          _id: 'read',
          data:  Data.data,
          _rev: doc._rev
        } 

        id = newRead.data[tabela].push(item) - 1
        return db.put(newRead)
      }).then(function(response) {
        console.log('Read updated!')

        createTable(Data => {
          let create = Data
          db.get('create').then(function(doc) {
            let newCreate = {
              _id: 'create',
              data:  Data.data,
              _rev: doc._rev
            } 
            let nitem = item
            nitem.read = id
            newCreate.data[tabela].push(nitem)
            return db.put(newCreate)
        }).then(function(response) {
          console.log('Create updated!')
          alert('Registro incluído com sucesso!') 
          return true
        }).catch(function (err) {
          if (err.name === 'not_found') {
            db.put(create).then(function (response) {
                console.log('Create Created!')
                alert('Registro incluído com sucesso!') 
                return true
            }).catch(function (err) {
              console.log(err);
            });
          }
        });})
 
      }).catch(function (err) {
        if (err.name === 'not_found') {
          db.put(read).then(function (response) {
              console.log('Read Created!')
          }).catch(function (err) {
            console.log(err);
          });
        }
      });})

  

}


export function includeDelete(tabela,item, id){

  deleteTable(Data => { 
        let deleted = Data
        db.get('delete').then(function(doc) {
        let newDelete = {
          _id: 'delete',
          data:  Data.data,
          _rev: doc._rev
        } 

        newDelete.data[tabela].push(item)
        return db.put(newDelete)
      }).then(function(response) {
        console.log('Delete updated!')

        createTable(Data => {
          let create = Data
          db.get('create').then(function(doc) {
            let newCreate = {
              _id: 'create',
              data:  Data.data,
              _rev: doc._rev
            }
            let table = newCreate
            table.data[tabela].forEach(function (element, index)  {
              if (element.read === id) {
                  newCreate.data[tabela].splice(index,1)
              } 
            });
            table = newCreate
            table.data[tabela].forEach(function (element, index)  {
              if (element.read > id) {
                  newCreate.data[tabela][index].read -= 1               
              }  
            });
            return db.put(newCreate)
        }).then(function(response) {
          console.log('Create updated!')
        }).catch(function (err) {
          if (err.name === 'not_found') {
            db.put(create).then(function (response) {
                console.log('Create Created!')
            }).catch(function (err) {
              console.log(err);
            });
          }
        });})



        updateTable(Data => {
          let update = Data
          db.get('update').then(function(doc) {
            let newUpdate = {
              _id: 'update',
              data:  Data.data,
              _rev: doc._rev
            }
            let table = newUpdate
            table.data[tabela].forEach(function (element, index)  {
              if (element.read === id) {
                  newUpdate.data[tabela].splice(index,1)
              } 
            });
            table = newUpdate
            table.data[tabela].forEach(function (element, index)  {
              if (element.read > id) {
                  newUpdate.data[tabela][index].read -= 1               
              }  
            });
            return db.put(newUpdate)
        }).then(function(response) {
          console.log('Update updated!')
        }).catch(function (err) {
          if (err.name === 'not_found') {
            db.put(update).then(function (response) {
                console.log('Update Created!')
            }).catch(function (err) {
              console.log(err);
            });
          }
        });})
 
      }).catch(function (err) {
        if (err.name === 'not_found') {
          db.put(deleted).then(function (response) {
              console.log('Delete Created!')
          }).catch(function (err) {
            console.log(err);
          });
        }
      });})

}

export function deleteData(tabela, item,id) {

  
  readTable(Data => { 
       
        let read = Data
        db.get('read').then(function(doc) {
        let newRead = {
          _id: 'read',
          data:  Data.data,
          _rev: doc._rev
        }
        newRead.data[tabela].splice(id, 1)
        item[0].read = id;
        includeDelete(tabela, item[0], id)
        return db.put(newRead)
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
  });})

  // createTable(Data => { 
       
  //       let read = Data
  //       db.get('read').then(function(doc) {
  //       let newRead = {
  //         _id: 'read',
  //         data:  Data.data,
  //         _rev: doc._rev
  //       }     

  //       newRead.data[tabela].splice(id, 1)
  //       return db.put(newRead)
  //     }).then(function(response) {
  //       console.log('Read updated!')
  //     }).catch(function (err) {
  //       if (err.name === 'not_found') {
  //         db.put(read).then(function (response) {
  //             console.log('Read Created!')
  //         }).catch(function (err) {
  //           console.log(err);
  //         });
  //       }
  // });})




  

}
  



export function makeData(tabela) {

}



export function readTable(callback){
    db.get('read', function(err, doc) {
      if (err) {
          return console.log(err);
      } else {
        callback(doc);
      }
    })

}

export function createTable(callback){
    db.get('create', function(err, doc) {
      if (err) {
          return console.log(err);
      } else {
        callback(doc);
      }
    })

}

export function deleteTable(callback){
    db.get('delete', function(err, doc) {
      if (err) {
          return console.log(err);
      } else {
        callback(doc);
      }
    })

}

export function updateTable(callback){
    db.get('update', function(err, doc) {
      if (err) {
          return console.log(err);
      } else {
        callback(doc);
      }
    })

}


// function geraPk(nomepk, callback) {
//   return fetch(server+'/gerapk/'+nomepk).then(r => r.json()).then(r => {callback(r)})
// }


// export function createToFirebird(nomepk){
//   let newCreate = {
//       _id: 'create',
//       data:  [],
//       _rev: 0
//   } 
//   let clientes = []
//   db.get('create').then(function(doc) {
//     newCreate.data = doc.data
//     newCreate._rev = doc._rev
//     clientes = doc.data.clientes
//     clientes.forEach(function (element, index)  {
//       geraPk(nomepk,Data => {clientes[index].PK_CLI = Data[0].VALOR})
//     });
//     return db.put(newCreate)
//   }).then(function(response) {
//     newCreate.data.clientes = clientes
//     console.log('Create updated!')
//     console.log(response)
    
//   }).catch(function (err) {
//     console.log(err)
//   });

// }

function geraPk(nomepk,callback) {
  return fetch(server+'/gerapk/'+nomepk).then(r => r.json())
}

function criaItem(table, fields, values,callback) {
  return fetch(server+'/criaitem/'+table+'/'+fields+'/'+values).then(r => console.log(r))
}

function atualizaItem(table, fieldsnvalues, where,callback) {
  return fetch(server+'/atualizaitem/'+table+'/'+fieldsnvalues+'/'+where).then(r => console.log(r))
}



export function createToFirebird(nomepk, tablename,callback) {
    let newCreate = {
        _id: 'create',
        data:  [],
        _rev: 0
    }
   setTimeout(function() {
    db.get('create').then(function(doc) { 
        newCreate.data = doc.data
        newCreate._rev = doc._rev
        let clientes = doc.data.clientes
        const geraPkPromiseList = clientes.map((element, index) => geraPk(nomepk).then(Data => ( { ...element, PK_CLI: Data[0].VALOR })))
        return Promise.all(geraPkPromiseList)
    }).then(clientes => {
        newCreate.data.clientes = clientes
    }).then(function(response) {
          // console.log('Read updated with new pks!')
          newCreate.data.clientes.forEach(function (icreated, idcreate)  {
            let propscreated = JSON.stringify(Object.getOwnPropertyNames(icreated))
            let valuescreated = JSON.stringify(Object.values(icreated))
            let fields = propscreated.split('"').join("").split('[').join("").split(']').join("")
            let values = valuescreated.split('"').join("'").split('[').join("").split(']').join("")
            fields = fields+", FK_VEN"
            let usuario = localStorage.getItem("macropecas")
            values = values+", "+usuario
            criaItem(tablename,fields, values)
            db.get('update').then(function(doc) {
              let newUpdate = {
                _id: 'update',
                data:  doc.data,
                _rev: doc._rev
              }
              newUpdate.data.clientes.forEach(function (iupdated, idupdated) {
                  if (icreated.read === iupdated.read){
                    newUpdate.data.clientes[idupdated][nomepk]=icreated[nomepk]
                  }
              })
              return db.put(newUpdate)
            }).then(function(response) {
              console.log('Update updated!')
            })
            // newCreate.data.clientes.splice(idcreate,1)
            // console.log(newCreate.data.clientes)
          })
    }).then(function(response) {
    }).catch(function(err){
        console.log(err)
    })
  callback()
  }, 500)

  console.log('Create sended!')
}


export function updateToFirebird(nomepk, tablename, callback) {
    let newUpdate = {
        _id: 'update',
        data:  [],  
        _rev: 0
    }
    setTimeout(function() {
    db.get('update').then(function(doc) { 
        newUpdate.data = doc.data
        newUpdate._rev = doc._rev
        if (tablename === 'pedidos'){
          // let pai = newUpdate.data[tablename]
          
          newUpdate.data[tablename].forEach(function (iupdated, idupdated)  {
              let propsupdated = JSON.stringify(Object.getOwnPropertyNames(iupdated))
              let valuesupdated = JSON.stringify(Object.values(iupdated))
              let fields = propsupdated.split('"').join("").split('[').join("").split(']').join("")
              let values = valuesupdated.split('"').join("'").split('[').join("").split(']').join("")
              console.log(fields)
              console.log(values)
              const xSplited = fields.split(',')
              const ySplited = values.split(',')
              let where = ''
              console.log(xSplited)
              let fieldsnvalues = []
              fieldsnvalues = xSplited.map((x, i) => {
                if (x===nomepk){
                  where = x+'='+ySplited[i]
                } else if (x ==='itens') {
                  console.log('itens')
                } else if (ySplited[i] === 'null') {
                    console.log('erro - '+x+'='+ySplited[i]) 
                } else return fieldsnvalues[i]=x+'='+ySplited[i]
                return ''
              })
              fieldsnvalues = JSON.stringify(fieldsnvalues).split('"').join("").split('[').join("").split(']').join("").split("=null,").join("*").split("null,").join("").split("*").join("=null,");
              atualizaItem(tablename,fieldsnvalues, where)
            })

        } else {
          newUpdate.data[tablename].forEach(function (iupdated, idupdated)  {
              let propsupdated = JSON.stringify(Object.getOwnPropertyNames(iupdated))
              let valuesupdated = JSON.stringify(Object.values(iupdated))
              let fields = propsupdated.split('"').join("").split('[').join("").split(']').join("")
              let values = valuesupdated.split('"').join("'").split('[').join("").split(']').join("")
              console.log(fields)
              console.log(values)
              const xSplited = fields.split(',')
              const ySplited = values.split(',')
              let where = ''
              console.log(xSplited)
              let fieldsnvalues = []
              fieldsnvalues = xSplited.map((x, i) => {
                // if (x===nomepk){
                //   where = x+'='+ySplited[i]
                // } else if (x ==='itens') {
                //   console.log('itens')
                // } else if (ySplited[i] === 'null') {
                //     console.log('erro - '+x+'='+ySplited[i]) 
                // } else return fieldsnvalues[i]=x+'='+ySplited[i]
                // return ''
                if (x===nomepk){
                  where = x+'='+ySplited[i]
                  return ''
                } else if (x ==='itens') {
                  console.log('itens')
                  return ''
                } else return fieldsnvalues[i]=x+'='+ySplited[i]
              })
              fieldsnvalues = JSON.stringify(fieldsnvalues).split('"').join("").split('[').join("").split(']').join("").split("=null,").join("*").split("null,").join("").split("*").join("=null,");
              atualizaItem(tablename,fieldsnvalues, where)
          })
        }

    }).then(function(response) {

    }).catch(function(err){
        console.log(err)
    })
    callback()
    }, 1000)

    console.log('Update sended!')
         

}

export function test(user){
  fetch(server+'/pedidos/'+user).then(ped => ped.json()).then(ped => {
    console.log(ped)
  })
}


export function syncData(user, callback){
    
    setTimeout(function() {
    let pegaPedidos = []
    fetch(server+'/pedidos/'+user).then(ped => ped.json()).then(ped => {
      ped.forEach(function(pedido, idpedido){
        ped[idpedido].itens=[];
        fetch(server+'/itepedidos/'+pedido.PK_PED).then(r => r.json()).then(r => {            
          ped[idpedido].itens=r
          ped[idpedido].itens.forEach(function (element, index)  {
              ped[idpedido].itens[index].mostraModal = false
          })
        })
      })
      pegaPedidos = ped
    }).then(ped => {
      fetch(server+'/sticms').then(st => st.json()).then(st => {
        fetch(server+'/produtos').then(pro => pro.json()).then(pro => {
          fetch(server+'/clientes/'+user).then(r => r.json()).then(r => {
            fetch(server+'/cpg').then(rcpg => rcpg.json()).then(rcpg => {
              let result = {
                _id: 'base',
                data: {
                  clientes: r,
                  pedidos: pegaPedidos,
                  produtos: pro,
                  st_icms: st,
                  cond_pag: rcpg
                }
              }
              console.log(st)

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
                      console.log('Base created!')
                  }).catch(function (err) {
                    console.log(err);
                  });
                }
              });

              let read = {
                _id: 'read',
                data: {
                  clientes: r,
                  pedidos: ped
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
                alert('Sincronizado!')
                callback()
              }).catch(function (err) {
                if (err.name === 'not_found') {
                  db.put(read).then(function (response) {
                      console.log('Read created!')
                      alert('Sincronizado!')
                      callback()
                  }).catch(function (err) {
                    console.log(err);
                  });
                }
              });
              
            })
          })
        })
      })
    })


    let create = {
        _id: 'create',
        data:  {
          clientes:[],
          pedidos:[]
        }       
      }
    db.get('create').then(function(doc) {
      let newCreate = {
        _id: 'create',
        data:  {
          clientes:[],
          pedidos:[]
        },
        _rev: doc._rev
      } 

        return db.put(newCreate)
    }).then(function(response) {
      console.log('Create updated!')
    }).catch(function (err) {
      if (err.name === 'not_found') {
        db.put(create).then(function (response) {
            console.log('Create created!')
        }).catch(function (err) {
          console.log(err);
        });
      }
    });

    let update = {
        _id: 'update',
        data:  {
          clientes:[],
          pedidos:[]
        }       
      }
    db.get('update').then(function(doc) {
      let newUpdate = {
        _id: 'update',
        data:  {
          clientes:[],
          pedidos:[]
        },
        _rev: doc._rev
      } 

        return db.put(newUpdate)
    }).then(function(response) {
      console.log('Update updated!')
    }).catch(function (err) {
      if (err.name === 'not_found') {
        db.put(update).then(function (response) {
            console.log('Update created!')
        }).catch(function (err) {
          console.log(err);
        });
      }
    });


    let deleted = {
        _id: 'delete',
        data:  {
          clientes:[],
          pedidos:[]
        }       
      }
    db.get('delete').then(function(doc) {
      let newDeleted = {
        _id: 'delete',
        data:  {
          clientes:[],
          pedidos:[]
        },
        _rev: doc._rev
      } 

        return db.put(newDeleted)
    }).then(function(response) {
      console.log('Delete updated!')
    }).catch(function (err) {
      if (err.name === 'not_found') {
        db.put(deleted).then(function (response) {
            console.log('Delete created!')
        }).catch(function (err) {
          console.log(err);
        });
      }
    }); 
    
    // callback()
   }, 2000)
   
}
