import React from "react";
import ReactDOM from "react-dom";
import Clock from 'react-live-clock';
import { Redirect } from 'react-router-dom';
import SideNav, { Nav, NavIcon, NavText } from 'react-sidenav';
import SvgIcon from 'react-icons-kit';
import _ from "lodash";
import { ic_account_box } from 'react-icons-kit/md/ic_account_box';
import { ic_home } from 'react-icons-kit/md/ic_home'
import { ic_add_shopping_cart } from 'react-icons-kit/md/ic_add_shopping_cart';
import { ic_exit_to_app } from 'react-icons-kit/md/ic_exit_to_app'
import {ic_build} from 'react-icons-kit/md/ic_build'
import {ic_sync} from 'react-icons-kit/md/ic_sync'
import {ic_assignment} from 'react-icons-kit/md/ic_assignment'
import {ListGroup, ListGroupItem, Button, Modal, OverlayTrigger, Tooltip, Popover} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'
import PouchDB from "pouchdb"
import { readTable, deleteData } from "./Utils";
import {ic_restore_page} from 'react-icons-kit/md/ic_restore_page'







const db = new PouchDB('macropecas')





class Example extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            clientes  : [],
            filter: [],
            filtered: [],
            show: false,
            op: 'r',
        };
        this.show = false
        this.handleRefresh = this.handleRefresh.bind(this);
        this.createItems = this.createItems.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleExcluir = this.handleExcluir.bind(this);
        this.handleClean = this.handleClean.bind(this);

    }

    componentDidMount(){
        readTable(Data => {this.setState({clientes: Data.data.clientes, filtered: Data.data.clientes})})      
    }
  
    createItems(item, id){
            return (
                <ListGroupItem header={item.RAZAO_SOCIAL} href="#" className="FormField__Grid">
                CNPJ: {item.CNPJ}<br/>
                Código: {item.PK_CLI}<br/>
                <LinkContainer to={"/clientes/registro/"+id}><button className="Grid__Button">Editar</button></LinkContainer><button id={id} className="Grid__Button" onClick={this.handleExcluir}>Excluir</button>
                </ListGroupItem>
            
            )
    }

    handleExcluir(e) {
        e.preventDefault()
        let table = this.state.clientes
        // console.log(this.state.clientes[e.target.id])
        let result = window.confirm('Confirma a exclusão de "'+table[e.target.id].RAZAO_SOCIAL.trim()+'"?')
        if (result) {
            let removed = table.splice(e.target.id, 1)
            this.setState({clientes: table})
            deleteData('clientes',removed, e.target.id)
        }
    }


    handleChange(e){
        e.preventDefault()
        let target = e.target
        let value = target.type === 'checkbox' ? target.checked : target.value
        let name = target.name
        let reg = this.state.filter
        reg[name] = value
        this.setState({
                    filter : reg
        })
    }
    

    handleRefresh(e){
        e.preventDefault()
        let dados = this.state.clientes
        let filtro = this.state.filter

        let filtrados = []
        if (typeof(filtro.RAZAO_SOCIAL) == 'undefined') {filtrados = dados} 
        else {
            dados.forEach(element => {
                    if (JSON.stringify(element.RAZAO_SOCIAL).toUpperCase().includes(filtro.RAZAO_SOCIAL.toUpperCase())){
                        filtrados.push(element)
                    }
            });
        }
        this.setState({filtered: filtrados}) 
    }

    handleClean(e){
        let dados = this.state.clientes
        let filtro = []
        filtro.RAZAO_SOCIAL = ''
        let filtrados = dados
        this.setState({filtered: filtrados, filter: filtro}) 

    }

 render() {
    let Data = this.state.filtered
    let listData = Data.map(this.createItems)
    let logou = localStorage.getItem("logou");
    console.log('a '+logou)
    if (logou === "true") {
    return (     
              <div className="App">
                <div className="App__Aside">
                    <div> 
                        <SideNav highlightColor='white' highlightBgColor='#506b55' defaultSelected='clientes'
                         onItemSelection={ (id, parent) => {
                            if (id==='exit'){  
                                localStorage.setItem("logou", false);    
                                this.props.history.push('/')
                            } else {this.props.history.push('/'+id)
                        }
                        }}>       
                            <Nav id='home'>
                                <NavIcon><SvgIcon size={30} icon={ic_home}/></NavIcon>    
                                <NavText> Página Inicial </NavText>
                            </Nav>
                            <Nav id='clientes'>
                                <NavIcon><SvgIcon size={30} icon={ic_account_box}/></NavIcon>    
                                <NavText> Clientes </NavText>
                            </Nav>
                            <Nav id='pedidos'>
                                <NavIcon><SvgIcon size={30} icon={ic_add_shopping_cart}/></NavIcon>
                                <NavText> Pedidos </NavText>
                            </Nav>
                            <Nav id='produtos'>
                                <NavIcon><SvgIcon size={30} icon={ic_build}/></NavIcon>
                                <NavText> Produtos </NavText>
                            </Nav>
                            <Nav id='notas'>
                                <NavIcon><SvgIcon size={30} icon={ic_assignment}/></NavIcon>
                                <NavText> Notas Fiscais </NavText>
                            </Nav>
                            <Nav id='sync'>
                                <NavIcon><SvgIcon size={30} icon={ic_sync}/></NavIcon>
                                <NavText> Sincronização </NavText>
                            </Nav>
                            <Nav id='exit'>
                                <NavIcon><SvgIcon size={30} icon={ic_exit_to_app}/></NavIcon>
                                <NavText> Sair </NavText>
                            </Nav>
                        </SideNav>
                    </div>
                </div> 
                <div className="App__Form">
                    <div className="FormCenter">
                        <div className="FormTitle">
                            <Clock format={'DD/MM/YYYY - HH:mm'} ticking={true}/> 
                            <br/>
                            <h1 className="FormTitle__Link--Active">Clientes</h1>
                        </div>
                        {/* <form className="FormFields">   */}
                            <div className="FormField">
                                <label className="FormFilter__Label" htmlFor="RAZAO_SOCIAL">Razão Social:</label>
                                <input type="text" id="RAZAO_SOCIAL" className="FormFilter__Input" 
                                name="RAZAO_SOCIAL" value={this.state.filter.RAZAO_SOCIAL} onChange={this.handleChange}/>
                                <div>
                                    <button className="FormField__Button" onClick={this.handleRefresh}>Filtrar</button>  
                                    <button className="FormField__Button" onClick={this.handleClean}>Limpar</button> 
                                </div>
                            </div>
                            <div>
                                
                            <br/>
                            <LinkContainer to={"/clientes/registro"}><button className="FormField__Button" onClick={this.handleShow}>Incluir</button></LinkContainer> 
                            </div>
                            <div>                    
                                <ListGroup>
                                    {listData}
                                </ListGroup>
                            </div>  
                        {/* </form>  */}
                    </div>
                </div>
            </div>

    );} else { return <Redirect exact to="/"/>}
  }
}




export default Example;
