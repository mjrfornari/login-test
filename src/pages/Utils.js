import React from "react";
import ReactLoading from 'react-loading';
import {Modal, Button} from 'react-bootstrap'
import SvgIcon from 'react-icons-kit';
import {check} from 'react-icons-kit/metrize/check'
// import namor from "namor";
// import { render } from "react-dom";
import "../App.css";
import PouchDB from 'pouchdb';

// const server = 'http://187.44.93.73:8080';

const server = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.hostname === "") ? 'http://localhost:3001/api': 'https://macropecasweb.sytes.net:8080/api';
const db = new PouchDB('macropecas', {auto_compaction: true});



export function savingItem(show, phase, funcao){
	if (phase === 1){
		return (
			<div style={show}>
				<Modal.Dialog className="Modal" >
					<Modal.Body className="ModalBg">    
						<div className="Saved">
							<ReactLoading type='spin' color='var(--cor-1)' height={'80px'} width={'80px'} className="Loading"/>
							<p className='ItemMsg'>Salvando registro...</p>
						</div> 
					</Modal.Body>
					<Modal.Footer className="ModalBg">
						<Button className="FormField__ButtonDisabled mr-20">Ok</Button>
					</Modal.Footer>
				</Modal.Dialog>
			</div>
		)
	} else {
		return(
			<div style={show}>
				<Modal.Dialog className="Modal" >
					<Modal.Body className="ModalBg">    
					<div className="Saved">
						<SvgIcon size={80} icon={check} style={{ color: 'var(--cor-1)', margin: '15px 15px 15px 15px' }}/>
						<p className='ItemMsg'>Registro salvo!</p>
					</div>
					</Modal.Body>
					<Modal.Footer className="ModalBg">
						<Button className="FormField__Button mr-20" onClick={() => {funcao()}}>Ok</Button>
					</Modal.Footer>
				</Modal.Dialog>
			</div>
		)		
	}
}


export function syncLoading(show, phase, funcao, texto, textopronto){
	if (phase === 1){
		return (
			<div style={show}>
				<Modal.Dialog className="Modal" >
					<Modal.Body className="ModalBg">    
						<div className="Saved">
							<ReactLoading type='spin' color='var(--cor-1)' height={'80px'} width={'80px'} className="Loading"/>
							<p className='ItemMsg'>{texto}</p>
						</div> 
					</Modal.Body>
					<Modal.Footer className="ModalBg">
						<Button className="FormField__ButtonDisabled mr-20">Ok</Button>
					</Modal.Footer>
				</Modal.Dialog>
			</div>
		)
	} else {
		return(
			<div style={show}>
				<Modal.Dialog className="Modal" >
					<Modal.Body className="ModalBg">    
					<div className="Saved">
						<SvgIcon size={80} icon={check} style={{ color: 'var(--cor-1)', margin: '15px 15px 15px 15px' }}/>
						<p className='ItemMsg'>{textopronto}</p>
					</div>
					</Modal.Body>
					<Modal.Footer className="ModalBg">
						<Button className="FormField__Button mr-20" onClick={() => {funcao()}}>Ok</Button>
					</Modal.Footer>
				</Modal.Dialog>
			</div>
		)		
	}
}


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
        name={fieldname} value={value || ''} onChange={(event) => funcao(event)}/>
      </div>
    )
  } else {
    return (
      <div className="FormField">
        <label className="FormField__Label" htmlFor={fieldname}>{displayname}</label>
        <input type="text" id={fieldname} className="FormField__Input" 
        name={fieldname} value={value || ''} onChange={(event) => funcao(event)}/>
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

export function dateSql(texto, entre){
    let data = ''
    if (texto != null){
      if (typeof entre !== 'undefined'){
        data=entre+texto.substr(0,4)+'-'+texto.substr(5,2)+'-'+texto.substr(8,2)+entre
      } else {
        data=texto.substr(0,4)+'-'+texto.substr(5,2)+'-'+texto.substr(8,2)
      }
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

export function now(aux){
    let now = new Date ()
    now.setDate(now.getDate() + aux)
    let year = now.getFullYear()
    let month = now.getMonth()+1<10 ? '0'+now.getMonth()+1 : now.getMonth()+1
    let day = now.getDate()<10 ? '0'+now.getDate() : now.getDate()
    return year+'-'+month+'-'+day
}

export function date2str(data){
    let date = new Date(data)
    let year = date.getFullYear()
    let month = date.getMonth()+1<10 ? '0'+date.getMonth()+1 : date.getMonth()+1
    let day = date.getDate()<10 ? '0'+date.getDate() : date.getDate()
    let hour = date.getHours()<10 ? '0'+date.getHours() : date.getHours()
    let min = date.getMinutes()<10 ? '0'+date.getMinutes() : date.getMinutes()
    return (day+'/'+month+'/'+year+' às '+hour+':'+min)
}


export function editData(tabela, item, id, callback) {
  return readTable(Data => { 
    let read = Data
    return db.get('read').then(function(doc) {
      let newRead = {
        _id: 'read',
        data:  Data.data,
        _rev: doc._rev
     }     
     newRead.data[tabela][id] = item  
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
        //   alert('Registro alterado com sucesso!') 
          callback('Button')
        }).catch(function (err) {
          if (err.name === 'not_found') {
            db.put(update).then(function (response) {
              console.log('Update Created!')
            //   alert('Registro alterado com sucesso!') 
              callback('Button')
            }).catch(function (err) {
              console.log(err);
            });
          }
        });
      })
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

export function appendData(tabela, item, callback) {
        
  //console.log(item)
  return readTable(Data => { 
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
        //   alert('Registro incluído com sucesso!') 
          callback('Button')
        }).catch(function (err) {
          if (err.name === 'not_found') {
            db.put(create).then(function (response) {
                console.log('Create Created!')
                // alert('Registro incluído com sucesso!') 
                callback('Button')
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
        console.log(element)
        console.log(id)
        console.log('*********')
        if (Number(element.read) === Number(id)) {
            newCreate.data[tabela].splice(index,1)
        } 
      });
      table = newCreate
      table.data[tabela].forEach(function (element, index)  {
        if (Number(element.read) > Number(id)) {
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
  });
  })



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
        if (Number(element.read) === Number(id)) {
            newUpdate.data[tabela].splice(index,1)
        } 
      });
      table = newUpdate
      table.data[tabela].forEach(function (element, index)  {
        if (Number(element.read) > Number(id)) {
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
  });
})
 

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



export function createToFirebird(callback) {
    let newCreate = {
        _id: 'create',
        data:  [],
        _rev: 0
    }
    let pedidos = []
    let itepedidos = []
   setTimeout(function() {
    db.get('create').then(function(doc) { 
        newCreate.data = doc.data
        newCreate._rev = doc._rev
        let clientes = doc.data.clientes
        pedidos = doc.data.pedidos
        const geraPkListPromise = clientes.map((element, index) => geraPk('PK_CLI').then(Data => ( { ...element, PK_CLI: Data[0].VALOR })))
        
        return Promise.all(geraPkListPromise)
    }).then(data => {
        newCreate.data.clientes = data
        const geraPkListPormisePedidos = pedidos.map((element, index) => geraPk('PK_PED').then(Data => ( { ...element, PK_PED: Data[0].VALOR })))
        // newCreate.data.pedidos = data.data.pedidos

        return Promise.all(geraPkListPormisePedidos)
    }).then(data => {
        const geraPkListPormisePedidos = data.map((element, index) => geraPk('NUMWEB').then(Data => ( { ...element, NUMWEB: Data[0].VALOR })))
        console.log(data)
        return Promise.all(geraPkListPormisePedidos)
    }).then(data => {
        let itens = []
        pedidos = data
        data.forEach((element, index) => {
          element.itens.forEach((elementson, indexson)=>{
            itens.push({...elementson, FK_PED: element.PK_PED})
          })
        })
        const geraPkListPormiseItePedidos = itens.map((element, index) => geraPk('PK_IPE').then(Data => ( { ...element, PK_IPE: Data[0].VALOR })))
        console.log(itens)
        return Promise.all(geraPkListPormiseItePedidos)
    }).then(data => {
        console.log(data)
        itepedidos = data
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
            console.log(fields)
            console.log(values)
            criaItem('clientes',fields, values)
            db.get('update').then(function(doc) {
              let newUpdate = {
                _id: 'update',
                data:  doc.data,
                _rev: doc._rev
              }
              newUpdate.data.clientes.forEach(function (iupdated, idupdated) {
                  if (icreated.read === iupdated.read){
                    newUpdate.data.clientes[idupdated]['PK_CLI']=icreated['PK_CLI']
                  }
              })
              return db.put(newUpdate)
            }).then(function(response) {
              console.log('Update updated!')

            })
            // newCreate.data.clientes.splice(idcreate,1)
            // console.log(newCreate.data.clientes)
          })

                pedidos.forEach(function (icreated, idcreate)  {
                icreated.itens = []
                icreated.RAZAO_SOCIAL = []
                icreated.NOMECPG = []
                console.log(icreated.VALOR_CALCULADO)
                let dataped = icreated.DATA
                icreated.DATA = dateSql(dataped)
                let propscreated = JSON.stringify(Object.getOwnPropertyNames(icreated))
                let valuescreated = JSON.stringify(Object.values(icreated))
                let fields = propscreated.split('"').join("").split('[').join("").split(']').join("").split('itens,').join("").split('IMPORTADO').join("IMPORTACAO").split(',RAZAO_SOCIAL').join("").split(',NOMECPG').join("")
                let values = valuescreated.split('"').join("'").split('[').join("").split(']').join("").split(',,').join(",").split(',,').join(",")
                fields = fields+", FK_VEN"
                let usuario = localStorage.getItem("macropecas")
                values = values+", "+usuario
                console.log(fields)
                console.log(values)
                criaItem('pedidos_venda',fields, values)
                db.get('update').then(function(doc) {
                  let newUpdate = {
                    _id: 'update',
                    data:  doc.data,
                    _rev: doc._rev
                  }
                  if (typeof newUpdate.data.pedidos !== 'undefined'){
                    newUpdate.data.pedidos.forEach(function (iupdated, idupdated) { 
                        if (Number(icreated.read) === Number(iupdated.read)){
                          iupdated['PK_PED']=icreated['PK_PED']
                          iupdated['NUMWEB']=icreated['NUMWEB']
                          console.log(icreated.PK_PED+' ** '+icreated.NUMWEB)
                          iupdated.itens.forEach(function (iupdatedson, idupdatedson) {
                            iupdatedson.FK_PED = icreated['PK_PED']
                          })
                        }
                    })
                  }
                  return db.put(newUpdate)
                }).then(function(response) {
                  console.log('Update updated!')
                  itepedidos.forEach(function (icreated, idcreate)  {
                    icreated.DESCRICAOPRO = []
                    icreated.CODIGOPRO = '%$#'
                    icreated.OBS_PROMOCIONAL = '%$#'
                    icreated.TOTAL = '%$#'
                    icreated.id = []
                    icreated.QUANTIDADE=Number(icreated.QUANTIDADE)
                    icreated.DESCONTO1=Number(icreated.DESCONTO1)
                    icreated.DESCONTO2=Number(icreated.DESCONTO2)
                    icreated.VALOR_IPI =[]
                    let propscreated = JSON.stringify(Object.getOwnPropertyNames(icreated))
                    let valuescreated = JSON.stringify(Object.values(icreated))
                    let fields = propscreated.split('"').join("").split('[').join("").split(']').join("").split(',DESCRICAOPRO').join("").split('CODIGOPRO,').join("").split(',id').join("").split(',VALOR_IPI').join("").split(',OBS_PROMOCIONAL').join("").split(',TOTAL').join("")
                    let values = valuescreated.split('"').join("'").split('[').join("").split(']').join("").split(',,').join(",").split(',,').join(",").split(",'%$#'").join("").split("'%$#',").join("")
                    console.log(fields)
                    console.log(values)
                    criaItem('itens_ped_venda',fields, values)
                    db.get('update').then(function(doc) {
                      let newUpdate = {
                        _id: 'update',
                        data:  doc.data,
                        _rev: doc._rev
                      }
                      if (typeof newUpdate.data.pedidos !== 'undefined'){
                        newUpdate.data.pedidos.forEach(function (iupdated, idupdated) {
                            if (Number(iupdated.PK_PED) === Number(icreated.FK_PED)){
                              iupdated.itens.forEach(function (iupdatedson, idupdatedson) {
                                if (Number(iupdatedson.read) === Number(icreated.read)){
                                  iupdatedson.PK_IPE = icreated.PK_IPE
                                }
                              })
                            }
                        })
                      }
                      // return db.put(newUpdate)
                    }).then(function(response) {
                      console.log('Update updated!')
                    })
                    // itepedidos.splice(idcreate,1)
                    // console.log(newCreate.data.clientes)
                  })
                })
                // pedidos.splice(idcreate,1)
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


export function updateToFirebird(callback) {
    let newUpdate = {
        _id: 'update',
        data:  [],  
        _rev: 0
    }
    setTimeout(function() {
    db.get('update').then(function(doc) { 
        newUpdate.data = doc.data
        newUpdate._rev = doc._rev

          newUpdate.data.clientes.forEach(function (iupdated, idupdated)  {
              let propsupdated = JSON.stringify(Object.getOwnPropertyNames(iupdated))
              let valuesupdated = JSON.stringify(Object.values(iupdated))
              let fields = propsupdated.split('"').join("").split('[').join("").split(']').join("")
              let values = valuesupdated.split('"').join("'").split('[').join("").split(']').join("")
              // console.log(fields)
              // console.log(values)
              const xSplited = fields.split(',')
              const ySplited = values.split(',')
              let where = ''
              // console.log(xSplited)
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
                if (x==='PK_CLI'){
                  where = x+'='+ySplited[i]
                  return ''
                } else if (x ==='itens') {
                  console.log('itens')
                  return ''
                } else return fieldsnvalues[i]=x+'='+ySplited[i]
              })
              fieldsnvalues = JSON.stringify(fieldsnvalues).split('"').join("").split('[').join("").split(']').join("").split("=null,").join("*").split("null,").join("").split("*").join("=null,");
              atualizaItem('clientes',fieldsnvalues, where)
          })

          newUpdate.data.pedidos.forEach(function (iupdated, idupdated)  {
               iupdated.itens.forEach(function (iupdatedson, idupdatedson)  {
                iupdatedson.DESCRICAOPRO = []
                iupdatedson.CODIGOPRO = '%$#'
                iupdatedson.OBS_PROMOCIONAL = '%$#'
                iupdatedson.TOTAL = '%$#'
                iupdatedson.id = []
                iupdatedson.FK_PED = iupdated.PK_PED
                iupdatedson.mostraModal='%$#'
                iupdatedson.QUANTIDADE=Number(iupdatedson.QUANTIDADE)
                iupdatedson.DESCONTO1=Number(iupdatedson.DESCONTO1)
                iupdatedson.DESCONTO2=Number(iupdatedson.DESCONTO2)
                iupdatedson.VALOR_IPI =[]
                let propsupdatedson = JSON.stringify(Object.getOwnPropertyNames(iupdatedson))
                let valuesupdatedson = JSON.stringify(Object.values(iupdatedson))
                let fieldsson = propsupdatedson.split('"').join("").split('[').join("").split(']').join("").split(',DESCRICAOPRO').join("").split(',mostraModal').join("").split('CODIGOPRO,').join("").split(',id').join("").split(',VALOR_IPI').join("").split(',OBS_PROMOCIONAL').join("").split(',TOTAL').join("")
                let valuesson = valuesupdatedson.split('"').join("'").split('[').join("").split(']').join("").split(',,').join(",").split(',,').join(",").split(",'%$#'").join("").split("'%$#',").join("")
                if (typeof iupdatedson.PK_IPE === 'undefined'){
                  geraPk('PK_IPE').then(res => {
                    fieldsson=fieldsson+',PK_IPE'
                    valuesson=valuesson+','+res[0].VALOR})
                  .then(res =>{
                    criaItem('itens_ped_venda',fieldsson, valuesson)  
                  }) 
                } else {
                  const xSplitedson = fieldsson.split(',')
                  const ySplitedson = valuesson.split(',')
                  let whereson = ''
                  let fieldsnvaluesson = []
                  xSplitedson.forEach((xson, ison) => {
                    if (xson==='PK_IPE'){
                      whereson = xson+'='+ySplitedson[ison]
                    } else fieldsnvaluesson[ison]=xson+'='+ySplitedson[ison]
                  })
                  fieldsnvaluesson = JSON.stringify(fieldsnvaluesson).split('"').join("").split('[').join("").split(']').join("").split("=null,").join("*").split("null,").join("").split("*").join("=null,");
                  atualizaItem('itens_ped_venda',fieldsnvaluesson, whereson)
                }
              })
              iupdated.itens = []
              iupdated.RAZAO_SOCIAL = []
              iupdated.NOMECPG = []
              let propsupdated = JSON.stringify(Object.getOwnPropertyNames(iupdated))
              let valuesupdated = JSON.stringify(Object.values(iupdated))
              let fields = propsupdated.split('"').join("").split('[').join("").split(']').join("").split('itens,').join("").split('IMPORTADO').join("IMPORTACAO").split(',RAZAO_SOCIAL').join("").split(',NOMECPG').join("")
              let values = valuesupdated.split('"').join("'").split('[').join("").split(']').join("").split(',,').join(",").split(',,').join(",")

              const xSplited = fields.split(',')
              const ySplited = values.split(',')
              let where = ''
              // console.log(xSplited)
              let fieldsnvalues = []
              xSplited.forEach((x, i) => {
                if (x==='PK_PED'){
                  where = x+'='+ySplited[i]
                } else if (x==='DATA'){
                  fieldsnvalues[i]=x+'='+dateSql(ySplited[i].split("'").join(""), "'")
                } else fieldsnvalues[i]=x+'='+ySplited[i]
              })
              fieldsnvalues = JSON.stringify(fieldsnvalues).split('"').join("").split('[').join("").split(']').join("").split("=null,").join("*").split("null,").join("").split("*").join("=null,");

              atualizaItem('pedidos_venda',fieldsnvalues, where)
             
          })

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
      console.log(ped)
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
              fetch(server+'/cidades').then(cid => cid.json()).then(cid => {
                fetch(server+'/descontolog').then(desc => desc.json()).then(desc => {  
                  let result = {
                    _id: 'base',
                    data: {
                      clientes: r,
                      pedidos: pegaPedidos,
                      produtos: pro,
                      st_icms: st,
                      cond_pag: rcpg,
                      cidades: cid,
                      descontolog: desc
                    }
                  }
                  result.data.clientes.forEach(function (element, index)  {
                    if ( Number(element.FK_CID) > 0 ) {
                      let cid = result.data.cidades.filter((value) => { return value.PK_CID === element.FK_CID})
                      element.CIDADE = cid[0].NOMECIDADE+' ('+cid[0].UF+')'
                      if (cid[0].NOMECIDADE === 'OUTROS'){
                        console.log(cid[0])
                      }
                    }
                  })
                  

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
                      pedidos: pegaPedidos,
                      produtos: pro,
                      st_icms: st,
                      cond_pag: rcpg,
                      cidades: cid,
                      descontolog: desc
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
                    // alert('Sincronizado!')
                    callback()
                  }).catch(function (err) {
                    if (err.name === 'not_found') {
                      db.put(read).then(function (response) {
                          console.log('Read created!')
                          // alert('Sincronizado!')
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
